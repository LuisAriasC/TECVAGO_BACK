'use strict'
var Activity = require('../models/activity');

var activityController = {};

//CREATE A NEW ACTIVITY
/*
send the next params in body
  name:
*/
activityController.create = (req, res) => {

    var instance = new Activity();
    var params = req.body;

    instance.name = params.name;
    instance.cost = params.cost;
    instance.days = params.days;
    instance.owner = params.owner;
    instance.rate = params.rate;
    instance.recomendations= params.recomendations;
    instance.destination = params.destination;
    instance.image = params.image;

    if (instance.name != null && 
        instance.cost != null && 
        instance.days != null &&
        instance.owner != null &&
        instance.rate != null &&
        instance.recomendations != null &&
        instance.destination != null
    ) {
        instance.save((err, instanceStored) => {
        if (err) {
          res.status(500).send({message: 'ERROR AL GUARDAR ACTIVIDAD'});
        }
        else {
          if (!instanceStored) {
            res.status(404).send({message: 'NO SE HA REGISTRADO LA ACTIVIDAD'});
          }
          else {
            res.status(200).send({message: 'ACTIVIDAD CREADA CORRECTAMENTE'});
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
activityController.read = (req, res) => {
  var instanceId = req.params.id;

  Activity.findById(instanceId, (err, instance) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!instance) {
        res.status(404).send({message: 'EL CLIENTE NO EXISTE'});
      } else {
        res.status(200).send({activity: instance});
      }
    }
  });
}


//GET ACTIVITIES
/*

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
NONE
*/
activityController.readAll = (req, res) => {

  Activity.find().sort('name').exec((err, instances) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    }
    else {
      if (instances) {
        res.status(200).send(instances);
      }
      else {
        res.status(404).send({message: 'NO HAY ACTIVIDADs'});
      }
    }
  });
}

activityController.readByDestination = (req, res) => {
    var instanceId = req.params.id;
    Activity.find({destination: instanceId}).sort('name').exec((err, instances) => {
      if (err) {
        res.status(500).send({message: 'ERROR EN LA PETICION'});
      }
      else {
        if (instances) {
          res.status(200).send(instances);
        }
        else {
          res.status(404).send({message: 'NO HAY ACTIVIDADs'});
        }
      }
    });
  }


//UPDATE ACTIVITY
/*
IMPLEMENTED WITH put

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id:
*/
activityController.update = (req, res) => {

  var instanceId = req.params.id;
  var update = req.body;

  Activity.findByIdAndUpdate(instanceId, update, (err, instanceUpdated) => {
    if (err) {
      res.status(500).send({message: 'Error al actualizar ACTIVIDAD'});
    }
    else {
      if (!instanceUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar ACTIVIDAD'});
      }
      else {

        Activity.findOne({_id: instanceId}, (err, updatedInstance) => {
          if (err) {
            res.status(500).send({message: 'ERROR EN LA PETICION'});
          }
          else {
            if (!updatedInstance) {
              res.status(404).send({message: 'ACTIVIDAD NO EXISTE'});
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

module.exports = activityController
