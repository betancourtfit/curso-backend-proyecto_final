// fetchUsersEmails.js
import mongoose from 'mongoose';
import { userModel } from './src/dao/models/user.models.js'; // Asegúrate de que la ruta sea correcta
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(`mongodb+srv://curso_backend_juan:${process.env.passmongodb}@cluster0.c47d4cv.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            const users = await userModel.find().select('email -_id'); // Selecciona solo el campo 'email'
            const emails = users.map(user => user.email);
            console.log('Correos Electrónicos de Usuarios:', emails);
        } catch (error) {
            console.error('Error al obtener los correos electrónicos:', error);
        } finally {
            mongoose.disconnect();
        }
    });

// usuarios a eliminar
const userfordelete = [
    'juanita123@gmail.com',
    'juanabanana@gmail.com',
    'raul@gmail.com',
    'raulcito@gmail.com',
    'adminCoder@coder.com',
    'lulita@gmail.com',
    'loli@gmail.com',
    'betty@gmail.com',
    'mariadelbarrio@gmail.com',
    'marialadelbarrrio2@gmail.com',
    'beta.juan.c@gmail.com',
    'rodrigo@email.com',
    'lalolanda@gmail.com',
    'lalitolanda@gmail.com',
    'juanita@gmail.com',
    'angel@gmail.com',
    'winnie@gmail.com']

// Eliminar usuarios
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        try {
            const users = await userModel.deleteMany({ email: { $in: userfordelete } });
            console.log('Usuarios eliminados:', users.deletedCount);
        } catch (error) {
            console.error('Error al eliminar los usuarios:', error);
        } finally {
            mongoose.disconnect();
        }
    });

mongoose.connect(`mongodb+srv://curso_backend_juan:${process.env.passmongodb}@cluster0.c47d4cv.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    try {
        const users = await userModel.find().select('email -_id'); // Selecciona solo el campo 'email'
        const emails = users.map(user => user.email);
        console.log('Correos Electrónicos de Usuarios:', emails);
    } catch (error) {
        console.error('Error al obtener los correos electrónicos:', error);
    } finally {
        mongoose.disconnect();
    }
});