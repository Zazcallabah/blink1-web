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
	
	var start = p.start || 0;
	var end = p.end || 0;
	var count = p.count || 0;

	if( start > end )
		start = end;
		
	this.blink.playLoop(start, end, count);

	response.writeHead(200);
	response.write( "playing" );
	response.end();
};

Control.prototype.togl = function( p, response ){

	var speed = p.speed || 500;
	var blnk = this.blink;
	
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

Control.prototype.pause = function( p, response ){

	this.blink.pause();

	response.writeHead(200);
	response.write( "paused" );
	response.end();
};


module.exports = Control;
