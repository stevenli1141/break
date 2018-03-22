'use strict';

let mongoose = require('mongoose');
let schema = mongoose.Schema;

/**
 * Project
 * 
 * belongs to: organization
 * has many: sprints, issues, users
 */

let project = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    organization: {
        type: schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    created_at: {
        type: Date
    }
});

module.exports = mongoose.model('Project', project);
