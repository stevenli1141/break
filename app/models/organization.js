'use strict';

let mongoose = require('mongoose');
let schema = mongoose.Schema;

/**
 * Organization
 * belongs to: user
 * has many: projects
 */

let organization = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        default: 'Organization'
    },
    created_at: {
        type: Date
    }
});

let includes = function(next) {
    this.populate('projects');
    next();
}

organization.pre('save', function(next) {
    if (!this.created_at) {
        this.created_at = Date.now;
    }
    next();
});

organization.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Organization', organization);
