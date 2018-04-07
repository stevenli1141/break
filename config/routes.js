'use strict';

let session = require('express-session');
let flash = require('connect-flash');
let passport = require('passport');
let csrf = require('csurf');

let passportConfig = require('./passport');

let registrationsController = require(global.appRoot + '/app/controllers/registrations');
let sessionsController = require(global.appRoot + '/app/controllers/sessions');
let admin = require(global.appRoot + '/app/controllers/admin');
let landing = require(global.appRoot + '/app/controllers/landing');
let projects = require(global.appRoot + '/app/controllers/projects');
let issues = require(global.appRoot + '/app/controllers/issues');
let users = require(global.appRoot + '/app/controllers/users');
let dashboard = require(global.appRoot + '/app/controllers/dashboard');

module.exports = (app) => {
    passportConfig(passport);
    app.use(session({ secret: 'secretKey', resave: true, saveUninitialized: true }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(csrf({ cookie: true }));

    // Landing root
    app.use('/', landing);

    app.use('/', registrationsController(passport));
    sessionsController(app, passport);

    app.use('/', projects);
    app.use('/', issues);
    app.use('/', users);

    // Administration
    app.use('/', admin);

    // Dashboard
    app.use('/', dashboard);

    // Error handlers

    app.use((err, req, res, next) => {
        res.status(404);
        res.render('error', { err: err, user: null, csrfToken: req.csrfToken() });
    });
}
