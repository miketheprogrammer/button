var config      = require('config')
var restify     = require('restify');

var server = restify.createServer({
  name: config.name,
});

if (config.headerDefaults) {
  server.pre(function Headers(req, res, next) {
    req.headers.accept = config.headerDefaults.accept.join(', ');
    res.charSet('utf-8');
    if (next)
      return next();
  });
}

// Put any routes that need to be 100% streaming before the parser middleware

// Order dependent for optimizing speed. i.e. if a header check fails we should return before parsing query and body.
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());


// After this, it is buffer incoming, streaming allowed for outgoing.

require('./routes/index.js')(server);


if (require.main === module) {
  server.listen(config.server.port, function () {
    console.log('Server listening on: ' + config.server.addr + ':' + config.server.port);
  });
}

module.exports = server;