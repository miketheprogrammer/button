var BaseModel   = require('./base');
var util        = require('util');

var User = module.exports = function User(obj) {
  BaseModel.call(this, obj);
}

util.inherits(User, BaseModel);

User.prototype.fields = ['email', 'firstName', 'lastName', 'points'];
User.prototype.requiredFields = ['email', 'firstName', 'lastName'];

User.prototype.getKey = function () {
  if (!this.email) {
    return undefined;
  }
  return 'users!'+this.email;
}
