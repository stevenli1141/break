let express = require('express');
let authorize = require(global.appRoot + '/app/helpers/authorize');
let debug = require('debug')('http');

let router = express.Router();

router.use(authorize.requireLogin);

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.csrfToken = req.csrfToken();
    res.locals.showSidebar = true;
    res.locals.error = req.flash('error');
    res.locals.notice = req.flash('notice');
    next();
});

module.exports = router;
