let express = require('express');
let authorize = require(global.appRoot + '/app/helpers/authorize');

let router = express.Router();

router.use(authorize.requireLogin);

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.csrfToken = req.csrfToken();
    res.locals.showSidebar = true;
    next();
});

module.exports = router;
