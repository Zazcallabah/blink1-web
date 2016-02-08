/*

GET /api/gamma
Get the current gamma value
returns {gamma:2.2}

POST /api/gamma
Set the new gamma value
param {gamma:0}

in both cases, gamma=0 means no gamma correction

*/

function Gamma(blink)
{
	this.blink = blink;
	this.href = "/api/gamma";
};

Gamma.prototype.get = function(response){
	var blnk = this.blink();
	blnk.getgamma({ callback: function(opt){
		response.writeHead(200);
		response.write( JSON.stringify( opt ) );
		response.end();	
	}});
};

Gamma.prototype.post = function(instruction, response){
	var gamma = instruction.gamma || 0;
	console.log( "set gamma to "+gamma );
	this.blink().setgamma( {gamma:gamma} );

	response.writeHead(200);
	response.write( "set gamma to "+gamma );
	response.end();
};


module.exports = Gamma;