var restify       = require('restify');
var assert        = require('assert');
var expect        = require('chai').expect;
var db            = require('../../models/base')._db;
var xtend         = require('xtend');
var User          = require('../../models/user');
var Transfer      = require('../../models/transfer');
                    require('../../index').listen(3000);

// Creates a JSON client
var client = restify.createJsonClient({
  url: 'http://localhost:3000'
});

describe('/routes', function () { 
  var user = {
    email: 'michael.hernandez1988@gmail.com',
    firstName: "Michael",
    lastName: "Hernandez",
    points: 0
  };
  var transferAdd = {
    operation: 'add',
    value: 20,
    userKey: user.email
  };
  var transferDeduct = {
    operation: 'deduct',
    value: 20,
    userKey: user.email
  };
  var transferUnsupported = {
    operation: "divide",
    value: 20,
    userKey: user.email
  };
  describe('users', function () {
    describe('GET /user/:id', function () {
      before(function (done) {
       (new User(user)).put(done);
      });
      after(function (done) {
        db.del((new User(user)).getKey(), done);
      });
      it('should return a user from the database', function (done) {
        client.get('/user/'+user.email, function (err, req, res, obj) {
          expect(err).to.be.null;
          expect(obj).to.have.property('response');
          expect(obj.response).to.have.property('email').and.to.equal('michael.hernandez1988@gmail.com');
          expect(obj.response).to.have.property('firstName').and.to.equal('Michael');
          expect(obj.response).to.have.property('lastName').and.to.equal('Hernandez');
          done();
        });
      });
    });
    describe('POST /user', function () {
      after(function (done) {
        db.del((new User(user)).getKey(), done);
      })
      it('should insert a user in the database and return a response', function (done) {
        client.post('/user', user, function(err, req, res, obj) {
          expect(err).to.be.null;
          expect(obj).to.have.property('response').and.to.property('id').and.to.equal(user.email);
          done();
        });
      });

      it('should fail to insert a user a second time', function (done) {
        client.post('/user', user, function(err, req, res, obj) {
          expect(err).to.exist;
          expect(err).to.have.property('message')
          expect(JSON.parse(err.message)).to.have.property('message').and.to.equal('User already exists')
          done();
        });
      });
      it('should fail when users object does not have email', function (done) {
        client.post('/user', {firstName: user.firstName, lastName: user.lastName}, function(err, req, res, obj) {
          expect(err).to.exist;
          expect(err).to.have.property('message');
          expect(JSON.parse(err.message)).to.have.property('message').and.to.equal('Must provide a user id');
          done();
        });
      })
    })
  });
  describe('user transfers', function () {
    describe('GET /user/:id/transfer', function () {
      var transfer;
      before(function (done) {
       (new User(user)).put(function(err) {
        if (err) {
          console.log(err);
          done(err);
        } else {
          transfer = new Transfer(transferAdd);
          //console.log(transfer);
          transfer.put(done);
        }
       });
      });
      after(function (done) {
        db.del((new User(user)).getKey(), function(err) {
          if (err) {
            return done(err);
          }
          return db.del(transfer.getKey(), done);
        });
      });
      it('should get a transfer object by id', function (done) {
        client.get('/user/'+user.email+'/transfers', function (err, req, res, obj) {
          if (obj.error) {
            return done(obj.error);
          }
          expect(Array.isArray(obj.response)).to.equal(true);
          return done();
        });
      })
    })
    describe('POST /user/:id/transfer', function () {
      beforeEach(function (done) {
       (new User(user)).put(done);
      });
      afterEach(function (done) {
        db.del((new User(user)).getKey(), done);
      });
      it('should post a transfer object to a users list of transfers', function (done) {
        client.post('/user/'+user.email+'/transfer', transferAdd, function (err, req, res, obj) {
          // console.log(err, obj);
          client.get('/user/'+user.email+'/transfers', function (err, req, res, obj) {
            if (obj.error) {
              return done(obj.error);
            }
            // console.log(obj.response);
            client.get('/user/'+user.email, function (err, req, res, obj) {
              // console.log(err, obj);
              expect(obj.response).to.have.property('points').and.to.equal(20);
              done();
            });
          });
        })
      });
      it('should fail for out of bounds', function (done) {
        client.post('/user/'+user.email+'/transfer', transferDeduct, function (err, req, res, obj) {
          expect(obj.message).to.equal('Illegal Transfer: Operation would bring points below minimum.')
          done();
        })
      });
      it('should post a transfer object to a users list of transfers', function (done) {
        client.post('/user/'+user.email+'/transfer', transferUnsupported, function (err, req, res, obj) {
          expect(obj.message).to.equal('Unsupported Operation: divide');
          done();
        })
      });
    })
  })
})