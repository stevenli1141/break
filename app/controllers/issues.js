let router = require('./application');
let Issue = require('../models/issue');
let Project = require('../models/project');
let Sprint = require('../models/sprint');
let User = require('../models/user');
let debug = require('debug')('http');

router.get('/issues', async (req, res) => {
    try {
        res.format({
            html: () => { res.render('issues/index'); },
            json: async () => {
                let projects = await Project.find({ organization: req.user.organization._id }).select('_id').exec();
                let params = { project: projects };
                if (req.query.projectkey && req.query.projectkey.length > 0) {
                    params.key = new RegExp('^' + req.query.projectkey + '-');
                } else if (req.query.key && req.query.title && req.query.title.length > 0) {
                    params['$or'] = [ { title: new RegExp(req.query.title, 'i') }, { key: new RegExp('^' + req.query.key, 'i') } ];
                } else if (req.query.key) {
                    params.key = new RegExp('^' + req.query.key, 'i');
                }
                if (req.query.assigned === 'true') {
                    params.assignee = req.user._id;
                }
                if (req.query.openOnly === 'true') {
                    params.status = { $not: /^Closed$/ };
                }
                if (req.query.relates_to) {
                    params.relates_to = req.query.relates_to;
                }
                let limit = Number(req.query.limit) || 50;
                let issues = await Issue.find(params).sort({ created_at: -1 }).limit(limit).populate('assignee').exec();
                res.send(issues);
            }
        });
    } catch (err) { next(err); }
});

router.get('/issues/new', (req, res) => {
    res.render('issues/new', { error: req.flash('error') });
});

router.get('/issues/:key', (req, res, next) => {
    try {
        res.format({
            html: async () => {
                let issue = await Issue.findOne({ key: req.params.key });
                if (!issue) { next(new Error()); }
                res.render('issues/show', { key: req.params.key });
            },
            json: async () => {
                let issue = await Issue.findOne({ key: req.params.key })
                    .populate('project')
                    .populate('sprint')
                    .populate('relates_to')
                    .populate('assignee')
                    .populate('reporter').exec();
                res.send(issue);
            }
        });
    } catch (err) { next(err); }
});

router.post('/issues', async (req, res, next) => {
    try {
        let params = req.body;
        if (params.assignee === '') { delete params.assignee; }
        if (params.relates_to === '') { delete params.relates_to; }
        let issue = new Issue(params);
        issue.reporter = req.user._id;
        let project = await Project.findByIdAndUpdate(req.body.project, {
            $inc: { total: 1 }
        }, {
            new: true
        }).exec();
        issue.key = project.key + '-' + project.total.toString();

        issue = await issue.save();
        
        res.format({
            html: () => { res.redirect('/issues/' + issue.key); },
            json: () => { res.send(issue); }
        });
    } catch (err) {
        debug(err);
        req.flash('error', 'Failed to create issue');
        res.format({
            html: () => { res.redirect('/issues/new'); },
            json: () => { res.status(500).send({}); }
        });
    }
});

router.put('/issues/:key', async (req, res, next) => {
    try {
        if (req.body.assignee) {
            req.body.assignee = req.body.assignee._id;
        }
        if (req.body.relates_to) {
            req.body.relates_to = req.body.relates_to._id;
        }
        let issue = await Issue.findOneAndUpdate({ key: req.params.key }, req.body, {
            new: true
        }).populate('project').populate('sprint').populate('relates_to').populate('assignee').populate('reporter').exec();
        res.format({
            html: () => { res.redirect('/issues/' + req.params.key); },
            json: () => { res.send(issue); }
        });
    } catch (err) {
        debug(err);
        req.flash('error', 'Failed to update ' + req.params.key);
        res.format({
            html: () => { res.redirect('/issues/' + req.params.key); },
            json: () => { res.status(500).send({}); }
        });
    }
});

module.exports = router;
