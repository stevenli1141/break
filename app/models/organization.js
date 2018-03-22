'use strict';

let mongoose = require('mongoose');

let schema = mongoose.Schema({
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
        type: Date, default: Date.now
    }
});

schema.pre('save', function(next) {
    if (!this.created_at) {
        this.created_at = Date.now;
    }
    next();
});

schema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Organization', schema);
