const express = require('express')
const app = express();
const path = require('path');
const routes = require('./src/routes');
require('dotenv').config()

// const bodyParser = require('body-parser');
// const cors = require('cors');
// const compression = require('compression');
// const cookieParser = require('cookie-parser');
// const morgan = require('morgan');
// const cors = require('cors');
// app.use(cookieParser());

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/', routes);

app.listen('3000');