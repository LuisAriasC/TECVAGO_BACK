//CONTROLADOR CLIENT
'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var Client = require('../models/client');
var Travell = require('../models/travell');


//CRUD
var jwt = require('../services/jwt');

var clientController = {};

//CREATE A NEW CLIENT
/*
Function used to create a client.
This function returns the created client (as a JSON OBJECT)

IMPLEMENTED WITH post
in header send the next params
  NO PARAMS IN HEADER

in the request parameters send the next atributes in the express url
NONE

send the next params in body
  name:
  surname:
  email:
  username:
  password:
*/
clientController.createClient = (req, res) => {

    var client = new Client();
    var params = req.body;

    client.name = params.name;
    client.surname = params.surname;
    client.email = params.email;
    client.username = params.username;
    client.status = 'ACTIVE';
    client.image = 'null';
    client.balance = 0;


    if (params.password) {
      //Encriptar contraseña y guardar datos
      bcrypt.hash(params.password, null, null, function(err, hash){
        if (client.name != null && 
            client.surname != null && 
            client.email != null &&
            client.username != null
          ) {
          client.password = hash;
          //Guarar usuario en BD
          client.save((err, clientStored) => {
            if (err) {
              res.status(500).send({message: 'ERROR AL GUARDAR CLIENTE'});
            }
            else {
              if (!clientStored) {
                res.status(404).send({message: 'NO SE HA REGISTRADO EL CLIENTE'});
              }
              else {
                //Devolver los datos del cliente logeado
                const token = jwt.createToken(clientStored)
                var nemployee = {};
                nemployee.name = clientStored.name;
                nemployee.surname = clientStored.surname;
                nemployee.username = clientStored.username;
                //devolver token de jwt
                res.status(200).send({
                  client: nemployee,
                  token
                });
                //res.status(200).send({message: 'USUARIO CREADO CORRECTAMENTE'});
              }
            }
          });
        }
        else {
          res.status(200).send({message: 'Introduce todos los campos'});
        }
      });
    }
    else{
      res.status(500).send({message: 'Introduce la contraseña'});
    }
}


//LOGIN AS AN CLIENT
/*
Function used to login as an employee (ADMIN or normal employee).
This function returns a token if the login was correct and the logged client JSON object

IMPLEMENTED WITH post

in header send the next params
  NO PARAMS IN HEADER

in the request parameters send the next atributes in the express url
  NO PARAMS IN URL

in the request body send the next atributes
  email: email_of_the_user (this is mandatory)
  password: password_of_the_user (this is mandatory)
  gethash: true (this is mandatory and with this you reciebe the token, if not, just reciebe employee)
*/
clientController.loginClient = (req, res) => {

  console.log('LOGIN CLIENT REQUEST ---');
  console.log(req.body);
  var params = req.body;
  var email = params.email;
  var password = params.password;

  Client.findOne({email: email.toLowerCase()}, (err, client) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      if (!client) {
        console.log('doesnt exists');
        res.status(404).send({message: 'EL CLIENTE NO EXISTE'});

      } else {
        //Comprobar contraseña
        bcrypt.compare(password, client.password, (err, check) => {
          if (check) {
            //Devolver los datos del cliente logeado
            const token = jwt.createToken(client)
            var nemployee = {};
            nemployee.name = client.name;
            nemployee.surname = client.surname;
            nemployee.username = client.username;
            //devolver token de jwt
            res.status(200).send({
              client: nemployee,
              token
            });
          }
          else {
            res.status(404).send({message: 'EL CLIENTE NO HA PODIDO LOGUEARSE'});
          }
        });
      }
    }
  });
}



//GET CLIENT
/*
Function that returns an employee (as a JSON object) with a given id of the employee

IMPLEMENTED WITH get

in header send the next params
  Authorization: token (this is mandatory)
  role: ROLE_ADMIN this is mandatory) //Just the admin can get user

in the request parameters send the next atributes in the express url
  id: employee_id (this is mandatory)
*/
clientController.readClient = (req, res) => {
  var clientId = req.params.id;

  Client.findById(clientId, (err, client) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!client) {
        res.status(404).send({message: 'EL CLIENTE NO EXISTE'});
      } else {
        res.status(200).send(client);
      }
    }
  });
}

clientController.read = (req, res) => {
  console.log('GET USER ,', req.user.sub);
  var clientId = req.user.sub;

  Client.findById(clientId, (err, client) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!client) {
        res.status(404).send({message: 'EL CLIENTE NO EXISTE'});
      } else {
        Travell.count({client: clientId}, function( err, count){
          if (err) {
            res.status(500).send({message: 'ERROR EN LA PETICION'});
          } else {
            console.log(client);
            res.status(200).send({client, travells: count});
          }
        });
      }
    }
  });
}


