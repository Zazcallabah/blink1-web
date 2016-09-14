describe('an api',function(){
	var api = new Api();
	beforeEach( function(){
		spyOn( api, "webreq" )
			.andCallFake( function(v,h,callback,p){
				callback(JSON.stringify({verb:v,href:h}));
			});
	});
	describe('leds',function(){
		it('can get color',function(){
			api.getCurrentColor( function(c){
				expect(c.verb).toEqual("GET");
				expect(c.href).toEqual("/api/leds/0");
			});
		});
	});
});
