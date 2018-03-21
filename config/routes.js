'use strict';

let session = require('express-session');
let flash = require('connect-flash');
let passport = require('passport');

let passportConfig = require('./passport');

let registrationsController = require(global.appRoot + '/app/controllers/registrations');
let sessionsController = require(global.appRoot + '/app/controllers/sessions');
// let adminDashboard = require('./app/controllers/admin/dashboard');
// let adminUsers = require('./app/controllers/admin/users');
let dashboard = require(global.appRoot + '/app/controllers/dashboard');

module.exports = (app) => {
    passportConfig(passport);
    app.use(session({ secret: 'secretKey', resave: true, saveUninitialized: true }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        res.locals.user = req.user;
        next();
    });

    registrationsController(app, passport);
    sessionsController(app, passport);

    // Projects

    // Issues

    // Dashboard
    app.use('/', dashboard);
}
