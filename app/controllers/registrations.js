'use strict';

let User = require('../models/user');
let authorize = require('../helpers/authorize');

module.exports = (app, passport) => {
    app.get('/signup', authorize.requireOffline, (req, res) => {
        res.render('signup', { title: 'Sign up', error: req.flash('error'), user: null, csrfToken: req.csrfToken() });
    });
    
    app.post('/signup', authorize.requireOffline, passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.post('/settings', authorize.requireLogin, async (req, res) => {
        try {
            let user = await User.findByIdAndUpdate(req.user._id).exec();
            user.password = req.body.password;
            user = await user.save();
            req.flash('notice', 'Settings successfully updated');
            res.format({
                html: () => { res.redirect('/users/' + req.user._id); },
                json: () => { res.send(user); }
            });
        } catch(err) {
            req.flash('error', 'Failed to update');
            res.format({
                html: () => { res.redirect('/users/' + req.user._id ); },
                json: () => { res.status(500).send(); }
            });
        }
    });
}
