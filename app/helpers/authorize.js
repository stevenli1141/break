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
    if (req.isAuthenticated && typeof req.user !== 'undefined' && req.user.roles.indexOf('admin') !== -1) {
        return next();
    }
    res.sendFile(global.appRoot + '/public/404.html');
}
