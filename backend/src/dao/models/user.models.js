import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import { CartManager } from './cartManager.js';


const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true,
        index: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    }
})

userSchema.plugin(mongoosePaginate)

userSchema.pre('save', async function(next) { 
    try{
        const newCart = await CartManager.create();
        this.cart = newCart._id;
    } catch {
        return next(error);
    }
} )
//Parametro 1:Nombre coleccion - Parametro 2: Schema 
export const userModel = model('users', userSchema)