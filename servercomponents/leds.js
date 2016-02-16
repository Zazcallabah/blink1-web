/*

GET /api/leds
Get the current led colors
returns {ledA:"#hexcolor",ledB:"#hexcolor"}

POST /api/leds
Set the led colors
param {ledn:0, time:0, color:"#hexcolor"}
where ledn 0 means both leds, ledn 1 is led A, ledn 2 is led B
time is in milliseconds
returns ack

*/
var tools = new (require('./tools.js'))();

function Leds(blink)
{
	this.blink = blink;
	this.href = "/api/leds";
};


Leds.prototype.get = function(request,response){
	var blnk = this.blink(request.device);
	var writeResponse = function(c1, c2){
		var l1 = tools.toColor( c1.r, c1.g, c1.b );
		var l2 = tools.toColor( c2.r, c2.g, c2.b );
	
		response.writeHead(200);
		response.write( JSON.stringify( {ledA:l1,ledB:l2} ) );
		response.end();	
	};
	blnk.readRGB({ ledn: 1, callback: function(c1){
		blnk.readRGB({ ledn: 2,	callback: function(c2){
			writeResponse(c1,c2);
		}});
	}});
};

Leds.prototype.post = function(instruction, response){
	var ledn = instruction.ledn || 0;
	var time = instruction.time || 0;
	var hexcolor = instruction.color || "#000000";
	//check hexcolor valid data
	var r = parseInt(hexcolor.substr(1,2),16);
	var g = parseInt(hexcolor.substr(3,2),16);
	var b = parseInt(hexcolor.substr(5,2),16);
	
	this.blink(request.device).fadeRGB( {fadeMillis:time,r: r,g: g,b: b, ledn:ledn, callback:function(opt){
		var raw = tools.toColor( Math.round(opt.r), Math.round(opt.g), Math.round(opt.b) );
		tools.log( "fadeToRGB {time: "+time+", ledn: "+ledn+", color: "+hexcolor+", raw: "+raw+"}" );
		response.writeHead(200);
		response.write( "set led "+ledn+" to "+hexcolor+ " (raw: "+ raw +") over "+time+"ms" );
		response.end();
	}});

};


module.exports = Leds;
