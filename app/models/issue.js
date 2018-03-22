'use strict';

let mongoose = require('mongoose');
let schema = mongoose.Schema;

/**
 * Issue
 * 
 * belongs to: project, sprint, user
 */

let issue = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
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
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    sprint: {
        type: Schema.Types.ObjectId,
        ref: 'Sprint'
    },
    assignee: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
    }
});

module.exports = mongoose.model('Issue', issue);
