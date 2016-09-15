var chai = require('chai');
var Control = require('../../servercomponents/control');
var expect = chai.expect;
var sinon = require('sinon');


var blinkmock = {
	writePatternLine:function(){},
	playLoop:function(){},
	readRGB:function(){},
	setLed:function(){}
};
var resp = {
	writeHead:function(){},
	write:function(){},
	end:function(){}
};


describe('control',function(){
	var sandbox;
	beforeEach(function () {
		sandbox = sinon.sandbox.create();
		writePatternLine = sandbox.stub(blinkmock,'writePatternLine');
		readRGB = sandbox.stub(blinkmock,'readRGB').yieldsTo('callback',{r:0,g:0,b:0});
		setLed = sandbox.stub(blinkmock,'setLed');
		playLoop = sandbox.stub(blinkmock,'playLoop');
		writeHead = sandbox.stub(resp,'writeHead');
		write = sandbox.stub(resp,'write');
		end = sandbox.stub(resp,'end');
	});
	afterEach(function () {
		sandbox.restore();
	});
	
	var control = new Control(function(){return blinkmock});

	var writePatternLine;
	var readRGB;
	var setLed;
	var playLoop;
	var writeHead;
	var write; 
	var end;
	
	it('can call playLoop',function(){
		control.play({start:20,end:22,count:3},resp,{});
		expect(playLoop.withArgs({play:1,start:20,end:22,count:3}).calledOnce).to.be.true;
		expect(writeHead.withArgs(200).calledOnce).to.be.true;
	});
	
	it('can call togl',function(){
		control.togl({speed:1000},resp,{});
		expect(playLoop.callCount).to.eql(1);
		expect(writePatternLine.callCount).to.eql(4);
		expect(setLed.callCount).to.eql(4);
		expect(writeHead.withArgs(200).calledOnce).to.be.true;
		expect(end.calledOnce).to.be.true;
		expect(playLoop.withArgs({play:1,start:28,end:31}).calledOnce).to.be.true;
	});
});

