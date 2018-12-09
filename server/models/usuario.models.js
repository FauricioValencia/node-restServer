const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let rolesValidos ={
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido '
}
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    name: {
        type: String,
        required: [true, 'el campo name es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El campo email debe ser obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true,
        required: false
    },
    google: {
        type: Boolean,
        required: false,
        default: false
    }
});
usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuarioSchema.plugin(uniqueValidator,{message: '{PATH} debe ser unico'})

module.exports = mongoose.model('Usuario', usuarioSchema);