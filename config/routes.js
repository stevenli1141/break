'use strict';

let session = require('express-session');
let flash = require('connect-flash');
let passport = require('passport');
let csrf = require('csurf');

let passportConfig = require('./passport');

let registrationsController = require(global.appRoot + '/app/controllers/registrations');
let sessionsController = require(global.appRoot + '/app/controllers/sessions');
// let adminDashboard = require('./app/controllers/admin/dashboard');
// let adminUsers = require('./app/controllers/admin/users');
let landing = require(global.appRoot + '/app/controllers/landing');
let projects = require(global.appRoot + '/app/controllers/projects');
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

    registrationsController(app, passport);
    sessionsController(app, passport);

    // Projects
    app.use('/', projects);

    // Issues

    // Dashboard
    app.use('/', dashboard);
    
}
