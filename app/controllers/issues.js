let router = require('./application');
let Issue = require('../models/issue');
let Project = require('../models/project');
let Sprint = require('../models/sprint');
let User = require('../models/user');

router.get('/issues', async (req, res) => {
    try {
        let issues = [];
        if (req.query.project) {
            issues = await Issue.find({ key: new RegExp('^' + req.query.project + '-') }).sort('key').exec();
        } else if(req.query.assigned) {
            issues = await Issue.find({ assignee: req.user._id}).sort('key').exec();
        } else {
            let project_ids = await Project.find({ organization: req.user.organization._id }).select('_id');
            issues = await Issue.find({ project: project_ids }).sort('key').exec();
        }
        res.format({
            html: () => { res.render('issues/index', { issues: issues }); },
            json: () => { res.send(issues); }
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
        let issue = await Issue.findOneAndUpdate({ key: req.params.key }, req.body, {
            new: true
        }).populate('project').exec();
        res.format({
            html: () => { res.redirect('/issues/' + req.params.key); },
            json: () => { res.send(issue); }
        });
    } catch (err) {
        req.flash('error', 'Failed to update ' + req.params.key);
        res.format({
            html: () => { res.redirect('/issues/' + req.params.key); },
            json: () => { res.status(500).send({}); }
        });
    }
});

module.exports = router;
