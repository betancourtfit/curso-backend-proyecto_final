import {Router } from "express"
import { userManager } from "../dao/models/userManager.js";
import passport from 'passport';
import { sendVerificationEmail } from "../config/mailer.js";
import { userController } from "../dao/Controllers/user.controller.js"; 

const userRouter = Router();


// Reemplazar llamadas a userManager con userController
userRouter.get('/', userController.getUsers);
userRouter.get('/:id', userController.getUser);
userRouter.get('/email/:email', userController.getUserByEmail);




userRouter.post('/signup', async (req, res, next) => {
    passport.authenticate('signup', async (err, user, info) => {
        if (err || !user) {
            // Maneja el error o la falta del usuario
            console.error('Hubo un error al registrar el usuario:', err || info.message);
            return res.status(500).send({ mensaje: `Error al registrar: ${err.message || info.message}` });
        }
        try {
            if (!user) throw new Error(info.message);
            // Generar código de verificación

            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
            const expiryTime = new Date(new Date().getTime() + 30 * 60000); // 30 minutos desde ahora

            // Actualizar usuario con el código y la hora de expiración
            user.email_verification_code = verificationCode;
            user.verification_code_expiry = expiryTime;
            // Guardar el usuario actualizado
            await user.save();
            // Generar y enviar el correo con el código de verificación
            // await sendVerificationEmail(user.email, verificationCode);
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


userRouter.get('/failregister', userController.failRegister);
userRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), userController.github);
userRouter.get('/githubCallback', passport.authenticate('github', {scope: ['user:email']}), userController.githubCallback);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);
userRouter.post('/request-reset-password', userController.requestResetPassword);
userRouter.post('/reset-password', userController.resetPassword);
userRouter.put('/premium/:email', userController.toggleUserRoleByEmail);


userRouter.post('/verify-code', async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        const user = await userManager.findByEmail(email);

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        if (user.email_verified) {
            throw new Error('El usuario ya ha sido verificado');
        }

        if (user.email_verification_code !== verificationCode) {
            throw new Error('Código de verificación incorrecto');
        }

        if (user.verification_code_expiry < new Date()) {
            throw new Error('El código de verificación ha expirado');
        }

        user.email_verified = true;
        user.email_verification_code = null;
        user.verification_code_expiry = null;

        await user.save();

        res.status(200).send({ resultado: 'Usuario verificado exitosamente.' });
    } catch (error) {
        console.error('Hubo un error al verificar el usuario:', error);
        res.status(500).send({ mensaje: `Error al verificar: ${error.message}` });
    }
});

export default userRouter
