'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecomendationSchema = Schema({
  name: String
});

module.exports = mongoose.model('Recomendation', RecomendationSchema);