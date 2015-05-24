
var port = 19333;
var http = require("http"),
    url = require("url"),
    fs = require("fs"),
	sys = require('sys'),
	Blink1 = require('node-blink1'),
	Leds = require('./leds.js'),
	Patterns = require('./patterns.js');

var blink = new Blink1();
var leds = new Leds(blink);
var patterns = new Patterns(blink);

var hexconvert = function(num){
	var res = num.toString(16);
	if( num <= 0xf )
		return "0"+res;
	return res;
};

var splitVerb = function(request,response,controller) {
	if( request.method === 'GET' ) {
		controller.get(response);
	}
	else if( request.method === 'POST' ) {
		var queryData = "";
		request.on('data', function(data) {
			queryData += data;
			if(queryData.length > 1e4) {
				queryData = "";
				response.writeHead(413, {'Content-Type': 'text/plain'}).end();
				request.connection.destroy();
			}
		});

		request.on('end', function() {
			var postData = JSON.parse( queryData );
			controller.post(postData,response);
		});
	}
};



/*
* GET /api/status
* 
* returns { playing: [0/1], start:[0-31], end:[0-31], count: 0, position: 0-31 }
*/
var getStatus = function(req,response){
	blink.readPlayState(function(s){
		response.writeHead(200);
		response.write( JSON.stringify( {
			playing: s.playing,
			start: s.playstart,
			end: s.playend,
			count: s.playcount,
			position: s.playpos
		} ) );
		response.end();
	});
};

/*
* GET /api/version
* 
* returns {version:"versionstring"}
*/
var getVersion = function(req,response){
	blink.version(function(v){
		response.writeHead(200);
		response.write( JSON.stringify( {version:v} ) );
		response.end();
	});
};

var apiCallMap = {
	"/api/leds": function(req,resp){ splitVerb(req,resp,leds); }, 
	"/api/status": getStatus,
	"/api/version": getVersion,
	"/api/patterns": function(req,resp){ splitVerb(req,resp,patterns); }
};
/*
playloop from,to,playcount
stoploop
read color line
set color line
save to flash

serverdown tickle?
*/

var requesthandler = function( request, response ) {

	var pathname = url.parse( request.url ).pathname;
	
	if( pathname.length >= 4 && pathname.substr(0,4) === "/api" )
	{
		if( typeof (apiCallMap[pathname]) === 'function' )
		{
			apiCallMap[pathname](request,response);
		}
		else
		{
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("no endpoint available for path " + pathname );
			response.end();
		}
	}
	else if( pathname === "/index.html" || pathname === "/" || pathname === "" ) {
		fs.readFile("./index.html", "binary", function(err, file) {
			if(err) {        
				console.log("500: "+pathname);
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(err + "\n");
				response.end();
				return;
			}
			console.log("200: "+pathname);
			response.writeHead(200);
			response.write(file, "binary");
			response.end();
		});		
	}
	else if( pathname === "/colorpicker.js" || pathname === "/raphael.js" ) {
		fs.readFile("."+pathname, "binary", function(err, file) {
			if(err) {        
				console.log("500: "+pathname);
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(err + "\n");
				response.end();
				return;
			}
			console.log("200: "+pathname);
			response.writeHead(200);
			response.write(file, "binary");
			response.end();
		});		
	}
	else
	{
		response.writeHead(404)
		response.end();
	}
};

http.createServer( requesthandler ).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
