'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DestinationSchema = Schema({
    name: String,
    type: String,
    country: String
});
  
module.exports = mongoose.model('Destination', DestinationSchema);
  