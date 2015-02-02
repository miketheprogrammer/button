var BaseModel   = require('./base');
var util        = require('util');
var uuid        = require('node-uuid');

var Transfer = module.exports = function Transfer(obj) {
  obj = obj || {};
  obj.uuid = uuid.v4();
  BaseModel.call(this, obj);
}

util.inherits(Transfer, BaseModel);

Transfer.prototype.fields = ['userKey', 'operation', 'value', 'uuid'];
Transfer.prototype.requiredFields = ['userKey', 'operation', 'value', 'uuid'];

Transfer.prototype.getKey = function () {
  if (!this.userKey) {
    return undefined;
  }
  return 'users!'+this.userKey + '!transfers!' + this.uuid;
}

Transfer.prototype.getRangeKey = function () {
  if (!this.userKey) {
    return undefined;
  }

  return 'users!'+this.userKey + '!transfers'
}

/*
Get all transfers for a specific user
*/