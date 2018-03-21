let express = require('express');
let authorize = require(global.appRoot + '/app/helpers/authorize');

let router = express.Router();

router.use(authorize.requireLogin);

router.use((req, res, next) => {
    res.locals.user = req.user;
});

module.exports = router;
