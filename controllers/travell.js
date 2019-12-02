'use strict'
var Travell = require('../models/travell');

var travellCotroller = {};

//CREATE A NEW TRAVELL
/*
send the next params in body
  name:
*/
travellCotroller.create = (req, res) => {

    var instance = new Travell();
    var params = req.body;

    instance.destination = params.destination;
    instance.initialDate = params.initialDate;
    instance.finalDate = params.finalDate;
    instance.totalPrice = params.totalPrice;
    instance.rating = params.rating;
    instance.activities = params.activities;
    instance.client = req.user.sub;

    if (instance.destination != null &&
        instance.initialDate != null &&
        instance.finalDate != null &&
        instance.totalPrice != null &&
        instance.activities != null &&
        instance.client != null) 
    {
        instance.save((err, instanceStored) => {
        if (err) {
          res.status(500).send({message: 'ERROR AL GUARDAR VIAJE'});
        }
        else {
          if (!instanceStored) {
            res.status(404).send({message: 'NO SE HA REGISTRADO LA VIAJE'});
          }
          else {
            res.status(200).send(instanceStored);
          }
        }
      });
    }
    else {
      res.status(300).send({message: 'Introduce todos los campos'});
    }
}



//GET TRAVELL
/*

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id
*/
travellCotroller.read = (req, res) => {
  var instanceId = req.params.id;

  Travell.findById(instanceId, (err, instance) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!instance) {
        res.status(404).send({message: 'EL CLIENTE NO EXISTE'});
      } else {
        res.status(200).send({travell: instance});
      }
    }
  });
}


//GET TRAVELLS
/*

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
NONE
*/
travellCotroller.readAll = (req, res) => {

  Travell.find().sort('name').exec((err, instances) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    }
    else {
      if (instances) {
        res.status(200).send({travells: instances});
      }
      else {
        res.status(404).send({message: 'NO HAY VIAJEs'});
      }
    }
  });
}

travellCotroller.readAllByUser = (req, res) => {
    var uId = req.user.sub;
    Travell.find({client: uId}).sort('name').exec((err, instances) => {
      if (err) {
        res.status(500).send({message: 'ERROR EN LA PETICION'});
      }
      else {
        if (instances) {
          res.status(200).send(instances);
        }
        else {
          res.status(404).send({message: 'NO HAY VIAJEs'});
        }
      }
    });
}


//UPDATE TRAVELL
/*
IMPLEMENTED WITH put

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id:
*/
travellCotroller.update = (req, res) => {

  var instanceId = req.params.id;
  var update = req.body;

  Travell.findByIdAndUpdate(instanceId, update, (err, instanceUpdated) => {
    if (err) {
      res.status(500).send({message: 'Error al actualizar VIAJE'});
    }
    else {
      if (!instanceUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar VIAJE'});
      }
      else {

        Travell.findOne({_id: instanceId}, (err, updatedInstance) => {
          if (err) {
            res.status(500).send({message: 'ERROR EN LA PETICION'});
          }
          else {
            if (!updatedInstance) {
              res.status(404).send({message: 'VIAJE NO EXISTE'});
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

module.exports = travellCotroller
