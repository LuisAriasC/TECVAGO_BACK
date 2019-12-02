'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActivitySchema = Schema({
    name: String,
    cost: Number,
    days: [String],
    owner: String,
    rate: Number,
    recomendations: [{
        type: Schema.ObjectId,
        ref: 'Recomendation'
    }],
    destination:{
        type: Schema.ObjectId,
        ref: 'Destination'
    },
    image: String
});

module.exports = mongoose.model('Activity', ActivitySchema);
