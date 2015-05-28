var hexconvert = function(num){
	var res = num.toString(16);
	if( num <= 0xf )
		return "0"+res;
	return res;
};

	function Pattern(source,track){
		if( !source )
			source ={};
		this.r = ko.observable(0);
		this.g = ko.observable(0);
		this.b = ko.observable(0);
		this.setColors( source.color || "#000000" );
		this.ledn = ko.observable(source.ledn || 0);
		this.time = ko.observable(source.time || 0);
		this.index = ko.observable(source.index || 0);
		this.selected = ko.observable(false);
		var that = this;
		if(track)
			this.selected.subscribe(function(value){track(value,that.index());});
		this.color = ko.computed(function(){
			return "#"+hexconvert(this.r())
			+hexconvert(this.g())
			+hexconvert(this.b());
		},this);
	};
	
	Pattern.prototype.reset = function(){
		this.setFrom({color:"#000000",ledn:0,time:0});
	};
	
	Pattern.prototype.setFrom=function(source){
		this.setColors(source.color);
		this.ledn(source.ledn);
		this.time(source.time);
	}
	
	Pattern.prototype.grabColorFromPicker=function(){
		this.setColors(picker.latestColor);
	};
	
	Pattern.prototype.setColors = function(color){
		this.r(parseInt(color.substr(1,2),16));
		this.g(parseInt(color.substr(3,2),16));
		this.b(parseInt(color.substr(5,2),16));
	};
	
	Pattern.prototype.paste=function(){
		pastestore.paste(this.index());
	};
	
	Pattern.prototype.toObject = function(){
		return {
			color: this.color(),
			ledn: parseInt(this.ledn(), 10),
			time: this.time(),
			index: this.index()
		};
	};
