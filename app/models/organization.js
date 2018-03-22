'use strict';

let mongoose = require('mongoose');
let schema = mongoose.Schema;

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
    owner: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date
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
