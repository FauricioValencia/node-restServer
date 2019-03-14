const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

//  para acceder a la informacion del usuario y guardar en la carpeta del usuario
const Usuario = require("../models/usuario.models.js");
const Producto = require("../models/producto.js");
const fs = require("fs");
const path = require("path");

//  default options
app.use(fileUpload());

app.put("/upload/:tipo/:id", (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id;
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No se ha seleccionado ningun archivo"
      }
    });
  }
  let tiposValidos = ["producto", "usuario"];

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split(".");
  let extension = nombreCortado[nombreCortado.length - 1];
  console.log(nombreCortado);

  //  extensiones permitidas
  let extensionesPermitidas = ["png", "jpg", "gif", "jpeg"];
  if (extensionesPermitidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `Las extensiones permitidas son: ${extensionesPermitidas.join(
          ", "
        )}`
      }
    });
  }
  //  cambiar el nombre al archivo

  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
    if (err)
      return res.status(500).json({
        ok: false,
        err
      });
    res.json({
      ok: true,
      message: "archivo subido correctamente"
    });
    if (tipo == "usuario") {
      imagenUsuario(id, res, nombreArchivo);
    } else {
      imagenProducto(id, res, nombreArchivo);
    }
  });
});

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!usuarioDB) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "usuario no existe"
        }
      });
    }

    usuarioDB.img = nombreArchivo;
    borraArchivo(usuarioDB.img, "usuarios");
    usuarioDB.save((err, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      });
    });
  });
}

function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!productoDB) {
      return res.status(500).json({
        ok: false,
        err: {
          message: "producto no existe"
        }
      });
    }
    productoDB.img = nombreArchivo;
    borraArchivo(productoDB.img, "productos");
    Producto.save((err, productoGuardado)=>{
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo
      });
    })
  });
}
function borraArchivo(nombreImagen, tipo) {
  let pathImagen = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreImagen}`
  );
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}
module.exports = app;
