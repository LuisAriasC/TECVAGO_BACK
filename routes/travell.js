'use strict'

var express = require('express');
var travellController = require('../controllers/travell');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/travell', md_auth.ensureAuth,travellController.create);
api.get('/travell/:id', md_auth.ensureAuth, travellController.read);
api.get('/travells', md_auth.ensureAuth, travellController.readAll);
api.get('/travells-client', md_auth.ensureAuth, travellController.readAllByUser);
api.put('/travell/:id', md_auth.ensureAuth, travellController.update);
//api.delete('/travell/:id', md_auth.ensureAuth, travellController.delete);

module.exports = api;