//GET CLIENTS
/*
Function that returns the number and a lsit of active clients in a page (as a JSON object)

IMPLEMENTED WITH get

in header send the next params
  Authorization: token (this is mandatory)
  role: ROLE_ADMIN (this is mandatory) just the admin can get the list of clients

in the request parameters send the next atributes in the express url
NONE
*/
clientController.readClients = (req, res) => {
  console.log('CLIENTS REQ');

  Client.find({status: 'ACTIVE'}).sort('name').exec((err, clients) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    }
    else {
      if (clients) {
        res.json(clients);
      }
      else {
        res.status(404).send({message: 'NO HAY CLIENTES'});
      }
    }
  });
}


//UPDATE CLIENT
/*
Function that updates and returns the updated client (as a JSON object)

IMPLEMENTED WITH put

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id: id_of_client_to_update (this is mandatory)
*/
clientController.updateClient = (req, res) => {

  var clientId = req.params.id;
  var update = req.body;

  Client.findByIdAndUpdate(clientId, update, (err, clientUpdated) => {
    if (err) {
      res.status(500).send({message: 'Error al actualizar cliente'});
    }
    else {
      if (!clientUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar al cliente'});
      }
      else {

        Client.findOne({_id: clientId}, (err, upClient) => {
          if (err) {
            res.status(500).send({message: 'ERROR EN LA PETICION'});
          }
          else {
            if (!upClient) {
              res.status(404).send({message: 'EL CLIENTE NO EXISTE'});
            }
            else {
              Travell.count({client: clientId}, function( err, count){
                if (err) {
                  res.status(500).send({message: 'ERROR EN LA PETICION'});
                } else {
                  res.status(200).send({client: upClient, travells: count});
                }
              });
            }
          }
        });
      }
    }
  });
}


clientController.update = (req, res) => {
  var clientId = req.user.sub;
  var update = req.body;

  Client.findByIdAndUpdate(clientId, update, (err, clientUpdated) => {
    if (err) {
      res.status(500).send({message: 'Error al actualizar cliente'});
    }
    else {
      if (!clientUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar al cliente'});
      }
      else {

        Client.findOne({_id: clientId}, (err, upClient) => {
          if (err) {
            res.status(500).send({message: 'ERROR EN LA PETICION'});
          }
          else {
            if (!upClient) {
              res.status(404).send({message: 'EL CLIENTE NO EXISTE'});
            }
            else {
              res.status(200).send(upClient);
            }
          }
        });
      }
    }
  });
}



//DELETE CLIENT
/*
Function that deletes (not really delete, just deactivastes) and returns the deactivated client (as a JSON object)

IMPLEMENTED WITH delete

in header send the next params
  Authorization: token (this is mandatory)
  role: ROLE_ADMIN (this is mandatory) //just admin can delete clients

in the request parameters send the next atributes in the express url
  id: id_of_employee_to_deactivate (this is mandatory)
  employee: id_of_admin_who_deletes_client (this is mandatory)
*/
clientController.deleteClient = (req,res) => {

  var clientId = req.params.id;
  var update = {status: 'INACTIVE'};

  Client.findByIdAndUpdate(clientId, update, (err, clientUpdated) => {
    if (err) {
      res.status(500).send({message: 'Error al actualizar cliente'});
    }
    else {
      if (!clientUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar al cliente'});
      }
      else {

        Client.findOne({_id: clientId}, (err, upClient) => {
          if (err) {
            res.status(500).send({message: 'ERROR EN LA PETICION'});
          }
          else {
            if (!upClient) {
              res.status(404).send({message: 'EL CLIENTE NO EXISTE'});
            }
            else {
              res.status(200).send(upClient);
            }
          }
        });
      }
    }
  });


}


//UPLOAD CLIENTS IMAGE
/*
Function that uploads an image to an employee and returns the employee (as a JSON object)

IMPLEMENTED WITH post

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id: id_of_client (this is mandatory)
*/
clientController.uploadImage = (req, res) => {

  var clientId = req.params.id;
  var file_name = 'null';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];
    var ext_split = file_path.split('.');
    var file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      Client.findByIdAndUpdate(clientId, {image: file_name}, (err, clientUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error al actualizar cliente'});
        }
        else {
          if (!clientUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar al cliente'});
          }
          else {
            res.status(200).send({image: file_name, user: clientUpdated});
          }
        }
      });
    }
    else {
      res.status(200).send({message: 'Extensión no valida'});
    }
  }
  else {
    res.status(200).send({message: 'No se ha subido ninguna imagen'});
  }
}



//GET CLIENTS IMAGE
/*
Function that returns a clients image file

IMPLEMENTED WITH get

in header send the next params
  Authorization: token (this is mandatory)

in the request parameters send the next atributes in the express url
  id: imageFile (this is mandatory, is the name of the image in the clients image: attribute)
*/
clientController.getImageFile = (req, res) => {
  var imageFile = req.params.imageFile;
  var path_file = './uploads/clients/' + imageFile;
  fs.exists(path_file, function(exists){
    if (exists) {
      res.sendFile(path.resolve(path_file));
    }
    else {
      res.status(200).send({message: 'No existe la imagen'});
    }
  });
}

module.exports = clientController
