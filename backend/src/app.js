//node_module
import express from 'express'
import mongoose from 'mongoose'
import { Server }  from 'socket.io'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import InitializePassport from './config/passport.js';
import cors from 'cors';
import errorHandler from './middlewares/errors/index.js';
import { addLogger } from './config/logger.js';
// imortar swagger
import swaggerjsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

//Configuracion de swagger
const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Proyecto final CoderHouse',
            version: '1.0.0',
            description: 'API de productos y usuarios en el proyecto final del curso de backend de CoderHouse',
            contact: {
                name: 'Juan Betancourt',
                email: 'beta.juan.c@gmail.com'
            }
        },
        
    },
    apis: [ `${__dirname}/docs/**/*.yaml`]
};

const specs = swaggerjsdoc(swaggerOptions);



const whiteList = ['http://localhost:5173', 'http://localhost:4000'];

const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // permite credenciales en cross-origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // métodos permitidos
};


//Importacion de rutas
import apiRouter from './routes/apis.routes.js';

//Importacion de otros modulo
import { __dirname } from './path.js';
import { messageModel } from "./dao/models/messages.models.js"
import { productModel } from './dao/models/products.models.js';
import path from 'path';

//Setup inicial
const apisRouter = apiRouter;
dotenv.config();
const app = express()
const PORT = 4000

const server =  app.listen(PORT, () => {
    console.log(`Server on Port ${PORT}`)
})

// conexion a la base de datos de mongodb
mongoose.connect(`mongodb+srv://curso_backend_juan:${process.env.passmongodb}@cluster0.c47d4cv.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => console.log('BDD conectada'))
    .catch(() => console.log('Error en conexion a BDD'))

//Middleware
app.use(express.json())
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(session({
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        }, 
        ttl: 120
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
})) 
InitializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(errorHandler)
app.use(addLogger);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// RUTAS
app.use('/api',apisRouter)

// Socket.io
const io = new Server(server);

io.on('connection', (socket)=> {
    console.log('servidor de socket io conectado')

    socket.on('add-message', async ({email, mensaje}) => {
        console.log(mensaje)
        await messageModel.create({email: email, message: mensaje})
        const messages = await messageModel.find();
        socket.emit('show-messages', messages);
    })

    socket.on('display-inicial', async() =>{
        const messages = await messageModel.find();
        socket.emit('show-messages', messages);
    })

    socket.on('add-product', async (nuevoProd) => {
        const { title, description, price, code, stock, category } = nuevoProd;
        await productModel.create({title: title, description: description, price: price, code: code, stock: stock, category: category});
        const products = await productModel.find();
        socket.emit('show-products', products);
    })

    socket.on('update-products', async () => {
        const products = await productModel.find();
        socket.emit('show-products', products);
    });

    socket.on('remove-product', async ({ code }) => {
        try {
            console.log("inicio remove socket")
            await productModel.deleteOne({ code: code });
            const products = await productModel.find();
            socket.emit('show-products', products);
        }catch (error) {
            console.error('Error eliminando producto:', error);
        }

    })
})



