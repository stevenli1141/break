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
    created_at: {
        type: Date
    }
});

module.exports = mongoose.model('Sprint', sprint);
