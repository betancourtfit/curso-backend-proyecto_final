import {Router } from "express"
import { userManager } from "../dao/models/userManager.js";
import passport from 'passport';

const userRouter = Router();

userRouter.get('/', async (req, res) => {
    const { limit, page } = req.query;
    try {
        const users = await userManager.findAll(limit, page);
        res.status(200).send({respuesta: 'ok', mensaje: users})
    } catch (error){
        res.status(400).send({respuesta: 'Error', mensaje: error})
    }
})

userRouter.get('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const user = await userManager.findById(id);
        if (user)
            res.status(200).send({respuesta: 'ok', mensaje: user})
        else 
            res.status(404).send({respuesta: 'Error', mensaje: 'User not found'})
    } catch (error){
        res.status(400).send({respuesta: 'Error', mensaje: error})
    }
})


// userRouter.post('/signup', passport.authenticate('signup',{failureRedirect:'/failregister'}), async (req, res) => {
//     try {
//         if(!req.user){
//             res.status(401).send({ resultado: 'Usuario invalido' });
//         }

//         res.status(200).send({ resultado: 'Usuario creado exitosamente.' });
//     }
//     catch (error) {
//         console.error('Hubo un error al registrar el usuario:', error);
//         res.status(500).send({ mensaje: `Error al registrar ${error}` });
//     }
// });

userRouter.post('/signup', async (req, res, next) => {
    passport.authenticate('signup', async (err, user, info) => {
        try {
            if (err) {
                throw new Error(err);
            }
            if (!user) {
                throw new Error(info.message);
            }
            req.logIn(user, function(err) {
                if (err) {
                    throw new Error(err);
                }
                return res.status(200).send({ resultado: 'Usuario creado exitosamente.' });
            });
        } catch (error) {
            console.error('Hubo un error al registrar el usuario:', error);
            res.status(500).send({ mensaje: `Error al registrar: ${error.message}` });
        }
    })(req, res, next);
});

userRouter.get('/failregister', (req, res) => {
    console.log('Error al registrar');
    res.status(401).send({ resultado: 'Error al registrar' });
});

userRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => { 
    res.status(200).send({ resultado: 'Usuario creado exitosamente.' });
});

userRouter.get('/githubCallback', passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
    res.status(200).send({ resultado: 'Usuario creado exitosamente.' });
});

userRouter.put('/:id', async (req, res) => {
    const {id} = req.params
    const {first_name, last_name, age, email, password} = req.body
    try {
        const user = await userManager.updateById(id, {first_name, last_name, age, email, password});
        if (user)
            res.status(200).send({respuesta: 'ok', mensaje: user})
        else 
            res.status(404).send({respuesta: 'Error', mensaje: 'User not found'})
    } catch (error){
        res.status(400).send({respuesta: 'Error', mensaje: error})
    }
})

userRouter.delete('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const user = await userManager.deleteById(id);
        if (user)
            res.status(200).send({respuesta: 'ok', mensaje: user})
        else 
            res.status(404).send({respuesta: 'Error', mensaje: 'User not found'})
    } catch (error){
        res.status(400).send({respuesta: 'Error', mensaje: error})
    }
})

export default userRouter
