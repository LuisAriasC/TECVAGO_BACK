'use strict'
var Recomendation = require('../models/recomendation');

var recomendationCotroller = {};

//CREATE A NEW ACTIVITY
/*
send the next params in body
  name:
*/
recomendationCotroller.create = (req, res) => {

    var instance = new Recomendation();
    var params = req.body;

    instance.name = params.name;

    if (instance.name != null) {
        instance.save((err, instanceStored) => {
        if (err) {
          res.status(500).send({message: 'ERROR AL GUARDAR RECOMENDACION'});
        }
        else {
          if (!instanceStored) {
            res.status(404).send({message: 'NO SE HA REGISTRADO LA RECOMENDACION'});
          }
          else {
            res.status(200).send({message: 'RECOMENDACION CREADA CORRECTAMENTE'});
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
  id: recomendation_id (this is mandatory)
*/
recomendationCotroller.read = (req, res) => {
  var instanceId = req.params.id;

  Recomendation.findById(instanceId, (err, instance) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!instance) {
        res.status(404).send({message: 'EL CLIENTE NO EXISTE'});
      } else {
        res.status(200).send({recomendation: instance});
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
recomendationCotroller.readAll = (req, res) => {

  Recomendation.find().sort('name').exec((err, instances) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    }
    else {
      if (instances) {
        res.status(200).send({recomendations: instances});
      }
      else {
        res.status(404).send({message: 'NO HAY RECOMENDACIONES'});
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
  id: id_of_recomendation (this is mandatory)
*/
recomendationCotroller.update = (req, res) => {

  var instanceId = req.params.id;
  var update = req.body;

  Recomendation.findByIdAndUpdate(instanceId, update, (err, instanceUpdated) => {
    if (err) {
      res.status(500).send({message: 'Error al actualizar recomendacion'});
    }
    else {
      if (!instanceUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar recomendacion'});
      }
      else {

        Recomendation.findOne({_id: instanceId}, (err, updatedInstance) => {
          if (err) {
            res.status(500).send({message: 'ERROR EN LA PETICION'});
          }
          else {
            if (!updatedInstance) {
              res.status(404).send({message: 'RECOMENDACION NO EXISTE'});
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

module.exports = recomendationCotroller
