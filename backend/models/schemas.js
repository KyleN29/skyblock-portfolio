const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')
const jwt = require('jsonwebtoken');
const config = require('config');

const ItemSchema = new Schema({
    user: {type:String},
    item: {type:String},
    quantity: {type:Number},
    buyPrice: {type:Number},
})

const MarkedItemSchema = new Schema({
    user: {type:String},
    item: {type:String},
    markedPrice: {type:Number},
    note: {type:String,
    maxLength:250},
})

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 25
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    }
})

const BazaarSchema = new Schema({
    time: {
        type: Number
    },
    products: {
        type: Schema.Types.Mixed
    }
})

UserSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id}, config.get('jwtPrivateKey'));
    return token;
}
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(4).max(25).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });

    return schema.validate(user);
}

const Item = mongoose.model('Item', ItemSchema)
const User = mongoose.model('User', UserSchema)
const Bazaar = mongoose.model('Bazaar', BazaarSchema)
const MarkedItem = mongoose.model('MarkedItem', MarkedItemSchema)
const mySchemas = {'Item':Item, 'User': User, 'Bazaar': Bazaar, 'MarkedItem': MarkedItem}

module.exports.schemas = mySchemas
module.exports.validateUser = validateUser