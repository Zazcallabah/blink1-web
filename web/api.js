
	function Api(){};
	
	Api.prototype.webreq = function (verb,href,callback,postdata) {
		var xmlhttp = new XMLHttpRequest();
		if( callback ) {
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == XMLHttpRequest.DONE )
					callback( xmlhttp.responseText );
			}
		}
		xmlhttp.open(verb, href, true);
		
		xmlhttp.send( postdata ? JSON.stringify(postdata) : "" );
	}
		// callback param: {ledA:"#000000",ledB:"#000000"}
	Api.prototype.getCurrentColor = function(callback,device) {
		this.webreq(
			"GET",
			"/api/leds/" + (device||0),
			function(r){ callback(JSON.parse(r)); }
		);
	};

	Api.prototype.getVersion = function(callback,device) {
		this.webreq(
			"GET",
			"/api/version/" + (device||0),
			function(r){ callback(JSON.parse(r)); }
		);
	};
	
	Api.prototype.getStatus = function(callback,device) {
		this.webreq(
			"GET",
			"/api/status/" + (device||0),
			function(r){ callback(JSON.parse(r)); }
		);
	};
	
	// ledn = {0,1,2}, time in ms, color is hexcolor
	Api.prototype.fadeToColor = function(ledn,time,color,device) {
		this.webreq(
			"POST",
			"/api/leds/" + (device||0),
			undefined,
			{ledn: ledn, time: time, color: color}
		);
	};
	
	Api.prototype.readPatterns = function( callback,device ) {
		this.webreq(
			"GET",
			"/api/patterns/" + (device||0),
			function(r){callback(JSON.parse(r));}
		);
	};
	Api.prototype.savePatterns = function( data, callback, device ) {
		this.webreq(
			"POST",
			"/api/patterns/" + (device||0),
			callback,
			data
		);
	};
	
	Api.prototype.setGammaValue = function( val, device ){
		this.webreq(
			"POST",
			"/api/gamma/" + (device||0),
			undefined,
			{ gamma: val || 0 }
		);
	};
	
	Api.prototype.getGammaValue = function( val,device ){
		this.webreq(
			"GET",
			"/api/gamma/" + (device||0),
			function(r){ callback(JSON.parse(r)); }
		);
	};
	
	Api.prototype.play = function(count,start,end,device){
		this.webreq(
			"POST",
			"/api/control/play/" + (device||0),
			undefined,
			{
				count: count || 0,
				start: start || 0,
				end:     end || 0
			});
		};
	Api.prototype.pause = function(device){
		this.webreq(
			"POST",
			"/api/control/pause/" + (device||0),
			undefined
		);
	};
	
	Api.prototype.persist = function(device){
		this.webreq(
			"POST",
			"/api/control/persist/" + (device||0),
			undefined
		);
	};
	
	Api.prototype.togl = function(ms,device) {
		this.webreq(
			"POST",
			"/api/control/togl/" + (device||0),
			undefined,
			{speed:parseInt(ms,10)}
		);
	};
	Api.prototype.fade = function(ms,device) {
		this.webreq(
			"POST",
			"/api/control/slowtogl/" + (device||0),
			undefined,
			{speed:parseInt(ms,10)}
		);
	};
	
	Api.prototype.trans = function(ms) {
		 this.webreq(
			 "POST",
			 "/api/control/advtogl/0",
			 undefined,
			 {speed:parseInt(ms,10)}
		 );
	};
	function Pick( id, onchange )
	{
		var that = this;
		this.colorPicker = Raphael.colorpicker( document.getElementById(id) );
		var buffering = false;
		this.latestColor = "#FFFFFF";
		var send = function() {
			if( onchange )
				onchange( that.latestColor );
			buffering = false;
		};
		this.colorPicker.onchange = function (clr) {
			that.latestColor = clr;
			if( !buffering ) {
				buffering = true;
				// don't spam a web request for each event.
				// instead we buffer for 100 ms and then send the latest value
				window.setTimeout(send, 100);
			}
		};
	}