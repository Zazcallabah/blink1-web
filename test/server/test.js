var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../server');
var should = chai.should();

chai.use(chaiHttp);


describe('server', function() {
  it('should return', function(done) {
  chai.request(server)
    .get('/status')
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });
});
});