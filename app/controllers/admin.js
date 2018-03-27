let router = require('./application');
let authorize = require('../helpers/authorize');

router.use(authorize.requireAdmin);

router.get('/admin', (req, res) => {
    res.render('admin/index');
});

module.exports = router;
