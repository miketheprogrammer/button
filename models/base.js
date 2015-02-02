var config  = require('config');
var levelup = require('levelup');

var backend;
if (config.has('database.backend')) {
  console.log('using ', config.get('database.backend'));
  backend = require(config.get('database.backend'));
} else {
  backend = require('leveldown');
}
// 1) Create our database, supply location and options. 
//    This will create or open the underlying LevelDB store. 
var db = levelup(__dirname+'/../storage/buttondb', {db: backend, valueEncoding: 'json', keyEncoding: 'json'});



var BaseModel = module.exports = function BaseModel(obj) {
  if (obj) {
    this.load(obj);
  }
  this._db = db;
}

BaseModel._db = db;

BaseModel.prototype.fields = [];
BaseModel.prototype.requiredFields = [];

/*
Basic naive validation, just make sure the value exists
*/
BaseModel.prototype.validate = function () {
  return this.requiredFields.every(function(required) {
    if (this[required] !== undefined) {
      return true;
    } else {
      return false;
    }
  });
}

BaseModel.prototype.load = function (obj) {
  var self = this;
  this.fields.forEach(function (key) {
    self[key] = obj[key];
  });
  return this;
}

BaseModel.prototype.toMap = function (exclude) {
  var self = this;
  exclude = exclude || [];
  var map = {};
  this.fields.forEach(function(key) {
    if (exclude.indexOf(key) === -1) {
      map[key] = self[key];
    }
  });
  return map;
}

BaseModel.prototype.get = function (callback) {
  var key = this.getKey();
  if (key === undefined) {
    return callback(new Error('Could not generate key: was an email provided'));
  }
  var self = this;
  this._db.get(key, function (err, obj) {
    if (!err && obj) {
      self.load(obj);
    }
    if (err) {
      return callback(err);
    }
    return callback(err, self);
  });
}

BaseModel.prototype.all = function (callback) {
  var key = this.getRangeKey();
  var left = key + '!';
  var right = key + '~';
  var results = [];
  db.createReadStream({gte:left, lte:right})
    .on('data', function (data) {
      console.log(data);
      results.push(data.value);
    })
    .on('error', function (err) {
      callback(err);
      callback = function () {};
    })
    .on('close', function () {
    })
    .on('end', function () {
      callback(null, results);
    });
}

BaseModel.prototype.put = function (callback) {
  var key = this.getKey();
  if (key === undefined) {
    return callback(new Error('Could not generate key: was an email provided'));
  }
  this._db.put(key, this.toMap(), function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, true);
    }
  });
}


module.exports = BaseModel;