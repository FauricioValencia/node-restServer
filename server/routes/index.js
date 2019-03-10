const express = require('express');
const app = express();

app.use(require('./login.routes'));
app.use(require('./usuario.routes'));
app.use(require('./categoria'));
app.use(require('./producto'));

module.exports= app;
