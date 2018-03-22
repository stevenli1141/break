let router = require('./application');

router.get('/', (req, res) => {
    res.render('dashboard');
});

module.exports = router;
