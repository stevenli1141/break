'use strict';

let router = require('./application');
let authorize = require('../helpers/authorize');
let Project = require('../models/project');
let User = require('../models/user');

let debug = require('debug')('http');

router.get('/projects', async (req, res, next) => {
    try {
        res.format({
            html: () => { res.render('projects/index'); },
            json: async () => {
                let projects = await Project.find({ organization: req.user.organization._id })
                        .sort('name').populate('lead').exec();
                res.send(projects);
            }
        });
    } catch (err) { next(err); }
});

router.get('/projects/new', authorize.requireAdmin, (req, res) => {
    res.render('projects/new', { error: req.flash('error') });
});

router.get('/projects/:key', async (req, res, next) => {
    try {
        let project = await Project.findOne({ key: req.params.key });
        res.format({
            html: () => { res.render('projects/main', { project: project }); },
            json: () => { res.json(project); }
        });
    } catch (err) { next(err); }
});

router.get('/projects/:key/edit', async (req, res, next) => {
    try {
        res.locals.project = await Project.find({ key: req.params.key })
        res.render('projects/edit', { error: req.flash('error') });
    } catch (err) { next(err); }
});

router.post('/projects', authorize.requireAdmin, async (req, res) => {
    let project = new Project();
    project.key = req.body.key;
    project.name = req.body.name;
    project.total = 0;
    project.organization = req.user.organization._id;
    project.save().then((project) => {
        res.format({
            html: () => { res.redirect('/projects'); },
            json: () => { res.json(project); }
        });
    }).catch((err) => {
        debug(err);
        req.flash('error', 'Failed to create project');
        res.format({
            html: () => { res.redirect('/projects/new'); },
            json: () => { res.status(500).send(err); }
        });
    });
});

router.put('/projects/:key', authorize.requireAdmin, async (req, res) => {
    let project = await Project.find({ key: req.params.key });
    project.name = req.body.name;
    project.save().then((project) => {
        res.format({
            html: () => { res.redirect('/projects'); },
            json: () => { res.json(project); }
        });
    }).catch((err) => {
        req.flash('error', 'Failed to make changes');
        res.format({
            html: () => { res.redirect('/projects'); },
            json: () => { res.status(500).send(err); }
        });
    });
});

router.delete('/projects/:key', authorize.requireLogin, async (req, res) => {
    let project = await Project.find({ key: req.params.key });
    project.remove().then((project) => {
        res.format({
            html: () => { res.redirect('/projects'); },
            json: () => { res.json({}); }
        });
    }).catch((err) => {
        req.flash('error', err);
        res.format({
            html: () => { res.redirect('/projects'); },
            json: () => { res.status(500).send(err); }
        });
    });;
});

module.exports = router;
