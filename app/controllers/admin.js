let router = require('./application');
let authorize = require('../helpers/authorize');

router.get('/admin', authorize.requireAdmin, (req, res) => {
    res.render('admin/index');
});

module.exports = router;
