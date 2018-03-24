let express = require('express');

let router = express.Router();

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render('landing', { user: null, csrfToken: req.csrfToken() }); 
});

module.exports = router;
