




// =========================
//  Puerto
// =========================

process.env.PORT = process.env.PORT  || 3000;


// =========================
//  Entorno
// =========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


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


