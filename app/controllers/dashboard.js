let router = require('./application');

let debug = require('debug')('http');

router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

module.exports = router;
