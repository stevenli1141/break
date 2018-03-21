'use strict';

let authorize = require('../helpers/authorize');
let debug = require('debug')('http');

module.exports = (app, passport) => {
    app.get('/signup', authorize.requireOffline, (req, res) => {
        res.render('signup', { title: 'Sign up', error: req.flash('error') });
    });
    
    app.post('/signup', authorize.requireOffline, passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));
}
