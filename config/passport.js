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
    }, (req, username, password, done) => {
        User.findOne({ email: username }, (err, user) => {
            if (err) return done(err);
            if (!user || !user.validPassword(password)) {
                return done(null, false, req.flash('error', 'Incorrect username or password'));
            }
            return done(null, user);
        });
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, username, password, done) => {
        process.nextTick(() => {
            if (!username.match(/^[-_.+0-9a-zA-Z]+@[0-9a-z]+\.[0-9a-z]+$/)) {
                return done(null, false, req.flash('error', 'Invalid email'));
            }
            if (password.length < 7) {
                return done(null, false, req.flash('error', 'Password is too short'));
            }
            if (password != req.body.confirm) {
                return done(null, false, req.flash('error', 'Confirmation does not match'));
            }
            User.findOne({ email: username }).exec().then((user) => {
                if (user) return Promise.reject('Email already in use');
                let newUser = new User();
                newUser.email = username;
                newUser.password = password;
                newUser.firstname = req.body.firstname;
                newUser.lastname = req.body.lastname;

                return newUser.save();
            }).then((newUser) => {
                debug('New user created');
                debug(newUser);
                return done(null, newUser);
            }).catch((err) => {
                return done(null, false, req.flash('error', err));
            });
        });
    }));
}
