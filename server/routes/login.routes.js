var express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.models.js');
var app = express();


app.post('/login', (req, res) => {

    let body = req.body;


    Usuario.findOne({
        email: body.email
    }, (err, usuarioDB) => {
        console.log(body.email, body.password);
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                err:{
                    message: '(usuario) o contraseña incorrecta'
                }
            })
        }
        if(!bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(400).json({
                err:{
                    message: 'usuario o (contraseña) incorrecta'
                }
            })
        }
        let token = jwt.sign({
            usuario:usuarioDB,
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})
        res.json({
            ok: true,
            usuario: usuarioDB, 
            token
        })
    })
})

module.exports = app;