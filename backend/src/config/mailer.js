import 'dotenv/config';
import nodemailer from 'nodemailer';
import fs from 'fs';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar o nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        authMethod: 'LOGIN',
    }
});

// Crear una función para enviar el correo electrónico
export const sendOrderConfirmationEmail = async (orderCode, products, totalAmount, email) => {
    try {
        const filePath = path.join(__dirname, '../public/html/orderConfirmation.html');
        let orderConfirmationHtml = fs.readFileSync(filePath, 'utf-8');

        let productsHtml = products.map(product => 
            `<tr><td>${product.title}</td><td>${product.quantity}</td></tr>`
        ).join('');

        orderConfirmationHtml = orderConfirmationHtml.replace('{{orderId}}', orderCode)
                                                     .replace('{{productsRows}}', productsHtml)
                                                     .replace('{{totalAmount}}', totalAmount);

        let mailOptions = {
            from: 'TaDa',
            to: email,
            subject: 'Confirmación de la orden',
            html: orderConfirmationHtml
        };

        await transporter.sendMail(mailOptions);
        console.log('Email enviado');
    } catch (error) {
        console.log('Error al enviar email:', error);
        throw error; // Propaga el error para manejarlo en el controlador
    }
};

// Función para enviar el correo electrónico de verificación
export const sendVerificationEmail = async (email, verificationCode) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verificación de Email',
            text: `Tu código de verificación es: ${verificationCode}`
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar el correo de verificación:', error);
        throw error;
    }
};

// Función para enviar el correo electrónico de restablecimiento de contraseña
export const sendPasswordResetEmail = async (email, token) => {
    console.log('token', token);
    const encodedToken = token.replace(/\./g, '_dot_'); // Reemplaza todos los puntos con '_dot_'
    console.log('encodedToken', encodedToken);
    console.log('¿Son iguales token y encodedToken?', token === encodedToken);

    const resetPasswordUrl = `http://localhost:5173/password-reset/${encodedToken}`;

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Restablecimiento de contraseña',
            html: `
                <h1>Restablecimiento de contraseña</h1>
                <p>Has solicitado restablecer tu contraseña. Haz clic en el enlace de abajo para establecer una nueva:</p>
                <a href="${resetPasswordUrl}">Restablecer contraseña</a>
                <p>Si no has solicitado restablecer tu contraseña, ignora este correo.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Correo de restablecimiento de contraseña enviado');
    } catch (error) {
        console.error('Error al enviar el correo de restablecimiento de contraseña:', error);
        throw error;
    }
};
