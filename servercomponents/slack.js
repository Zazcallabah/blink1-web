/*

POST /api/slack
returns ack

*/
var tools = new (require('./tools.js'))();

function Slack(blink)
{
	this.blink = blink;
};

function Params( str ){
	function makeParam(d){
		var decoded = decodeURIComponent(d);
		var pivot = decoded.indexOf("=");
		if( pivot == -1 )
			return {name:decoded,value:undefined};
		var name = decoded.substring(0,pivot);
		var value = decoded.substring(pivot+1,decoded.length);
		return {name:name,value:value};
	};
	this.data = str.split("&").map( makeParam );
};
Params.prototype.get = function( name ){
	var found = this.data.filter( function(d){ return d.name === name } );
	if( found.length === 0 )
		return undefined;
	return found[0].value;
};

Slack.prototype.post = function( m, response, device ){
	var writeOkResponse = function( msg ){
		response.writeHead(200, {"Content-Type": "application/json"});
		response.write( JSON.stringify({
			response_type: "in_channel",
			text: msg
		}));
		response.end();
	};
	var findColor = function(msg){
		var isHex = /#[A-F0-9]{6}/ig;
		var hexcolor = isHex.exec( msg );
		if( hexcolor == null || hexcolor.length == 0 )
			return {
				r: Math.floor(Math.random()*256),
				g: Math.floor(Math.random()*256),
				b: Math.floor(Math.random()*256)
			};
		return {
			r: parseInt(hexcolor[0].substr(1,2),16),
			g: parseInt(hexcolor[0].substr(3,2),16),
			b: parseInt(hexcolor[0].substr(5,2),16)
		}
	}
	if( !m ){
		response.writeHead(400);
		response.end();
		return;
	}
	var params = new Params(m);
	var token = params.get( "token" );
	var user = params.get("user_name");
	var text = params.get("text");
	
	if(!text.toLowerCase().includes( "please" ) )
	{
		writeOkResponse( user+", you get nothing!" );
		return;
	}
	
	var color = findColor( text );
	var hexcolor = tools.toColor( color.r, color.g, color.b );
	
	this.blink(device).fadeRGB( {
		fadeMillis:200,
		r: color.r,
		g: color.g,
		b: color.b,
		ledn: device,
		callback: function(opt) {
			console.log("slack set led to "+hexcolor);
			writeOkResponse( user+", you get "+hexcolor );
		}
	});
};


module.exports = Slack;
