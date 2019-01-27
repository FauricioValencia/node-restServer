var express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require("../models/usuario.models.js");
var app = express();

app.post("/login", (req, res) => {
  let body = req.body;

  Usuario.findOne(
    {
      email: body.email
    },
    (err, usuarioDB) => {
      console.log(body.email, body.password);
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (!usuarioDB) {
        return res.status(400).json({
          err: {
            message: "(usuario) o contraseña incorrecta"
          }
        });
      }
      if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
        return res.status(400).json({
          err: {
            message: "usuario o (contraseña) incorrecta"
          }
        });
      }
      let token = jwt.sign(
        {
          usuario: usuarioDB
        },
        process.env.SEED,
        { expiresIn: process.env.CADUCIDAD_TOKEN }
      );
      res.json({
        ok: true,
        usuario: usuarioDB,
        token
      });
    }
  );
});

//  CONFIGURACION DE GOOGLE

async function verify() {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const { name, email, picture } = payload;
  const userid = payload["sub"];

  return {
    nombre: name,
    email,
    img: picture,
    google: true
  };
}

app.post("/google", async (req, res) => {
  let token = req.body.idtoken;
  let googleUser = await verify(token).catch(e => {
    return res.status(403).json({
      ok: false,
      err:e
    });
  });
  Usuario.findOne({email: googleUser.email},(err,usuarioDB)=>{
    if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if(usuarioDB){
        if(usuarioDB.google===false){
             return res.status(400).json({
                 ok:false,
                 err:{
                     message: 'Debe utilizar su autenticacion normal',
                     err
                 }
             })
        }else{
            let token = jwt.json({
                usuario: usuarioDB,

            }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})
            return res.json({
                ok: true,
                usuario: usuarioDB,
                token
            })
            
        }

      }else {
          // Si el usuario no existe no existe en nuestra base de datos
          let usuario = new Usuario();

          usuario.nombre=googleUser.nombre;
          usuario.email= googleUser.email;
          usuario.img= googleUser.img;
          usuario.google= true;
          usuario.password = ':)'

          usuario.save((err, usuarioDB)=>{
            if (err) {
                return res.status(500).json({
                  ok: false,
                  err
                });
              }
              let token = jwt.json({
                usuario: usuarioDB,

            }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})
            return res.json({
                ok: true,
                usuario: usuarioDB,
                token
            })
          })
        }
  })

//   res.json({
//     body: req.body
//   });


});

module.exports = app;
