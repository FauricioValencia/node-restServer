




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
    urlDB='mongodb://cafeUser:Qpasasapa123@ds139425.mlab.com:39425/cafe'
}

//mlab para la base de datos

process.env.URLDB = urlDB;


