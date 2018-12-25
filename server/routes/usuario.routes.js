var express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const {
    verificaToken,
    verificaTokenAdmin
} = require('../middlewares/autenticacion');
const Usuario = require('../models/usuario.models.js');
var app = express();

app.get('/usuario', verificaToken, function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 20;
    limite = Number(limite);

    Usuario.find({
            estado: true
        }, 'name email estado')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count({
                estado: true
            }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })
            })
        })
})

app.post('/usuario', function (req, res) {
    // res.json('post Usuarios')
    let body = req.body;

    let usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        // usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

app.put('/usuario/:id', [verificaToken, verificaTokenAdmin], function (req, res) {
    let id = req.params.id
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB,
            id
        });
    });
});

// ========
// poner estado false de usuario
// ========

app.put('/deleteUser/:id', [verificaToken, verificaTokenAdmin], function (req, res) {
    let id = req.params.id

    Usuario.findByIdAndUpdate(id, {
        estado: false
    }, {
        new: true,
        runValidators: true
    }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB,
            id
        });
    });
});


app.delete('/usuario/:id', verificaToken, function (req, res) {

    let id = req.body.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuarioBorrado
        })
    })
})

module.exports = app;