var restify       = require('restify');
var assert        = require('assert');
var expect        = require('chai').expect;
                    require('../../index').listen(3000);
// Creates a JSON client
var client = restify.createJsonClient({
  url: 'http://localhost:3000'
});

describe('/beep', function () {
  it('should', function (done) {
    client.get('/beep', function(err, req, res, obj) {
      expect(err).to.be.null;
      expect(obj).to.have.property('response').and.to.equal('boop');
      done();
    });
  })
})
