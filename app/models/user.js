'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

let Schema = mongoose.Schema;

let schema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    organization: [{ type: Schema.Types.ObjectId, ref: 'Organization' }],
    created_at: { type: Date, default: Date.now }
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

schema.methods.name = function() {
    return this.firstname + ' ' + this.lastname;
}

module.exports = mongoose.model('User', schema);
