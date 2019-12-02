//RUTAS CLIENT
'use strict'

var express = require('express');
var activityController = require('../controllers/activity');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/activity', activityController.create);
api.get('/activity/:id', md_auth.ensureAuth, activityController.read);
api.get('/activity', md_auth.ensureAuth, activityController.readAll);
api.get('/activities/:id', md_auth.ensureAuth, activityController.readByDestination);
api.put('/activity/:id', md_auth.ensureAuth, activityController.update);
//api.delete('/client/:id', md_auth.ensureAuth, activityController.deleteClient);

module.exports = api;