var UserModel     = require('../models/user');

var ensureUserExist = exports.ensureUserExist = function (req, res, next) {
  var id = req.params.id || req.body.email;

  if (!id) {
    return next(new Error('Must provider a user id'));
  }
  var user = new UserModel({email: req.params.id});
  user.get(function (err, user) {
    if (err) {
      return res.send(404, {error: "User does not exist", response: null});
    } else {
      req.user = user;
      next();
    }
  });
}

var ensureUserNotExist = exports.ensureUserNotExist = function (req, res, next) {
  var id = req.params.id || req.body.email;

  if (!id) {
    return res.send(400, {error: "Must provide a user id", response: null});
  }
  var user = new UserModel({email: id});
  user.get(function (err, user) {
    if (err && !user) {
      next();
    } else {
      return res.send(403, {error: "User already exists", response: null});
    }
  })
}

var ensureUserValid = exports.ensureUserValid = function (req, res, next) {
  Object.keys(req.body).forEach(function (key) {
    if (['email', 'firstName', 'lastName'].indexOf(key) === -1) {
      return res.send(400, {error: 'RequiredField('+key+') not provided', response: null});
    }
  });

  return next();
}