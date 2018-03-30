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
                let params = {};
                if (req.query.projectkey && req.query.projectkey.length > 0) {
                    params.key = new RegExp('^' + req.query.projectkey + '-');
                }
                if (req.query.title && req.query.title.length > 0) {
                    params.title = new RegExp(req.query.title, 'i');
                }
                if (req.query.assigned) {
                    params.assignee = req.query.assigned;
                }
                let issues = await Issue.find(params).populate('assignee').sort({ key: -1 }).exec();
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
            html: () => { res.render('issues/show', { key: req.params.key }); },
            json: async () => {
                let issue = await Issue.findOne({ key: req.params.key })
                    .populate('project').populate('sprint').populate('assignee').exec();
                res.send(issue);
            }
        });
    } catch (err) { next(err); }
});

router.post('/issues', async (req, res, next) => {
    try {
        debug(req.body);
        let issue = new Issue(req.body);
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
        req.flash('error', 'Failed to create issue');
        res.format({
            html: () => { res.redirect('/issues/new'); },
            json: () => { res.status(500).send({}); }
        });
    }
});

router.put('/issues/:key', async (req, res, next) => {
    try {
        req.body.assignee = req.body.assignee._id;
        let issue = await Issue.findOneAndUpdate({ key: req.params.key }, req.body, {
            new: true
        }).populate('project').populate('assignee').exec();
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
