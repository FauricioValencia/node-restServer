const express = require("express");
const _ = require("underscore");

let {
  verificaToken,
  verificaTokenAdmin
} = require("../middlewares/autenticacion.js");

let app = express();

let Categoria = require("../models/categoria.js");

// ==============================
// traer todoas las categorias
// ==============================

app.get("/categoria", (req, res) => {
  Categoria.find()
    .populate("usuario")
    .exec((err, categorias) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      return res.json({
        ok: true,
        categorias
      });
    });
});

//  ===============================
//  mostrar una categoria por ID
//  ===============================

app.get("/categoria/:id", (req, res) => {
  let id = req.params.id;
  Categoria.findById(id, function(err, DBcategoria) {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      DBcategoria
    });
  });
});

// ================================
//  Crear una nueva categoria
//  ================================

app.post("/categoria", verificaToken, (req, res) => {
  let body = req.body;
  let usuario = req.usuario;
  console.log("el usuario: ", usuario);
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: usuario._id
  });
  categoria.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      categoria: usuarioDB
    });
  });
});

// ================================
//  Descripcion de la categoria
//  ================================

app.put("/categoria/:id", (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["descripcion"]);
  console.log("body: ", body);

  Categoria.findByIdAndUpdate(
    id,
    body,
    {
      new: true,
      runValidators: true
    },
    (err, categoriaDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      return res.status(200).json({
        ok: true,
        categoriaDB
      });
    }
  );
});

// ================================
//  Eliminar una categoria
//  ================================

app.delete(
  "/categoria/:id",
  [verificaTokenAdmin, verificaToken],
  (req, res) => {
    // solo un administrador puede borrar la categoria
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false
        });
      }
      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "el id no existe",
            err
          }
        });
      }
      res.json({ ok: true, message: "categoria borrada" });
    });
  }
);

module.exports = app;
