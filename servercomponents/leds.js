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

function Leds(blink)
{
	this.blink = blink;
	this.href = "/api/leds";
};

function hexconvert(num){
	var res = num.toString(16);
	if( num <= 0xf )
		return "0"+res;
	return res;
};

Leds.prototype.get = function(response){
	var blnk = this.blink();
	var writeResponse = function(c1, c2){
		var l1 = "#" + 
			hexconvert(c1.r) + 
			hexconvert(c1.g) + 
			hexconvert(c1.b);
		var l2 = "#" + 
			hexconvert(c2.r) + 
			hexconvert(c2.g) + 
			hexconvert(c2.b);
	
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
	
	console.log( "fadeToRGB {time: "+time+", ledn: "+ledn+", color: "+hexcolor+"}" );
	this.blink().fadeRGB( {fadeMillis:time,r: r,g: g,b: b, ledn:ledn});

	response.writeHead(200);
	response.write( "set led "+ledn+" to "+hexcolor+ " over "+time+"ms" );
	response.end();
};


module.exports = Leds;
