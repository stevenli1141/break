'use strict';

let authorize = require('../helpers/authorize');

module.exports = (app, passport) => {
    app.get('/login', authorize.requireOffline, (req, res) => {
        res.render('login', { title: 'Log in', error: req.flash('error'), user: null, csrfToken: req.csrfToken() });
    });

    app.post('/login', authorize.requireOffline, (req, res, next) => {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }
            req.logIn(user, (err) => {
                if (err) return next(err);
                return res.redirect('/dashboard');
            });
        })(req, res, next);
    });

    app.get('/logout', authorize.requireLogin, (req, res) => {
        req.logout();
        res.redirect('/');
    });
}

