//RUTAS CLIENT
'use strict'

var express = require('express');
var recomendationController = require('../controllers/recomendation');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/client',recomendationController.create);
api.get('/client/:id', md_auth.ensureAuth, recomendationController.read);
api.get('/clients', md_auth.ensureAuth, recomendationController.readAll);
api.put('/client/:id', md_auth.ensureAuth, recomendationController.update);
//api.delete('/client/:id', md_auth.ensureAuth, recomendationController.deleteClient);

module.exports = api;