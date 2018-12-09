require('./config/config');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function (req, res) {
    res.json('get Usuarios')
})

app.post('/usuario', function (req, res) {
    // res.json('post Usuarios')
    let body = req.body;

    if (body.nombre === undefined){
        res.status(400).json({
            ok: false,
            message:"El nombre es necesario"
        })
    }else{

        res.json({
            persona:body
        })
    }
})

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id
    res.json({
        id
    })
})
app.delete('/usuario', function (req, res) {
    res.json('delete Usuarios')
})
app.listen(process.env.PORT, () => console.log('escuchando el puerto 3000'))