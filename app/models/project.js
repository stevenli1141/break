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
    key: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    total: {
        type: Number
    },
    organization: {
        type: schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    lead: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date
    }
});

project.pre('save', function(next) {
    if (!this.created_at) this.created_at = Date.now;
    next();
});

module.exports = mongoose.model('Project', project);
