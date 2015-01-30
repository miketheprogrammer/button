var config      = require('config');
var restify     = require('restify');


module.exports = function (server) {
  server.get('/beep', function (req, res, next) {
    res.send(200, {response: 'boop'});
  })
}

