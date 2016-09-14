var chai = require('chai');
var Control = require('../../servercomponents/control');
var expect = chai.expect;
var sinon = require('sinon');


var blinkmock = {writePatternLine:function(){},playLoop:function(){}};
sinon.stub(blinkmock,'writePatternLine');
var playLoop = sinon.stub(blinkmock,'playLoop');
describe('control',function(){
	var control = new Control(function(){return blinkmock});
	var resp = {writeHead:function(){},write:function(){},end:function(){}};
	var writeHead = sinon.stub(resp,'writeHead');
	it('can call playLoop',function(){
		control.play({start:20,end:22,count:3},resp,{});
		expect(playLoop.withArgs({play:1,start:20,end:22,count:3}).calledOnce).to.be.true;
		expect(writeHead.withArgs(200).calledOnce).to.be.true;
	});
});