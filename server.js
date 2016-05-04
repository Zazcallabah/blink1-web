
var port = 19333;
var http = require("http"),
	url = require("url"),
	fs = require("fs"),
	Blink1 = require('node-blink1'),
	Tools = require('./servercomponents/tools.js'),
	Leds = require('./servercomponents/leds.js'),
	Patterns = require('./servercomponents/patterns.js'),
	Control = require('./servercomponents/control.js'),
	Gamma = require('./servercomponents/gamma.js');

var _blink = [];
var blink = function(index){
	var ix = parseInt(index,10)||0;
	if( _blink.length == 0 || ix >= _blink.length )
	{
		_blink.forEach( function(d){ d.close(); });
		Blink1.devices().forEach( function(d){ _blink.push(new Blink1(d)) } );
	}
	return _blink[ix];
}

var leds = new Leds(blink);
var patterns = new Patterns(blink);
var control = new Control(blink);
var gamma = new Gamma(blink);
var tools = new Tools();

var parseRequest = function(request, callback){
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
		try
		{
			if( queryData === "" )
				callback( true );
			else
				callback( JSON.parse( queryData ) );
		} catch( e )
		{
			try{
				_blink.forEach( function(b){b.close()} );
			}catch(e){}
			_blink=[];
			tools.log(e);
			tools.log(e.stack);
			callback();
		}
	});
};

var splitVerb = function(request,response,dev,controller) {
	if( request.method === 'GET' ) {
		controller.get(request,response,dev);
	}
	else if( request.method === 'POST' ) {
		parseRequest( request, function(data){
			if( data )
			{
				controller.post(data,response,dev);
			}
			else
			{
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.end();
			}
		});
	}
};

var controlAction = function( request, response, dev, action ) {
	if( request.method === 'POST' ) {
		parseRequest( request, function(p){
			if( p )
			{
				control[action](p,response,dev);
			}
			else
			{
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.end();
			}
		});
	}
};

/*
* GET /api/status
* 
* returns { playing: [0/1], start:[0-31], end:[0-31], count: 0, position: 0-31 }
*/
var getStatus = function(req,response,device){
	blink(device).readPlayState(function(s){
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
var getVersion = function(req,response,device){
	blink(device).version(function(v){
		response.writeHead(200);
		response.write( JSON.stringify( {version:v} ) );
		response.end();
	});
};

// missing api calls:
// serverdown
// persist to flash
// setcolor w/o fade
var apiCallMap = {
	"/api/leds": function(req,resp,dev){ splitVerb(req,resp,dev,leds); }, 
	"/api/gamma": function(req,resp,dev){ splitVerb(req,resp,dev,gamma); },
	"/api/status": getStatus,
	"/api/version": getVersion,
	"/api/patterns": function(req,resp,dev){ splitVerb(req,resp,dev,patterns); },
	"/api/control/togl": function(req,resp,dev) { controlAction( req,resp,dev,"togl"); },
	"/api/control/slowtogl": function(req,resp,dev) { controlAction( req,resp,dev,"slowTogl"); },
	"/api/control/play": function(req,resp,dev) { controlAction( req,resp,dev,"play"); },
	"/api/control/persist": function(req,resp,dev) { controlAction( req,resp,dev,"persist"); },
	"/api/control/pause": function(req,resp,dev) { controlAction( req,resp,dev,"pause"); },
};

var requesthandler = function( request, response ) {

	var pathname = url.parse( request.url ).pathname;
	
	if( pathname === '/' || pathname === '' )
		pathname = '/index.html';
	
	var approvedFiles = [
		'/raphael.js',
		'/knockout.js',
		'/colorpicker.js',
		'/Colour.js',
		'/colorpicker.html',
		'/bootstrap.min.css',
		'/api.js',
		'/index.html',
		'/patternsadv.html',
		'/patterns.html',
		'/presets.js',
		'/patterns.js',
		'/settings.html'
	];
	
	if( pathname.length >= 5 && pathname.substr(0,5) === "/api/" )
	{
		var lastslashindex = pathname.lastIndexOf("/");
		var lastsegment = pathname.substring(lastslashindex+1,pathname.length);
		var parsed = parseInt(lastsegment,10);
		if( !isNaN( parsed ) )
			pathname = pathname.substring(0,lastslashindex);
		if( typeof (apiCallMap[pathname]) === 'function' )
		{
			try
			{
				apiCallMap[pathname](request,response,parsed||0);
			}
			catch(e)
			{
				tools.log(e);
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write( e.toString() );
				response.end();
			}
		}
		else
		{
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("no endpoint available for path " + pathname );
			response.end();
		}
	}
	else if( approvedFiles.filter( function(f){ return f === pathname } ).length > 0 ) {

		fs.readFile(__dirname+'/web'+pathname, "binary", function(err, file) {
			if(err) {        
				tools.log("500: "+pathname);
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(err + "\n");
				response.end();
				return;
			}
			tools.log("200: "+pathname);
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
