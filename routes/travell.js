'use strict'

var express = require('express');
var travellController = require('../controllers/travell');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/travel', md_auth.ensureAuth,travellController.create);
api.get('/travel/:id', md_auth.ensureAuth, travellController.read);
api.get('/travels', md_auth.ensureAuth, travellController.readAll);
api.get('/travels-client', md_auth.ensureAuth, travellController.readAllByUser);
api.get('/travel-activities/:id', md_auth.ensureAuth, travellController.readAllActivities);
api.put('/travel/:id', md_auth.ensureAuth, travellController.update);
//api.delete('/travell/:id', md_auth.ensureAuth, travellController.delete);

module.exports = api;