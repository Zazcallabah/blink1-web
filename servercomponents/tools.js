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


module.exports = Tools;
