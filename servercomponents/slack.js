/*

POST /api/slack
returns ack

*/
var tools = new (require('./tools.js'))();

function Slack(blink)
{
	this.blink = blink;
};

Slack.prototype.post = function( m, response, device ){
	
	/*if(
		m.token != "R1UCfh6S6rRQXbp4MKnNntFW" ||
		m.text == undefined ||
		!m.text.toLowerCase().includes( "please" )
		)
		{
			response.writeHead(200);
			response.write( "you get nothing" );
			response.end();
			return;
		}*/
	var r = Math.floor(Math.random()*256);
	var g = Math.floor(Math.random()*256);
	var b = Math.floor(Math.random()*256);
	
	
	var hexcolor = tools.toColor( r, g, b );
	
	this.blink(device).fadeRGB( {
		fadeMillis:200,
		r: r,
		g: g,
		b: b,
		ledn: device,
		callback: function(opt) {
			response.writeHead(200);
			response.write( JSON.stringify(
			{
				response_type: "in_channel",
				text: "you get "+hexcolor
			} ) );
			response.end();
		}
	});
};


module.exports = Slack;
