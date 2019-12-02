//RUTAS CLIENT
'use strict'

var express = require('express');
var destinationController = require('../controllers/destination');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/destination',destinationController.create);
api.get('/destination/:id', md_auth.ensureAuth, destinationController.read);
api.get('/destination', md_auth.ensureAuth, destinationController.readAll);
api.put('/destination/:id', md_auth.ensureAuth, destinationController.update);
//api.delete('/client/:id', md_auth.ensureAuth, destinationController.deleteClient);

module.exports = api;