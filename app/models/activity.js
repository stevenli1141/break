'use strict'

let mongoose = require('mongoose');
let schema = mongoose.Schema;

/**
 * Activity
 * 
 * belongs to: user, issue
 * types: comment, assignment, progress, git
 */

let activity = mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    edited: {
        type: Boolean,
        default: false
    },
    issue: {
        type: schema.Types.ObjectId,
        ref: 'Issue',
        required: true
    },
    user: {
        type: schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

activity.pre('save', function(next) {
    if (!this.time) {
        this.time = Date.now;
    }
    next();
})

module.exports = mongoose.model('Activity', activity);
