'use strict';

let LocalStrategy = require('passport-local').Strategy;
let User = require('../app/models/user');
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
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) return done(err);
            if (!user || !user.validPassword(password)) {
                return done(null, false, req.flash('error', 'Incorrect username or password'));
            }
            return done(null, user);
        });
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, username, password, done) => {
        process.nextTick(() => {
            username = username.toLowerCase();
            if (!username.match(/^([-_0-9a-z])*$/)) {
                return done(null, false, req.flash('error', 'Invalid username'));
            }
            if (password.length < 7) {
                return done(null, false, req.flash('error', 'Password is too short'));
            }
            User.findOne({ username: username }).exec().then((user) => {
                if (user) return Promise.reject('Username already in use');
                let newUser = new User();
                newUser.username = username;
                newUser.password = password;
                newUser.roles = [];

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
