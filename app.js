'use strict';

global.appRoot = __dirname;

let dotenv = require('dotenv').config();
let express = require('express');
let layouts = require('express-ejs-layouts');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let cookieSession = require('cookie-session');
let session = require('express-session');
let debug = require('debug')('http');
let morgan = require('morgan');
let mongoose = require('mongoose');
let http = require('http');

let dbConfig = require('./config/db');
let routes = require('./config/routes');
let passportConfig = require('./config/passport');

let config = {
    port: process.env.PORT || 8000
};

mongoose.connect(dbConfig.url);

let app = express();

if (process.env.NODE_ENV === 'production') {
    app.set('views', './public/dist');
} else {
    app.set('views', './app/views');
}
app.set('view engine', 'ejs');

app.use(layouts);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secretKey'));
app.use(cookieSession({
    key: 'secretKey',
    secret: 'secretKey',
    maxAge: 86400000
}));
app.use(express.static('./public'));
app.use(express.static('./public/dist'));
app.use(express.static('./public/bower_components'));
app.use(express.static('./app/assets'));
app.use(morgan('dev', { stream: { write: msg => debug(msg) }}));

routes(app);

// Handle 404 error
app.use(function(req, res, next) {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(__dirname + '/public/404.html');
        return;
    }

    res.type('txt').send('Not found');
});

let server = http.createServer(app);

server.listen(config.port, () => {
    debug('Ever Grande is running on port', config.port);
});
