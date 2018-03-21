let router = require('./application');

router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;
