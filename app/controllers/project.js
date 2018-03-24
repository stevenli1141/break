'use strict';

let authorize = require('../helpers/authorize');
let Project = require('../models/project');

let debug = require('debug')('http');

let router = require('./application');

router.use(authorize.requireLogin);

router.get('/', async (req, res) => {
    res.locals.projects = await Project.find({ organization: req.user.organization });
    debug(res.locals.projects);
    res.format({
        html: () => { res.render('projects/index'); },
        json: () => { res.json(projects); }
    })
});

router.get('/:key', async (req, res) => {
    res.locals.project = await Project.findOne({ key: req.params.key });
    res.format({
        html: () => { res.render('projects/main'); },
        json: () => { res.json(project); }
    })
});

module.exports = router;
