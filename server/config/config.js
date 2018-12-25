




// =========================
//  Puerto
// =========================

process.env.PORT = process.env.PORT  || 3000;


// =========================
//  Entorno
// =========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// =========================
//  VENCIMIENTO DEL TOKEN
// =========================
process.env.CADUCIDAD_TOKEN = 60* 60 * 24*30;

// =========================
//  SEED AUTENTIFICACION
// =========================
    process.env.SEED= process.env.SEED || 'es-el-seed-desarrollo'

// =========================
//  SEED AUTENTIFICACION ADMIN
// =========================
process.env.SEED_ADMIN= process.env.SEED_ADMIN || 'es-el-seed-desarrollo-admin'

// =========================
//  DB
// =========================

if (process.env.NODE_ENV ==='dev'){
    urlDB= 'mongodb://localhost:27017/cafe'
}else {
    urlDB=process.env.MONGO_URI;
}

//mlab para la base de datos

process.env.URLDB = urlDB;


