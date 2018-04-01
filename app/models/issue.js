'use strict';

let mongoose = require('mongoose');
let schema = mongoose.Schema;

/**
 * Issue
 * 
 * belongs to: project, sprint, user
 */

let issue = mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    priority: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    labels: [{
        type: String
    }],
    relates_to: {
        type: schema.Types.ObjectId,
        ref: 'Issue'
    },
    project: {
        type: schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    sprint: {
        type: schema.Types.ObjectId,
        ref: 'Sprint'
    },
    assignee: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    reporter: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

issue.pre('save', function(next) {
    if (!this.created_at) {
        this.created_at = Date.now;
    }
    next();
});


module.exports = mongoose.model('Issue', issue);
