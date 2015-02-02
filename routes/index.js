var UserRoutes = require('./user');
var TransferRoutes = require('./transfer');

module.exports = function (server) {
  UserRoutes(server);
  TransferRoutes(server);
  server.get('/beep', function (req, res, next) {
    res.send(200, {response: 'boop'});
  })
}

