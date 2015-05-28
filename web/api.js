
	function webreq(verb,href,callback,postdata) {
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
	
	function Api(){};
		// callback param: {ledA:"#000000",ledB:"#000000"}
	Api.prototype.getCurrentColor = function(callback) {
		webreq(
			"GET",
			"/api/leds",
			function(r){ callback(JSON.parse(r)); }
		);
	};
	
	// ledn = {0,1,2}, time in ms, color is hexcolor
	Api.prototype.fadeToColor = function(ledn,time,color) {
		webreq(
			"POST",
			"/api/leds",
			undefined,
			{ledn: ledn, time: time, color: color}
		);
	};
	
	Api.prototype.readPatterns = function( callback ) {
		webreq(
			"GET",
			"/api/patterns",
			function(r){callback(JSON.parse(r));}
		);
	};
	Api.prototype.savePatterns = function( data ) {
		webreq(
			"POST",
			"/api/patterns",
			undefined,
			data
		);
	};
	
	Api.prototype.play = function(count){
		webreq(
			"POST",
			"/api/control/play",
			undefined,
			{count:count||0}
			);
	};
	Api.prototype.pause = function(){
		webreq(
			"POST",
			"/api/control/pause"
			);
	};
	
	Api.prototype.togl = function() {
		webreq(
			"POST",
			"/api/control/togl"
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