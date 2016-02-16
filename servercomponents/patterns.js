/*

GET /api/patterns
Get the led color patterns
returns [{ledn:0,color:"#hexcolor",time:0,index:0},...]

POST /api/patterns
Write color pattern sequences
param [{ledn:0, time:0, color:"#hexcolor", index:0},...]
where ledn 0 means both leds, ledn 1 is led A, ledn 2 is led B
time is in milliseconds
index is pattern line [0-31]
returns ack

*/
var tools = new (require('./tools.js'))();

function Patterns(blink)
{
	this.blink = blink;
	this.href = "/api/patterns";
};



Patterns.prototype.get = function(request,response,device){
	var count = 32;
	var patterns = [];
	var callback = function(data,i){
		var pattern = {
			ledn: data.ledn,
			color: tools.toColor(data.r,data.g,data.b),
			time: data.fadeMillis,
			index: i
		};
		patterns.push(pattern);
		count--;
		if( count === 0 )
		{
			response.writeHead(200);
			response.write( JSON.stringify( patterns ) );
			response.end();
			return;
		}
	};
	var blnk = this.blink(device);
	for( var i = 0; i<=31; i++ )
		blnk.readPatternLine( {lineIndex:i, callback:function(c){callback(c,i);}} );
};

Patterns.prototype.post = function( patterns, response,device ){
	
	if( ! patterns.length )
		return;

	// first make sure led isnt playing
	var blnk = this.blink(device);
	blnk.pause();
	
	for( var i=0; i<patterns.length; i++ )
	{
		var index = parseInt(patterns[i].index || 0, 10);
		var ledn  = parseInt(patterns[i].ledn || 0, 10);
		var time  = parseInt(patterns[i].time || 0, 10);
		var hexcolor = patterns[i].color || "#000000";
		//check hexcolor valid data
		tools.log( "writePatternLine {time: "+time+", ledn: "+ledn+", color: "+hexcolor+", index: "+index+"}" );
		var r = parseInt(hexcolor.substr(1,2),16);
		var g = parseInt(hexcolor.substr(3,2),16);
		var b = parseInt(hexcolor.substr(5,2),16);

		blnk.setLed( {ledn:ledn} );
		blnk.writePatternLine({speed:time,r:r,g:g,b:b,lineIndex:index});
	}
	response.writeHead(200);
	response.write( "" + patterns.length + "patterns written");
	response.end();
};


module.exports = Patterns;
