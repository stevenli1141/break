'use strict';

exports.requireLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.format({
        html: () => { redirect('/login'); },
        json: () => { res.status(401).send(); }
    });
}

exports.requireOffline = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.format({
        html: () => { redirect('/'); },
        json: () => { res.status(500).send(); }
    });
}

exports.requireAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) {
        return next();
    }
    res.format({
        html: () => { next(new Error('Unauthorized access')); },
        json: () => { res.status(401).send(); }
    });
}
