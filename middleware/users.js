var UserModel     = require('../models/user');

var ensureUserExist = exports.ensureUserExist = function (req, res, next) {
  var id = req.params.id || req.body.email;

  if (!id) {
    return next(new Error('Must provider a user id'));
  }
  var user = new UserModel({email: req.params.id});
  user.get(function (err, user) {
    if (err) {
      return next(new Error('User does not exist:' + err.message));
    } else {

      req.user = user;
      next();
    }
  });
}

var ensureUserNotExist = exports.ensureUserNotExist = function (req, res, next) {
  var id = req.params.id || req.body.email;

  if (!id) {
    return next(new Error('Must provide a user id'));
  }
  var user = new UserModel({email: id});
  user.get(function (err, user) {
    if (err && !user) {
      next();
    } else {
      next(new Error('User already exists'));
    }
  })
}

var ensureUserValid = exports.ensureUserValid = function (req, res, next) {
  Object.keys(req.body).forEach(function (key) {
    if (['email', 'firstName', 'lastName'].indexOf(key) === -1) {
      return next(new Error('RequiredField('+key+') not provided'));
    }
  });

  return next();
}