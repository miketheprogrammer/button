var middleware    = require('../middleware');
var UserModel     = require('../models/user');
var TransferModel     = require('../models/transfer');

module.exports = function UserRoutes(server) {
  server.post('/user', middleware.users.ensureUserNotExist,
    function (req, res, next) {
      var user = new UserModel(req.body);
      user.points = 0;
      user.put(function (err) {
        if (err) {
          return res.send(404, {error: err});
        } else {
          return res.send(201, {error: null, response: {id: user.email}});
        }
      });
  });

  server.get('/user/:id', middleware.users.ensureUserExist, function (req, res, next) {
    //ensureUserExist should get the user, or return a failure error;
    return res.send(200, {error: null, response: req.user.toMap()});
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
      res.send(200, {error: null, response: transfers});
    })
  });

  server.post('/user/:id/transfer', middleware.users.ensureUserExist, middleware.transfers.ensurePointBoundary, function (req, res, next) {
    req.body.userKey = req.user.email;
    var transfer = new TransferModel(req.body);
    if (['add', 'deduct'].indexOf(transfer.operation) === -1) {
      return res.send(400, {error:'Unsupported Operation: ' + transfer.operation, response: null });
    }
    transfer.put(function(err) {
      if (err) {
        return res.send(404, {error: err});
      }

      if (transfer.operation === 'add') {
        req.user.points += transfer.value;
      } else {
        req.user.points -= transfer.value;
      }
      req.user.put(function(err) {
        if (err) {
          return res.send(404, {error: err});
        }
        return res.send(201, {error: null, response: {id: transfer.uuid}});
      })
    })
  })
}