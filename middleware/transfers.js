var UserModel     = require('../models/user');
var TransferModel     = require('../models/transfer');

var ensurePointBoundary = exports.ensurePointBoundary = function ensurePointBoundary (req, res, next) {
  var transfer = req.body;

  // we can use req.user, since we will always EnsureUserExists prior to this middleware
  if (req.user === undefined) {
    return next(new Error('Must always EnsureUserExists prior to EnsurePointBoundary'));
  }

  if (transfer.operation !== 'deduct') {
    // We can skip middleware because add does not apply here. 
    return next();
  }

  var test = req.user.points - transfer.value;
  if (test < 0 || test === NaN) {
    return next(new Error('Illegal Transfer: Operation would bring points below minimum.'));
  }

  return next();
}