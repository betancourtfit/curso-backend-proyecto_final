import { userModel } from "../models/user.models.js";
import CustomError from "../../services/errors/CustomError.js";
import EError  from "../../services/errors/enum.js";
import { generateUserError } from "../../services/errors/info.js";
import { generateToken } from "../../utils/jwt.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../../config/mailer.js";
import { validatePassword, hashPassword } from "../../utils/bcrypt.js";
import jwt from 'jsonwebtoken';

// controladores del modelo de usuarios
export const getUsers = async (req, res) => {
    const {limit, page} = req.query;
    let query = {};  
    let options = {
        lim: parseInt(limit) || 10,
        pag: parseInt(page) || 1
    };

    try {
        const users = await userModel.paginate(query, options);

        if(users) {
            return res.status(200).send(users)
        }
        res.status(404).send({message: 'No se encontraron usuarios'})
    } catch (error) {
        res.status(500).send({message: 'Error al obtener los usuarios'})
    }
}

export const getUser = async (req, res) => {
    const {id} = req.params;

    try {
        const user = await userModel.findById(id);

        if(user) {
            return res.status(200).send(user)
        }
        res.status(404).send({message: 'No se encontró el usuario'})
    } catch (error) {
        res.status(500).send({message: 'Error al obtener el usuario'})
    }
}

const findUserByEmail = async (email) => {
    return await userModel.findOne({ email: email });
};

export const getUserByEmail = async (req, res) => {
    console.log('req.body', req);
    const email = req;
    console.log('email get', email);

    try {
        // const user = await userModel.findOne({ email: email });
        const user = await findUserByEmail(email);
        console.log('user getbymail', user);
        if(user) {
            return res.status(200).send(user)
        }
        res.status(404).send({message: 'No se encontró el usuario'})
    } catch (error) {
        res.status(500).send({message: 'Error al obtener el usuario'})
    }
}

export const createUser = async (req, res) => {
    console.log('req.body.', req);
    const {first_name, last_name, email, password, age} = req;
    try {
        if(!first_name|| !last_name || !email || !password || !age) {
            console.log("Missing fields");
            CustomError.createError({
                name: "Use creation error",
                cause: generateUserError({first_name, last_name, email, password, age}),
                message: "Missing fields",
                code: EError.INVALID_TYPES_ERROR
            })
        }
        const user = await userModel.create({first_name, last_name, email, password, age});
        console.log('user cre', user);
        if(user) {
            return res.status(201).send(user)
        }
        res.status(400).send({message: 'No se pudo crear el usuario'})
    } catch (error) {
        if(error.code === 11000) {
            return res.status(400).send({message: 'El email ya existe'})
        }
        res.status(500).send({message: 'Error al crear el usuario'})
    }
}

export const updateUser = async (req, res) => {
    const {id} = req.params;
    const {name, lastName, email, password, role} = req.body;

    try {
        const user = await userModel.findByIdAndUpdate(id, {name, lastName, email, password, role}, {new: true});

        if(user) {
            return res.status(200).send(user)
        }
        res.status(404).send({message: 'No se encontró el usuario'})
    } catch (error) {
        res.status(500).send({message: 'Error al actualizar el usuario'})
    }
}

export const deleteUser = async (req, res) => {
    const {id} = req.params;

    try {
        const user = await userModel.findByIdAndDelete(id);

        if(user) {
            return res.status(200).send(user)
        }
        res.status(404).send({message: 'No se encontró el usuario'})
    } catch (error) {
        res.status(500).send({message: 'Error al eliminar el usuario'})
    }
}

const userSignup = async (req, res) => {
    try {
        if(!req.user){
            res.status(401).send({ resultado: 'Usuario invalido' });
        }

        res.status(200).send({ resultado: 'Usuario creado exitosamente.' });
    }
    catch (error) {
        console.error('Hubo un error al registrar el usuario:', error);
        res.status(500).send({ mensaje: `Error al registrar ${error}` });
    }
};

const failRegister = (req, res) => {
    console.log('Error al registrar');
    res.status(401).send({ resultado: 'Error al registrar' });
};

const github = (req, res) => {
    res.status(200).send({ resultado: 'Usuario creado exitosamente.' });
};

const githubCallback = (req, res) => {
    res.status(200).send({ resultado: 'Usuario creado exitosamente.' });
};

export const requestResetPassword = async (req, res) => {
    const { email } = req.body;
    console.log('email', email);
    try {
        // 1. Verificar si el usuario existe
        const user = await userModel.findOne({ email: email });
        if (!user) {
            req.logger.debug(`Restablecimiento de contraseña solicitado para email no registrado: ${email}`);
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        // 2. Generar token de restablecimiento
        const resetToken = generateToken(user);  // Usando JWT para generar un token
        // Aquí puedes añadir lógica para guardar el token en la base de datos si es necesario

        // 3. Enviar email al usuario con instrucciones para restablecer la contraseña
        await sendPasswordResetEmail(email, resetToken);  // Asumiendo que el email incluirá el token


        res.status(200).send({ message: 'Instrucciones para restablecer la contraseña enviadas al correo electrónico.' });
    } catch (error) {
        req.logger.error(`Error en solicitud de restablecimiento de contraseña: ${error.message}`);
        res.status(500).send({ message: 'Error en la solicitud de restablecimiento de contraseña' });
    }
};

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    console.log('token', token);
    console.log('newPassword', newPassword);
    const decodedToken = token.replace(/_dot_/g, '.'); // Reemplaza '_dot_' de nuevo con puntos
    console.log('decodedToken', decodedToken);

    try {
        // 1. Verificar el token
        const decoded = jwt.verify(decodedToken, process.env.JWT_SECRET);
        console.log('decoded', decoded);
        if (!decoded || !decoded.user) {
            return res.status(400).send({ message: 'Token inválido o expirado' });
        }

        // 2. Buscar el usuario asociado al token
        console.log('antes de user')
        const user = await userModel.findById(decoded.user._id);
        console.log('user', user);
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        // 3. Validar y actualizar la contraseña
        if (!newPassword) {
            return res.status(400).send({ message: 'Contraseña no válida' });
        }

        user.password = await hashPassword(newPassword);
        await user.save();

        res.status(200).send({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        req.logger.error(`Error en restablecimiento de contraseña: ${error.message}`);
        res.status(500).send({ message: 'Error al restablecer la contraseña' });
    }
};

// Exportar todas las funciones juntas
export const userController = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    userSignup,
    failRegister,
    github,
    githubCallback,
    getUserByEmail,
    requestResetPassword,
    resetPassword
}