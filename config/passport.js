'use strict';

let LocalStrategy = require('passport-local').Strategy;
let User = require(global.appRoot + '/app/models/user');
let Organization = require(global.appRoot + '/app/models/organization');
let debug = require('debug')('http');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, username, password, done) => {
        try {
            let user = await User.findOne({ email: username }).exec();
            if (!user || !user.validPassword(password)) {
                return done(null, false, req.flash('error', 'Invalid username or password'));
            }
            return done(null, user);
        } catch (err) {
            debug(err);
            return done(err);
        }
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, username, password, done) => {
        if (!username.match(/^[-_.+0-9a-zA-Z]+@[0-9a-z]+\.[0-9a-z]+$/)) {
            return done(null, false, req.flash('error', 'Invalid email'));
        }
        if (password.length < 7) {
            return done(null, false, req.flash('error', 'Password is too short'));
        }
        if (password != req.body.confirm) {
            return done(null, false, req.flash('error', 'Confirmation does not match'));
        }

        try {
            let user = await User.findOne({ email: username }).exec();
            if (user) return done(null, false, 'Email already in use');

            let org = await Organization.findOne({ name: req.body.orgname }).exec();
            if (org) return done(null, false, 'An organization with this name already exists. Please use a different name');

            let newOrg = new Organization();
            newOrg.name = req.body.orgname;
            newOrg.type = req.body.orgtype;
            newOrg = await newOrg.save();

            let newUser = new User();
            newUser.email = username;
            newUser.password = password;
            newUser.firstname = req.body.firstname;
            newUser.lastname = req.body.lastname;
            newUser.admin = true;
            newUser.organization = newOrg._id;
            newUser = await newUser.save();

            return done(null, newUser);
        } catch (err) {
            return done(null, false, req.flash('error', err));
        }
    }));
}
