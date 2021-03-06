'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

let schema = mongoose.Schema;

let user = mongoose.Schema({
    email: {
        type: String,
        index: true,
        unique: true,
        required: true
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
    title: {
        type: String,
        default: ''
    },
    projects: [{
        type: schema.Types.ObjectId,
        ref: 'Project',
    }],
    admin: {
        type: Boolean,
        default: false
    },
    organization: {
        type: schema.Types.ObjectId,
        ref: 'Organization'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

user.index({ email: 1 }, { unique: true });

let includes = function(next) {
    this.populate('organization');
    next();
}

user.pre('find', includes);
user.pre('findOne', includes);
user.pre('findById', includes);

user.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
    next();
});

user.pre('save', function(next) {
    if (!this.created_at) {
        this.created_at = Date.now;
    }
    next();
});

user.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

user.methods.name = function() {
    return this.firstname + ' ' + this.lastname;
}

module.exports = mongoose.model('User', user);
