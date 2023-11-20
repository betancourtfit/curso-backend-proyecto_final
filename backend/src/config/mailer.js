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
    console.log('Sending order confirmation email...', orderCode, products, totalAmount, email);
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
        console.log('Correo de verificación enviado a:', email);
    } catch (error) {
        console.error('Error al enviar el correo de verificación:', error);
        throw error;
    }
};