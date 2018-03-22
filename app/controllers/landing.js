let express = require('express');

let router = express.Router();

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/board');
    }
    next();
});

router.get('/', (req, res) => {
    res.render('landing', { user: null }); 
});

module.exports = router;
