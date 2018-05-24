'use strict';

let router = require('./application');
let Activity = require('../models/activity');
let Issue = require('../models/issue');
let Project = require('../models/project');
let User = require('../models/user');
let debug = require('debug')('http');

router.get('/activities', async (req, res, next) => {
    try {
        let activities = await Activity.find({ issue: req.query.issue })
                                    .populate('user')
                                    .sort({ time: -1 })
                                    .exec();
        debug(activities);
        res.format({
            html: () => {
                next(new Error());
            },
            json: () => {
                res.send(activities);
            }
        });
    } catch(err) {
        next(err);
    }
});

router.post('/activities', async (req, res, next) => {
    try {
        let project = await Project.findById(req.body.issue.project._id).exec();
        if (!project || !project.organization.equals(req.user.organization._id)) {
            throw new Error('Unauthorized access');
        }
        let activity = new Activity({ type: req.body.activity.type, message: req.body.activity.message });
        activity.issue = req.body.issue._id;
        activity.user = req.user._id;
        activity = await activity.save();
        res.format({
            html: () => { res.render('/issues/' + req.body.issue.key); },
            json: () => { res.send(activity); }
        });
    } catch (err) {
        debug(err);
        next(err);
    }
});

module.exports = router;
