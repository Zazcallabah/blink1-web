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

	console.log( "playLoop("+start+", "+end+", "+count+")" );
	this.blink.playLoop(start, end, count);

	response.writeHead(200);
	response.write( "playing" );
	response.end();
};

Control.prototype.togl = function( p, response ){

	var speed = p.speed || 500;
	var blnk = this.blink;

	console.log( "togl with speed "+speed );

	blnk.readCurrentColor( 1, function(l1){
		blnk.readCurrentColor( 2, function(l2){
			blnk.setLed(2);
			blnk.writePatternLine( speed, l1.r, l1.g, l1.b, 28, true );
			blnk.setLed(1);
			blnk.writePatternLine( speed, l2.r, l2.g, l2.b, 29, true );
			blnk.setLed(2);
			blnk.writePatternLine( speed, l2.r, l2.g, l2.b, 30, true );
			blnk.setLed(1);
			blnk.writePatternLine( speed, l1.r, l1.g, l1.b, 31, true );
			
			blnk.playLoop(28,31,0);
			response.writeHead(200);
			response.write( "togl mode activated" );
			response.end();
		});
	});
};

Control.prototype.slowTogl = function( p, response ){
	var speed = p.speed || 5000;
	var blnk = this.blink;
	console.log( "slowtogl with speed "+speed );
	blnk.readCurrentColor( 1, function(l1){
		blnk.readCurrentColor( 2, function(l2){
			blnk.fadeToRGB(speed, l2.r, l2.g, l2.b, 1, true );
			blnk.fadeToRGB(speed, l1.r, l1.g, l1.b, 2, true );
			response.writeHead(200);
			response.write( "togl mode activated" );
			response.end();
		});
	});
};

Control.prototype.pause = function( p, response ){

	console.log( "pause" );
	this.blink.pause();

	response.writeHead(200);
	response.write( "paused" );
	response.end();
};


module.exports = Control;
