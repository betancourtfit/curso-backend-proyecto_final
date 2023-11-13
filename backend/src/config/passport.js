import local from 'passport-local';
import passport from 'passport';
import GithubStrategy from 'passport-github2';
import { hashPassword, validatePassword } from '../utils/bcrypt.js';
import { userManager } from '../dao/models/userManager.js';
import jwt from 'passport-jwt';
import dotenv from 'dotenv';



//Definir la estrategia local
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt //Extrar de las cookies el token

const InitializePassport = () => {

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => { //jwt_payload = info del token (en este caso, datos del cliente)
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }

    }))

    //Definir la estrategia local
    passport.use('signup', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    }, async (req, username, password, done) => {

        const { first_name, last_name, email, age } = req.body;
        try {
            //Buscar el usuario en la BD
            const user = await userManager.findByEmail(email);
            //Si el usuario ya existe
            if (user) {
                return done(null, false, { message: 'El usuario ya existe' });
            }

            //Si el usuario no existe aun, crearlo
            const hashPass = await hashPassword(password);
            const createUser = await userManager.create({ 
                first_name,
                last_name,
                email,
                age,
                password: hashPass
            });
            return done(null, createUser, { message: 'Usuario creado exitosamente.' });
            
        } catch (error) {
            return done(error);
        }
    }));

    //login del usuario
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await userManager.findByEmail(email);

                //Si el usuario no existe
                if (!user) {
                    return done(null, false, { message: 'El usuario no existe.' });
                }

                //Si el usuario existe, validar la contraseña
                if (!validatePassword(password, user.password)) {
                    console.log('Contraseña incorrecta')
                    return done(null, false, { message: 'La contraseña es incorrecta.' });
                }

                //Si el usuario existe y la contraseña es correcta, retornar el usuario
                console.log('Usuario logueado correctamente')
                return done(null, user);
            }
            catch (error) {
                return done(error);
            }
    }))


    passport.use('github', new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userManager.findByEmail(profile._json.email);
            if (user) {
                return done(null, user);
            } else {
                const hashPass = await hashPassword(profile._json.email);
                const newUser = await userManager.create({
                    first_name: profile._json.name,
                    last_name: ' ',
                    email: profile._json.email,
                    age: 18,
                    password: hashPass
                });
                return done(null, newUser);
            }
        } catch (error) {
            return done(error);
        }
    }));

    //Serializar al usuario
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    //Deserializar al usuario
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userManager.findById(id);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    });
}

export default InitializePassport;