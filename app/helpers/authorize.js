'use strict';

exports.requireLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

exports.requireOffline = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

exports.requireAdmin = (req, res, next) => {
    if (req.isAuthenticated && typeof req.user !== 'undefined' && req.user.admin) {
        return next();
    }
    res.status(401);
}
