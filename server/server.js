require('./config/config');
var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario.routes'));

mongoose.connect(process.env.URLDB,(err, res)=>{
    if(err) throw err;

    console.log(' Base de datos conectada');
});

app.listen(process.env.PORT, () => console.log('escuchando el puerto 3000'))