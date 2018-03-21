'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

let schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date, default: Date.now
    },
    roles: [String]
});

schema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
    next();
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

module.exports = mongoose.model('User', schema);
