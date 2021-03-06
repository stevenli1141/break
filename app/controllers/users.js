'use strict';

let router = require('./application');
let authorize = require('../helpers/authorize');
let Project = require('../models/project');
let User = require('../models/user');
let debug = require('debug')('http');

router.get('/user', async (req, res) => {
    if (req.query.projects === 'true') {
        return res.send(await User.findById(req.user).populate('projects').exec());
    }
    res.send(req.user);
});

router.get('/users', async (req, res) => {
    res.format({
        html: () => { res.render('users/index'); },
        json: async () => {
            let filters = { organization: req.user.organization._id };
            if (req.query.name) {
                let regex = new RegExp(req.query.name.replace(' ', '|'), 'i');
                filters.$or = [ { firstname: regex }, { lastname: regex } ];
            }
            if (req.query.project) {
                filters.projects = req.query.project;
            }
            let users = await User.find(filters).sort('firstname').exec();
            res.send(users);
        }
    });
});

router.get('/users/:id', async (req, res, next) => {
    try {
        let user = await User.findById(req.params.id).populate('projects').exec();
        res.format({
            html: () => { res.render('users/show', { pageuser: user }); },
            json: () => { res.send(user); }
        });
    } catch (err) {
        res.format({
            html: () => { next(new Error()); },
            json: () => { res.status(500).send(); }
        });
    }
});

router.post('/users', authorize.requireAdmin, async (req, res) => {
    try {
        let user = new User(req.body);
        let password = Math.random().toString(36).substring(2, 9);
        user.password = password;
        user.organization = req.user.organization._id;
        debug(password);
        user = await user.save();
        req.flash('notice', 'User successfully created');
        res.format({
            html: () => { res.redirect('/users'); },
            json: () => { res.send(user); }
        });
    } catch (err) {
        req.flash('error', 'Failed to create user');
        res.format({
            html: () => { res.redirect('/users'); },
            json: () => { res.status(500).send(err); }
        });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        if (!req.user.admin && !(req.body.addProject || req.body.removeProject)) {
            throw new Error('Unauthorized access');
        } else if (!req.user.admin) {
            let project = await Project.findById(req.body.addProject || req.body.removeProject).exec();
            if (!req.user._id.equals(project.lead)) {
                throw new Error('Unauthorized access');
            } else if (project.lead.equals(req.params.id)) {
                throw new Error('Unauthorized action');
            }
        }
        let params = {};
        if(req.body.addProject) {
            params.$addToSet = { projects: req.body.addProject };
        } else if (req.body.removeProject) {
            params.$pull = { projects: req.body.removeProject };
        }
        let user = await User.findByIdAndUpdate(req.params.id, params, {
            new: true
        }).populate('projects').exec();
        res.format({
            html: () => { res.redirect('/users/' + req.user._id); },
            json: () => { res.send(user); }
        });
    } catch (err) {
        req.flash('error', 'Failed');
        res.format({
            html: () => { res.redirect('/users/' + req.body._id); },
            json: () => { res.status(500).json(err); }
        });
    }
});

module.exports = router;
