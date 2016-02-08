/*

POST /api/control/play
play patterns
param {start:0, end:0, count:0}
where start is pattern line index [0-31]
end is pattern line index [0-31]
count is number of loops [0-255] - 0 means loop indefinitely
returns ack

POST /api/control/pause
halt play
returns ack

POST /api/control/togl
use current colors to create a pattern at index 28-31 and play that pattern
param {speed:500}
returns ack

*/
var tools = new (require('./tools.js'))();

function Control(blink)
{
	this.blink = blink;
};

Control.prototype.play = function( p, response ){
	
	var start = parseInt( p.start || 0, 10 );
	var end =  parseInt( p.end || 0, 10 );
	var count = parseInt( p.count || 0, 10 );

	if( start > end )
		start = end;

	tools.log( "playLoop("+start+", "+end+", "+count+")" );
	this.blink().playLoop({play: 1, start:start, end:end, count:count});

	response.writeHead(200);
	response.write( "playing" );
	response.end();
};

Control.prototype.togl = function( p, response ){

	var speed = p.speed || 500;
	var blnk = this.blink();

	tools.log( "togl with speed "+speed );

	blnk.readRGB( {ledn:1, callback:function(l1){
		blnk.readRGB( {ledn:2, callback:function(l2){
			blnk.setLed({ledn:2});
			blnk.writePatternLine(  {fadeMillis:speed, r:l1.r, g:l1.g, b:l1.b, lineIndex: 28} );
			blnk.setLed({ledn:1});
			blnk.writePatternLine(  {fadeMillis:speed, r:l2.r, g:l2.g, b:l2.b, lineIndex:29} );
			blnk.setLed({ledn:2});
			blnk.writePatternLine(  {fadeMillis:speed, r:l2.r, g:l2.g, b:l2.b, lineIndex: 30} );
			blnk.setLed({ledn:1});
			blnk.writePatternLine( {fadeMillis:speed, r:l1.r, g:l1.g, b:l1.b, lineIndex: 31} );
			
			blnk.playLoop({play: 1, start:28, end:31});
			response.writeHead(200);
			response.write( "togl mode activated" );
			response.end();
		}});
	}});
};

Control.prototype.slowTogl = function( p, response ){
	var speed = p.speed || 5000;
	var blnk = this.blink();
	tools.log( "slowtogl with speed "+speed );
	blnk.readRGB( {ledn:1, callback:function(l1){
		blnk.readRGB( {ledn:2, callback:function(l2){
			blnk.fadeRGB({fadeMillis:speed, r:l2.r, g:l2.g, b:l2.b, ledn:1} );
			blnk.fadeRGB({fadeMillis:speed, r:l1.r, g:l1.g, b:l1.b, ledn:2} );
			response.writeHead(200);
			response.write( "togl mode activated" );
			response.end();
		}});
	}});
};

Control.prototype.pause = function( p, response ){

	tools.log( "pause" );
	this.blink().pause();

	response.writeHead(200);
	response.write( "paused" );
	response.end();
};


module.exports = Control;
