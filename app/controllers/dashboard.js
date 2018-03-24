let router = require('./application');
let User = require('../models/user');

router.get('/', (req, res) => {
    res.format({
        html: () => { res.render('dashboard'); }
    });
});

module.exports = router;
