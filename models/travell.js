'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TravellSchema = Schema({
  destination: {
      type: Schema.ObjectId,
      ref: 'Destination'
  },
  initialDate: Number,
  finalDate: Number,
  totalPrice: Number,
  rating: Number,
  /*
  activities: [{
      activity: {
          type: Schema.ObjectId,
          ref: 'Activity'
      },
      date: Date
  }],
  */
  client: {
    type: Schema.ObjectId,
    ref: 'Client'
  }
});
  
  module.exports = mongoose.model('Travell', TravellSchema);
  