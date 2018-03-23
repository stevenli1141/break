let router = require('./application');

let organization = require(global.appRoot + '/app/models/organization');

router.get('/', (req, res) => {
    res.format({
        html: () => { res.render('dashboard'); },
        json: async () => {
            let org = await organization.findById(req.user._id).exec();
            res.send({ user: req.user, org: req.org });
        }
    });
    // res.render('dashboard');
});

module.exports = router;
