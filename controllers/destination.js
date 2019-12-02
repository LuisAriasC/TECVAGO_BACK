'use strict'
var Destination = require('../models/destination');

var destinationController = {};

//CREATE A NEW ACTIVITY
/*
send the next params in body
  name:
*/
destinationController.create = (req, res) => {

    var instance = new Destination();
    var params = req.body;

    instance.name = params.name;
    instance.type = params.type;
    instance.country = params.country;

    if (instance.name != null && instance.type != null && instance.country) {
        instance.save((err, instanceStored) => {
        if (err) {
          res.status(500).send({message: 'ERROR AL GUARDAR DESTINO'});
        }
        else {
          if (!instanceStored) {
            res.status(404).send({message: 'NO SE HA REGISTRADO LA DESTINO'});
          }
          else {
            res.status(200).send({message: 'DESTINO CREADA CORRECTAMENTE'});
          }
        }
      });
    }
    else {
      res.status(300).send({message: 'Introduce todos los campos'});
    }
}



//GET ACTIVITY
/*

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id
*/
destinationController.read = (req, res) => {
  var instanceId = req.params.id;

  Destination.findById(instanceId, (err, instance) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!instance) {
        res.status(404).send({message: 'EL CLIENTE NO EXISTE'});
      } else {
        res.status(200).send(instance);
      }
    }
  });
}


//GET CLIENTS
/*

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
NONE
*/
destinationController.readAll = (req, res) => {

  Destination.find().sort('name').exec((err, instances) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    }
    else {
      if (instances) {
        res.status(200).send(instances);
      }
      else {
        res.status(404).send({message: 'NO HAY DESTINOs'});
      }
    }
  });
}


//UPDATE CLIENT
/*
IMPLEMENTED WITH put

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id:
*/
destinationController.update = (req, res) => {

  var instanceId = req.params.id;
  var update = req.body;

  Destination.findByIdAndUpdate(instanceId, update, (err, instanceUpdated) => {
    if (err) {
      res.status(500).send({message: 'Error al actualizar DESTINO'});
    }
    else {
      if (!instanceUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar DESTINO'});
      }
      else {

        Destination.findOne({_id: instanceId}, (err, updatedInstance) => {
          if (err) {
            res.status(500).send({message: 'ERROR EN LA PETICION'});
          }
          else {
            if (!updatedInstance) {
              res.status(404).send({message: 'DESTINO NO EXISTE'});
            }
            else {
              res.status(200).send(updatedInstance);
            }
          }
        });
      }
    }
  });
}

module.exports = destinationController