var UserModel     = require('../models/user');
var TransferModel     = require('../models/transfer');

var ensurePointBoundary = exports.ensurePointBoundary = function ensurePointBoundary (req, res, next) {
  var transfer = req.body;

  // we can use req.user, since we will always EnsureUserExists prior to this middleware
  if (req.user === undefined) {
    return res.send(500, {error: 'Must always EnsureUserExists prior to EnsurePointBoundary', response:null });
  }

  if (transfer.operation !== 'deduct') {
    // We can skip middleware because add does not apply here. 
    return next();
  }

  var test = req.user.points - transfer.value;
  if (test < 0 || test === NaN) {
    return res.send(403, {error: 'Illegal Transfer: Operation would bring points below minimum.', response: null});
  }

  return next();
}