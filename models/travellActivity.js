'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TravellActivitySchema = Schema({
    travell: {
        type: Schema.ObjectId,
        ref: 'Travell'
    },
    activity: {
        type: Schema.ObjectId,
        ref: 'Activity'
    },
    date: Number
});

module.exports = mongoose.model('TravellActivity', TravellActivitySchema);
