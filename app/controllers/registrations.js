'use strict';

let authorize = require('../helpers/authorize');
let debug = require('debug')('http');

module.exports = (app, passport) => {
    app.get('/signup', authorize.requireOffline, (req, res) => {
        res.render('signup', { title: 'Sign up', error: req.flash('error'), user: null });
    });
    
    app.post('/signup', authorize.requireOffline, passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup',
        failureFlash: true
    }));
}
