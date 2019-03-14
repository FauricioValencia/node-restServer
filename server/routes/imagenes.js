const express = require('express');
const fs = require('fs');
const path = require('path');
const {verificaTokenImg }= require('../middlewares/autenticacion.js');
let app = express();

app.get('/:tipo/:img',verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../upload/${tipo}/${img}`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }
})