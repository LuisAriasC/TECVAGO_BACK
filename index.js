//INDEX
'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 8080;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://admin:L550lv228.@deacero-kmxan.gcp.mongodb.net/test?retryWrites=true', (err, res) => {
  if (err)
    throw err;
  else {
    console.log('La conexion a la base de datos está corriendo correctamente');
    app.listen(port, () => {
      console.log('Servidor del API rest escuchando en el puerto ' + port);
    }
    );
  }
});
