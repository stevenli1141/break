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
                let params = { organization: req.user.organization._id };
                if (req.query.name) {
                    params['$or'] = [ { name: new RegExp(req.query.name, 'i') }, { key: new RegExp('^' + req.query.name, 'i') } ];
                }
                let projects = await Project.find(params)
                        .sort('name').populate('lead').exec();
                res.send(projects);
            }
        });
    } catch (err) { next(err); }
});

router.get('/projects/:key', async (req, res, next) => {
    try {
        let project = await Project.findOne({ key: req.params.key }).populate('lead').exec();
        if (!project) { throw new Error('Not found'); }
        res.format({
            html: () => { res.render('projects/main', { project: project }); },
            json: () => { res.json(project); }
        });
    } catch (err) { next(err); }
});

router.get('/projects/:key/edit', async (req, res, next) => {
    try {
        let project = await Project.findOne({ key: req.params.key }).populate('lead').exec();
        if (!project || !req.user.admin && !project.lead._id.equals(req.user._id)) {
            throw new Error('Unauthorized access');
        }
        res.format({
            html: () => { res.render('projects/edit', { error: req.flash('error') }); },
            json: () => { res.send(project); }
        });
    } catch (err) {
        res.format({
            html: () => { next(err); },
            json: () => { res.status(500).send(); }
        });
    }
});

router.post('/projects', authorize.requireAdmin, async (req, res) => {
    let project = new Project(req.body);
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

router.put('/projects/:id', async (req, res) => {
    try {
        if (!req.user.admin && !req.user._id.equals(req.params.id)) {
            throw new Error('Unauthorized access');
        }
        let params = req.body;
        if (params.lead) { params.lead = params.lead._id; }
        let project = await Project.findByIdAndUpdate(req.params.id, params, {
            new: true
        }).populate('lead').exec();

        if (params.lead) {
            User.findByIdAndUpdate(project.lead, { $addToSet: { projects: project._id } }).exec();
        }

        res.format({
            html: () => { res.redirect('/projects'); },
            json: () => { res.json(project); }
        });
    } catch(err) {
        req.flash('error', 'Failed to make changes');
        res.format({
            html: () => { res.redirect('/projects'); },
            json: () => { res.status(500).send(err); }
        });
    }
});

router.delete('/projects/:key', authorize.requireAdmin, async (req, res) => {
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
