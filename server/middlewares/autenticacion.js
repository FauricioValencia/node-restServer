var jwt = require('jsonwebtoken');


// ====================
//  Verifica token
// ====================

let verificaToken =( req, res, next )=>{

    let token = req.get('token'); //es lo que viene en el body, lo que usualmente es autorizacion

    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.usuario= decoded.usuario;
        next(); 
    })
};

// ====================
//  Verifica admin role
// ====================
let verificaTokenAdmin =( req, res, next )=>{

let usuario = req.usuario;

if(usuario.role="ADMIN_ROLE"){
    next();
    return;
}else{
   return res.json({
        ok: false,
        err: {
            message: "El usuario no es admin"
        }
    })
}

};
// =============================
//  Verofoca token para imagen
//  ============================

let verificaTokenImg = (req, res, next )=>{
    let token = req.get('token'); //es lo que viene en el body, lo que usualmente es autorizacion

    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.usuario= decoded.usuario;
        next(); 
    })
}
module.exports ={
    verificaToken,
    verificaTokenAdmin,
    verificaTokenImg
}