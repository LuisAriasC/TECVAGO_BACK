'use strict'
var Travell = require('../models/travell');
var TravellActivity = require('../models/travellActivity');

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
    //instance.activities = params.activities;
    instance.client = req.user.sub;

    if (instance.destination != null &&
        instance.initialDate != null &&
        instance.finalDate != null &&
        instance.totalPrice != null &&
        //instance.activities != null &&
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
            params.activities.forEach(element => {
              var activity = new TravellActivity();
              activity.travell = instanceStored._id;
              activity.activity = element.activity;
              activity.date = element.date;
              activity.save((err, activityStored) => {
                if(err) {
                  res.status(500).send({message: 'ERROR AL GUARDAR VIAJE'});
                } else {
                  if(!activityStored) {
                    res.status(404).send({message: 'NO SE HA REGISTRADO LA VIAJE'});
                  }
                }
              });
            });
            res.status(200).send({message: 'Viaje contratado exitosamente'});
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
    Travell.find({client: uId})
           .sort('name')
           .populate('destination')
           .exec((err, instances) => {
      if (err) {
        res.status(500).send({message: 'ERROR EN LA PETICION'});
      }
      else {
        if (instances) {
          const travels = [];
          instances.forEach(item => {
            let travel = {};
            travel._id = item._id;
            travel.name = item.destination.name;
            travel.type = item.destination.type;

            var d1 = new Date(0);
            var d2 = new Date(0);
            d1.setUTCSeconds(item.initialDate);
            var date = d1.getDate();
            var month = d1.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
            var year = d1.getFullYear();
            var date1Str = date + "/" + month + "/" + year;
            d2.setUTCSeconds(item.finalDate);
            date = d2.getDate();
            var month = d2.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
            var year = d2.getFullYear();
            var date2Str = date + "/" + month + "/" + year;
            
            let dates = `${date1Str} - ${date2Str}`;
            travel.dates =  dates;
            travel.price = item.totalPrice;
            travel.rating = item.rating;
            travels.push(travel);
          });
          res.status(200).send(travels);
        }
        else {
          res.status(404).send({message: 'NO HAY VIAJEs'});
        }
      }
    });
}

travellCotroller.readAllActivities = (req, res) => {
  var travellId = req.params.id;
  TravellActivity.find({travell: travellId}).select('-travell -activity.days').populate('activity').exec((err, activities) => {
    if(err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if(!activities){
        res.status(404).send({message: 'EL VIAJE NO EXISTE'});
      } else {
        res.status(200).send(activities);
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
