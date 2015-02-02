var middleware    = require('../middleware');
var TransferModel     = require('../models/transfer');

module.exports = function UserRoutes(server) {
  server.get('/transfer/:id', function (req, res, next) {
    var transfer = new TransferModel({uuid: req.params.id});
    transfer.get(function(err, _transfer) {
      console.log(arguments);
      console.log(_transfer);
      res.send(200, {error: null, response: {id: _transfer}});
    })
  });

  server.post('/transfer', function (req, res, next) {
    
  });

}