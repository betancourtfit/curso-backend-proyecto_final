import express from "express";
import { CartManager } from "../dao/models/cartManager.js"
import { passportError, authorization } from "../utils/messagesError.js";

const viewsRouter = express.Router();


// const auth = (req, res, next) => {
//     console.log('req_session',req.session.passport)
//     console.log('req_user',req.user)
//     console.log("Is Authenticated:", req.isAuthenticated());
//     console.log("Session Object:", req.session);
//     if (req.isAuthenticated()) {
//         return next();
//     } else {
//         return res.redirect('/login');
//     }
// };

// const auth_admin = (req, res, next) => {
//     console.log("Is Authenticated:", req.isAuthenticated());
//     console.log("Session Object:", req.session);
//     if (req.isAuthenticated() && req.user.rol === 'admin') {
//         return next();
//     } else {
//         return res.redirect('/home');
//     }
// };

viewsRouter.get('/home', passportError('jwt'), authorization(['admin','user']), (req, res) => {
    res.render('home', {
        js: "home.js",
        css: "home.css",
        title: "Home"
        
    });
})

viewsRouter.get('/realtimeproducts', passportError('jwt'), authorization('admin') , (req, res) => {
    res.render('realTimeProducts', {
        css: "style.css",
        title: "Products",
        js: "realTimeProducts.js"

    })
})

viewsRouter.get('/carts/:cid', passportError('jwt'), authorization(['admin','user']), async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await CartManager.findById(cid);
        console.log(cart)

        if (cart) {
            res.render('carts', { products: cart.products });
        } else {
            res.status(404).send({ respuesta: 'Error', mensaje: 'Carrito no encontrado' });
        }

    } catch (error) {
        res.status(400).send({ respuesta: 'Error', mensaje: error.message });
    }
});

viewsRouter.get('/login', (req, res) => {
    res.render('login', {
        js: "login.js",
        css: "home.css",
        title: "login",
        
    });
})

viewsRouter.get('/logout', (req, res) => {
    res.render('logout', {
        js: "logout.js",
        css: "home.css",
        title: "logout",
        
    });
})

viewsRouter.get('/signup', (req, res) => {
    res.render('signup', {
        js: "signup.js",
        css: "signup.css",
        title: "signup",
    });
});

viewsRouter.get('/chat', passportError('jwt'), authorization(['admin','user']), (req, res) => {
    res.render('chat', {
        js: "chat.js",
        css: "chat.css",
        title: "chat",
    });
});

viewsRouter.get('/gitHubCallback', passportError('jwt'), authorization(['admin','user']), (req, res) => {
    res.render('chat', {
        js: "gitHubCallback.js",
        css: "chat.css",
        title: "chat",
    });
});

export default viewsRouter;