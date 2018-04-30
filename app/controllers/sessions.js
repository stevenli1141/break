'use strict';

let express = require('express');
let authorize = require('../helpers/authorize');
let debug = require('debug')('http');

module.exports = (passport) => {
    let router = express.Router();

    router.use((req, res, next) => {
        res.locals.user = req.user;
        res.locals.csrfToken = req.csrfToken();
        res.locals.showSidebar = false;
        res.locals.error = req.flash('error');
        next();
    });
    
    router.get('/login', authorize.requireOffline, (req, res) => {
        res.render('login', { title: 'Log in', user: null });
    });

    /*app.post('/login', authorize.requireOffline, (req, res, next) => {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }
            req.logIn(user, (err) => {
                if (err) return next(err);
                return res.redirect('/dashboard');
            });
        })(req, res, next);
    });*/

    router.post('/login', authorize.requireOffline, passport.authenticate('local-login', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }));

    router.get('/logout', authorize.requireLogin, (req, res) => {
        req.logout();
        res.redirect('/');
    });

    return router;
}

