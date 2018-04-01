'use strict';

let mongoose = require('mongoose');
let schema = mongoose.Schema;

/**
 * Sprint
 * 
 * belongs to: project
 * has many: users
 */

let sprint = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    project: {
        type: schema.Types.ObjectId,
        ref: 'Project'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

sprint.pre('save', function(next) {
    if (!this.created_at) {
        this.created_at = Date.now;
    }
    next();
});

module.exports = mongoose.model('Sprint', sprint);
