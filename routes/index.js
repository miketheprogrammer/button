var UserRoutes = require('./user');

module.exports = function (server) {
  UserRoutes(server);
}

var restify       = require('restify');
var assert        = require('assert');
var expect        = require('chai').expect;
var db            = require('../../models/base')._db;
var xtend         = require('xtend');
var User          = require('../../models/user');
var Transfer      = require('../../models/transfer');
                    require('../../index').listen(3000);

// Creates a JSON client
var client = restify.createJsonClient({
  // url: 'http://localhost:3000'
  url: 'https://mtp-button.herokuapp.com'
});


var user = {
  email: 'michael.hernandez1988@gmail.com',
  firstName: "Michael",
  lastName: "Hernandez",
  points: 0
};
var transferAdd = {
  operation: 'add',
  value: 20,
  userKey: user.email
};
var transferDeduct = {
  operation: 'deduct',
  value: 20,
  userKey: user.email
};
var transferUnsupported = {
  operation: "divide",
  value: 20,
  userKey: user.email
};

// client.put('/user', user, function (err, req, res, obj) {
//   client.put('/user/'+user.email+'/transfer', transferAdd, function (err, req, res, obj) {
//     client.put('/user/'+user.email+'/transfer', transferAdd, function (err, req, res, obj) {
//       client.put('/user/'+user.email+'/transfer', transferAdd, function (err, req, res, obj) {

//       })
//     })
//   })
// })
  client.put('/user/'+user.email+'/transfer', transferAdd, function (err, req, res, obj) {
    console.log(err, obj);
    client.put('/user/'+user.email+'/transfer', transferAdd, function (err, req, res, obj) {
      client.put('/user/'+user.email+'/transfer', transferAdd, function (err, req, res, obj) {

      })
    })
  })
