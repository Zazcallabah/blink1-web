var chai = require('chai');
var chaiHttp = require('chai-http');
//var server = require('../../server');
var should = chai.should();
var sinon = require('sinon');
chai.use(chaiHttp);

Blink1 = function(){};
Blink1.prototype.devices = function(){return [{},{}]};


// describe('server', function() {
	// itt('should return', function(done) {
		// chai.request('http://localhost:19333')
			// .get('/api/version')
			// .end(function(err, res){
				// res.should.have.status(200);
				// done();
			// });
	// });
// });