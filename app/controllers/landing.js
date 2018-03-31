let express = require('express');

let router = express.Router();
let debug = require('debug')('http');

router.use((req, res, next) => {
    res.locals.showSidebar = false;
    next();
});

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render('landing/index', { user: null, csrfToken: req.csrfToken() }); 
});

module.exports = router;
