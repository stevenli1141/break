'use strict';

let authorize = require('../helpers/authorize');

module.exports = (app, passport) => {
    app.get('/login', authorize.requireOffline, (req, res) => {
        res.render('login', { title: 'Log in', error: req.flash('error'), user: null, csrfToken: req.csrfToken() });
    });

    app.post('/login', authorize.requireOffline, passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/logout', authorize.requireLogin, (req, res) => {
        req.logout();
        res.redirect('/');
    });
}

