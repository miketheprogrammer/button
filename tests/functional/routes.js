var restify       = require('restify');
var assert        = require('assert');
var expect        = require('chai').expect;
var db            = require('../../models/base')._db;
var through2      = require('through2');
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
    lastName: "Hernandez" 
  };
  var transferAdd = {
    operation: 'add',
    value: 20,
    userKey: user.email
  };
  describe('/user', function () {
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
  describe('/transfer', function () {
    describe('GET /transfer/:id', function () {
      var transfer;
      before(function (done) {
       (new User(user)).put(function(err) {
        if (err) {
          console.log(err);
          done(err);
        } else {
          transfer = new Transfer(transferAdd);
          console.log(transfer);
          transfer.put(done);
        }
       });
      });
      it('should get a transfer object by id', function (done) {
        client.get('/user/'+user.email+'/transfers', function (err, req, res, obj) {
          console.log(err, obj);
          done();
        });
      })
    })
  })
})