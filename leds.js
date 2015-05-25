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
	var that = this;
	that.blink.readCurrentColor( 1, function(c1){
		that.blink.readCurrentColor( 2, function(c2){
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
		});
	});
};

Leds.prototype.post = function(instruction, response){
	var ledn = instruction.ledn || 0;
	var time = instruction.time || 0;
	var hexcolor = instruction.color || "#000000";
	//check hexcolor valid data
	var r = parseInt(hexcolor.substr(1,2),16);
	var g = parseInt(hexcolor.substr(3,2),16);
	var b = parseInt(hexcolor.substr(5,2),16);
	
	this.blink.fadeToRGB( time, r, g, b, ledn, true );

	response.writeHead(200);
	response.write( "set led "+ledn+" to "+hexcolor+ " over "+time+"ms" );
	response.end();
};


module.exports = Leds;
