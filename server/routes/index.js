const express = require('express');
const app = express();

app.use(require('./login.routes'));
app.use(require('./usuario.routes'));
app.use(require('./categoria'));
app.use(require('./producto'));
app.use(require('./upload'));

module.exports= app;
