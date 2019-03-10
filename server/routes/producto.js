const express = require("express");
const _ = require("underscore");

const {
    verificaToken
} = require("../middlewares/autenticacion");

let app = express();
let producto = require("../models/producto");

// =================
// obtener productos
// ==================

app.post("/productos", verificaToken, (req, res) => {
    const {
        nombre,
        precioUni,
        descripcion,
        disponible,
        categoria
    } = req.body;
    let usuario = req.usuario._id;
    let Producto = new producto({
        nombre,
        precioUni,
        descripcion,
        disponible,
        categoria,
        usuario
    });
    Producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            message: "Producto creado",
            productoDB
        });
    });
});
app.get("/productos", (req, res) => {
    producto
        .find({
            disponible: true
        })
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .exec((err, productosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                productosDB
            });
        });
});

//  ============================
//  Buscar productos por termino
//  ============================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    producto.find({
            nombre: regex
        })
        .populate('categoria', 'nombre')
    exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            productos
        })
    })
})

app.get("/productos/:id", (req, res) => {
    let id = req.params.id;
    producto.findById(id, (err, productosDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            productosDB
        })
    })
});
app.put("/productos/:id", (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ["nombre, precioUni, descripcion "]);
    producto.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        return res.status(200).json({
            ok: true,
            productoDB
        })
    })
});

app.delete("/productos/:id", (req, res) => {
    let id = req.params.id;
    producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'no existe el id que buscas'
                }
            })
        }
        productoDB.disponible = false;
        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'producto borrado'
            })
        })
    })

});

module.exports = app;