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

Control.prototype.play = function( p, response, device ){
	
	var start = parseInt( p.start || 0, 10 );
	var end =  parseInt( p.end || 0, 10 );
	var count = parseInt( p.count || 0, 10 );

	if( start > end )
		start = end;

	tools.log( "playLoop("+start+", "+end+", "+count+")" );
	this.blink(device).playLoop({play: 1, start:start, end:end, count:count});

	response.writeHead(200);
	response.write( "playing" );
	response.end();
};

Control.prototype.togl = function( p, response,device ){

	var time = p.speed || 2000;
	var blnk = this.blink(device);

	tools.log( "togl with speed "+time );

	blnk.readRGB( {ledn:1, callback:function(l1){
		blnk.readRGB( {ledn:2, callback:function(l2){
			var fade = {from: l1, to: l2};
			var patterns = tools.makePattern(fade,fade,1,time);
			for( var i = 0; i<patterns.length; i++ )
			{
				blnk.setLed({ledn:patterns[i].led});
				blnk.writePatternLine( patterns[i] );
			}
			
			var patternEnd = 32;
			blnk.playLoop({play: 1, start:patternEnd - patterns.length, end: patternEnd-1});
			response.writeHead(200);
			response.write( "togl mode activated" );
			response.end();
		}});
	}});
};

Control.prototype.getColorByMode = function( mode, callback ){
	var b1 = this.blink(0);
	var b2 = this.blink(1);
	b1.readRGB( {ledn:1, callback:function(l11){
	b1.readRGB( {ledn:2, callback:function(l12){
	b2.readRGB( {ledn:1, callback:function(l21){
	b2.readRGB( {ledn:2, callback:function(l22){
		if( mode === 1 )
			callback([l11,l21,l12,l22]);
		else if( mode === 2 )
			callback([l11,l22,l12,l21]);
		else
			callback([l11,l12,l21,l22]);
	}});}});}});}});
	
};

Control.prototype.slowTogl = function( p, response,device ){
	var speed = p.speed || 5000;
	var blnk = this.blink(device);
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

Control.prototype.advTogl = function( p, response, device ){
	var b1 = this.blink(0);
	var b2 = this.blink(1);
	var speed = p.speed || 2000;
	var mode = p.mode || 0;
	tools.log( "advtogl with speed "+speed );
	this.getColorByMode( mode, function(col){
		var segments = 8;
		var patterns_a = tools.makePattern(
			{from: col[0], to: col[2] },
			{from: col[1], to: col[3] },
			8,
			Math.round(speed/2)
		);
		var patterns_b = tools.makePattern(
			{from: col[2], to: col[0] },
			{from: col[3], to: col[1] },
			8,
			Math.round(speed/2)
		);
		
		var stayspeed = Math.round(speed/4)
		for( var i = 0; i<patterns_a.length; i++ )
		{
			if( i == 0 || i == (patterns_a.length/2-1) )
				patterns_a[i].fadeMillis = stayspeed;
			tools.log( "Device 0: writePatternLine {time: " + patterns_a[i].fadeMillis
				+", ledn: "+patterns_a[i].led
				+", color: "+tools.toColor(patterns_a[i].r,patterns_a[i].g,patterns_a[i].b)
				+", index: "+patterns_a[i].lineIndex+"}" );
			b1.setLed({ledn:patterns_a[i].led});
			b1.writePatternLine( patterns_a[i] );
		}
		for( var i = 0; i<patterns_b.length; i++ )
		{
			if( i == 0 || i == (patterns_b.length/2-1) )
				patterns_b[i].fadeMillis = stayspeed;
			tools.log( "Device 1: writePatternLine {time: "+patterns_b[i].fadeMillis
				+", ledn: "+patterns_b[i].led
				+", color: "+tools.toColor(patterns_b[i].r,patterns_b[i].g,patterns_b[i].b)
				+", index: "+patterns_b[i].lineIndex+"}" );
			b2.setLed({ledn:patterns_b[i].led});
			b2.writePatternLine( patterns_b[i] );
		}
		var patternEnd = 32;
		b1.playLoop({play: 1, start:patternEnd - patterns_a.length, end: patternEnd-1});
		b2.playLoop({play: 1, start:patternEnd - patterns_b.length, end: patternEnd-1});
		response.writeHead(200);
		response.write( "togl mode activated" );
		response.end();
	});
};

Control.prototype.persist = function( p, response, device){
	tools.log("persist");
	this.blink(device).persistPatternLine();
	response.writeHead(200);
	response.write( "persisted" );
	response.end();
};


Control.prototype.pause = function( p, response,device ){

	tools.log( "pause" );
	this.blink(device).pause();

	response.writeHead(200);
	response.write( "paused" );
	response.end();
};


module.exports = Control;
