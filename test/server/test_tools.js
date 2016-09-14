var chai = require('chai');
var Tools = require('../../servercomponents/tools');
var expect = chai.expect;

describe('tools', function() {
	var tools =  new Tools();
	it('interleaves two arrays', function() {
		var result = tools.interleave([1,2,3],[10,20,30]);
		expect(result.length).to.equal(6);
		expect( result ).to.eql([1,10,2,20,3,30]);
	});
	it('can make size 1 fade array', function() {
		var result = tools.makeFadeArray(0, 10, 1);
		expect(result.length).to.equal(1);
		expect( result ).to.eql([10]);
	});
	it('creates fade array', function() {
		var result = tools.makeFadeArray(0, 10, 5);
		expect(result.length).to.equal(5);
		expect( result ).to.eql([2,4,6,8,10]);
	});
	it('creates fade array reverse', function() {
		var result = tools.makeFadeArray(10, 0, 5);
		expect(result.length).to.equal(5);
		expect( result ).to.eql([8,6,4,2,0]);
	});
	var c1 = {r:255,g:255,b:255};
	var c2 = {r:0,g:0,b:0};
	it('color fades correctly', function() {
		var result = tools.colorFade(c1,c2,2);
		expect(result.length).to.equal(2);
		expect( result ).to.eql([{r:128,g:128,b:128},c2]);
	});
	
	it('makes simplest pattern array for fade', function(){
		var colors = {from:c1,to:c2};
		var result = tools.makePattern(colors,colors,1,2000);
		expect(result.length).to.equal(4);
		expect(result[0]).to.eql( { fadeMillis:500, r:0, g:0, b:0, led:1, lineIndex: 28 } );
		expect(result[1]).to.eql( { fadeMillis:500, r:0, g:0, b:0, led:2, lineIndex: 29 } );
	expect(result[2]).to.eql( { fadeMillis:500, r:255, g:255, b:255, led:1, lineIndex: 30} );
		expect(result[3]).to.eql( { fadeMillis:500, r:255, g:255, b:255, led:2, lineIndex: 31} );
	});
});
