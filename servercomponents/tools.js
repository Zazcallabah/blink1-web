function Tools()
{
};

Tools.prototype.hexconvert = function(num){
	var res = num.toString(16);
	if( num <= 0xf )
		return "0"+res;
	return res;
};

Tools.prototype.getDateTime = function(){
	var date = new Date();
	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;
	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;
	var sec  = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;
	var day  = date.getDate();
	day = (day < 10 ? "0" : "") + day;
	return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec + " -> ";
};

Tools.prototype.log = function(m){
	console.log( this.getDateTime() + m );
};

Tools.prototype.toColor = function(r,g,b){
	 return "#" + 
		this.hexconvert(r) + 
		this.hexconvert(g) + 
		this.hexconvert(b);
};

Tools.prototype.makeFadeArray = function (source,target,segments){
	if( segments <= 0 )
		throw new Error("invalid number of segments");
	var seg = segments || 8;
	var diff = Math.abs( source-target );
	var step = diff / seg;
	var direction = source < target ? 1 : -1;
	
	var result = [];
	for( var i = 1; i<=segments; i++ )
	{
		var entry = source+(i * step * direction);
		result.push(Math.round(entry));
	}
	return result;
};

Tools.prototype.colorFade = function(sourceColor,targetColor,segments){
	var r = this.makeFadeArray(sourceColor.r,targetColor.r,segments);
	var g = this.makeFadeArray(sourceColor.g,targetColor.g,segments);
	var b = this.makeFadeArray(sourceColor.b,targetColor.b,segments);
	var result = [];
	for( var i = 0; i<r.length; i++ )
	{
		result.push({r:r[i],g:g[i],b:b[i]});
	}
	return result;
};

Tools.prototype.interleave = function( a, b ){
	if( a.length !== b.length )
		throw new Error( "arrays not equal size" );
	var result = [];
	for( var i = 0; i<a.length; i++ )
	{
		result.push(a[i]);
		result.push(b[i]);
	}
	return result;
};

Tools.prototype.makePattern = function( fade1, fade2, segments, time ){
	var speed = time / (segments*4);
	var led1 = function(data){
		data.led = 1;
		data.fadeMillis = speed;
		return data;
	};
	var led2 = function(data){
		data.led = 2;
		data.fadeMillis = speed;
		return data;
	};
	var cf1 = this.colorFade( fade1.from, fade1.to, segments ).map(led1);
	var cf2 = this.colorFade( fade2.from, fade2.to, segments ).map(led2);
	var cf3 = this.colorFade( fade1.to, fade1.from, segments ).map(led1);
	var cf4 = this.colorFade( fade2.to, fade2.from, segments ).map(led2);
	
	var up = this.interleave( cf1,cf2 );
	var down = this.interleave( cf3,cf4 );
	var endindex = 32;
	var startOn = endindex - (up.length+down.length);
	return up.concat(down).map( function(p){
		p.lineIndex = startOn++;
		return p;
	});
}

module.exports = Tools;
