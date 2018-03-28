'use strict';

let router = require('./application');
let authorize = require('../helpers/authorize');
let User = require('../models/user');

router.get('/users', async (req, res) => {
    let filters = { organization: req.user.organization._id };
    let users = await User.find(filters).sort('firstname');
    res.format({
        html: () => { res.render('users/index', { users: users }); },
        json: () => { res.send(users); }
    });
});

router.get('/users/:id', async (req, res) => {
    let user = await User.findById(req.params.id);
    res.format({
        html: () => { res.render('users/show', { user: user }); },
        json: () => { res.send(user); }
    });
});

router.post('/users', authorize.requireAdmin, async (req, res) => {
    try {
        let user = User.new(req.body);
        user.password = '';
        user = await user.save();
        res.format({
            html: () => {},
            json: () => {}
        });
    } catch (err) {
        req.flash('err', 'Failed to create user');
        res.format({
            html: () => { res.redirect('/users'); },
            json: () => { res.status(500).send(err); }
        });
    }
});

module.exports = router;
