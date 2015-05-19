// web server paste
var port = 19333;
var http = require("http"),
    url = require("url"),
    fs = require("fs");
var sys = require('sys');
var exec = require('child_process').exec;
var requesthandler = function( request, response ) {

	var pathname = url.parse( request.url ).pathname;

	if(pathname === "/api" && request.method == 'POST')
	{
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
		console.log(queryData);
				var accept = /^[a-zA-Z0-9,\-=#" ]+$/
				if( queryData.match(accept))
				{

					exec("blink1-tool "+queryData, function(er,out,err){
					console.log(out);
						if( er )
						{
							response.writeHead(500);
							response.write( er + "\n");
						}
						else
							response.writeHead(200);
						response.write( out+ "\n" );
						response.write( err + "\n");
						response.end();
					});
				}
		return;
		});

    
	}
	else if( pathname === "/index.html" || pathname === "/" || pathname === "" ) {
			fs.readFile("/home/pi/node/index.html", "binary", function(err, file) {
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
			fs.readFile("/home/pi/node"+pathname, "binary", function(err, file) {
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
