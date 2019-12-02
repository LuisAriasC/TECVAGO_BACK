'use strict'
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar rutas
var activity_routes = require('./routes/activity');
var client_routes = require('./routes/client');
var destination_routes = require('./routes/destination');
var employee_routes = require('./routes/employee');
var recomendation_routes = require('./routes/recomandation');
var travell_routes = require('./routes/travell');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Configurar cabeceras http
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header('Allow', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

//Rutas base
app.use('/api', activity_routes);
app.use('/api', employee_routes);
app.use('/api', client_routes);
app.use('/api', destination_routes);
app.use('/api', recomendation_routes);
app.use('/api', travell_routes);

module.exports = app;
