var middleware    = require('../middleware');
var UserModel     = require('../models/user');
var TransferModel     = require('../models/transfer');

module.exports = function UserRoutes(server) {
  server.get('/user', function (req, res, next) {

  });

  server.post('/user', middleware.users.ensureUserNotExist, middleware.users.ensureUserValid,
    function (req, res, next) {
      req.body.points = 0;
      var user = new UserModel(req.body);
      user.put(function (err) {
        if (err) {
          res.send(404, {error: err});
        } else {
          res.send(200, {error: null, response: {id: user.email}});
        }
      });
  });

  server.get('/user/:id', middleware.users.ensureUserExist, function (req, res, next) {
    //ensureUserExist should get the user, or return a failure error;
    res.send(200, {error: null, response: req.user});
  });

  server.del('/user/:id', function (req, res, next) {
    db.del(req.params, function (err, value) {
      if (!err) {
      }
    });
  });

  server.get('/user/:id/transfers', middleware.users.ensureUserExist, function (req, res, next) {
    var transfer = new TransferModel({userKey: req.params.id});
    transfer.all(function(err, transfers) {
      res.send(200, {error: null, response: {id: transfers}});
    })
  });
}