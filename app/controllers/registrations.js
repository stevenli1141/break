'use strict';

let express = require('express');
let User = require('../models/user');
let authorize = require('../helpers/authorize');
let debug = require('debug')('http');

module.exports = (passport) => {
    let router = express.Router();

    router.use((req, res, next) => {
        res.locals.user = req.user;
        res.locals.csrfToken = req.csrfToken();
        res.locals.showSidebar = false;
        res.locals.error = req.flash('error');
        res.locals.notice = req.flash('notice');
        next();
    });

    router.get('/signup', authorize.requireOffline, (req, res) => {
        res.render('signup', { title: 'Sign up', user: null });
    });
    
    router.post('/signup', authorize.requireOffline, passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    router.get('/settings', authorize.requireLogin, async (req, res) => {
        res.render('settings', { user: req.user });
    });

    router.post('/settings', authorize.requireLogin, async (req, res) => {
        if (req.body.password != '' && req.body.password != req.body.confirm_password) {
            req.flash('error', 'Password confirmation does not match');
            return res.format({
                html: () => { res.redirect('/settings'); },
                json: () => { res.status(500).send(); }
            });
        }
        try {
            let user = await User.findByIdAndUpdate(req.user._id).exec();
            if (req.body.password != '') {
                user.password = req.body.password;
            }
            debug(req.body.password);
            user = await user.save();
            req.flash('notice', 'Settings successfully updated');
            res.format({
                html: () => { res.redirect('/settings'); },
                json: () => { res.send(user); }
            });
        } catch(err) {
            debug(err);
            req.flash('error', 'Failed to update user');
            res.format({
                html: () => { res.redirect('/settings'); },
                json: () => { res.status(500).send(); }
            });
        }
    });

    return router;
}
