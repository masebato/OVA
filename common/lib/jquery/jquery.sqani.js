/*
<sequence image animator>
#2012-09-26
#author : drumtj(sigongmedia KTJ)
#email : kimtj@sigongmedia.co.kr

//create
ani = $.sqani('1.png', {width:50, height:50, frame:10}, {id:'ani1'});
ani = $.sqani('1.png', {width:50, height:50, frame:10, cols:5}, {id:'ani1'});
ani = $.sqani('1.png', {width:50, height:50, frame:10, loop:true, framerate:60}, {id:'ani1'});

//control
ani._gotoAndPlay(4);
ani._gotoAndStop(4);
ani._play();
ani._stop();

//select
$.sqani("#ani1")
$.sqani("#ani1")._stop();
$.sqani("#ani1").isPlaying();
*/

(function($){
	$.sqani = function(path, option, arg){
		if(path.indexOf("#") > -1){
			var c = $.sqani.obj[path.replace("#","")];//$(document).data(path.replace("#",""));
			if(c) return c;
			else return {};
		}else return new $.sqani.init(path, option, arg);
	}
	
	$.sqani.obj = {};
	
	$.sqani.init = function(path, option, arg){
		arg = arg || {};
		
		this.option = {
			x:0,
			y:0,
			width:0,
			height:0,
			cols:0,
			frame:1,
			loop:false,
			stop:false,
			framerate:30
		}
		
		for(var o in option){
			this.option[o] = option[o];
		}
		
		if(this.option.cols == 0) this.option.cols = this.option.frame;
	
		
		var img = new Image();
		img.src = path;
		img.option = this.option;
		img.i = 0;
		img.id = arg.id;
		img.isPlaying = false;
		img.isFirstRun = true;
		img.isFirstStop = false;
		img.endCallback = null;
		img.run = function(){
			var fthis = this;
			if(this.isFirstStop && this.isFirstRun){
			}else if(this.isPlaying == false){
				this.isPlaying = true;
				this.interval = setInterval(function(){fthis.loop1();}, 1000/this.option.framerate);
			}
			if(this.isFirstRun) this.isFirstRun = false;
		};
		img.goto = function(frame){
			frame = Math.min(Math.max(frame,0), this.option.frame-1);
			$(this).css("left", (-this.option.width*(frame%this.option.cols))+'px');
			$(this).css("top", (-this.option.height*Math.floor(frame/this.option.cols))+'px');
		}
		img.loop1 = function(){
			//trace(this);
			//var _this = window["sqimg"+window.count];
			this.goto(this.i);
			
			if(this.i++ >= this.option.frame-1){
				if(this.option.loop){
					this.i = 0;
				}else{
					this.stop();
					this.i = 0;
					if(this.endCallback){
						this.endCallback();
						this.endCallback = null;
					}
				}
			}
		};
		img.stop = function(){
			this.isPlaying = false;
			clearInterval(this.interval);
		}
		$(img).css("position", "relative")
		.css("left", this.option.width+"px")
		.css("top", "0px");
		
		var contents = $('<div />', arg)
		.css("position", "absolute")
		.css("overflow", "hidden")
		.css("width", this.option.width+'px')
		.css("height", this.option.height+'px')
		.css("left", this.option.x+'px')
		.css("top", this.option.y+'px')
		.bind('contextmenu selectstart dragstart', function(){return false;})
		.css("cursor","auto")
		.append(img);
		
		if(!this.option.stop){
			if(img.complete){
				img.run();
			}else{
				img.onload = function(){this.run()};
			}
		}else{
			img.goto(0);
			img.isFirstRun = false;
		}
		var div = contents[0];
		contents._img = img;
		contents._gotoAndPlay = function(frame, callback){
			this._img.i = Math.max(0, Math.min(frame, this._img.option.frame));
			this._play();
			if(callback) this._img.endCallback = callback;
		};
		contents._gotoAndStop = function(frame){
			this._img.i = Math.max(0, Math.min(frame, this._img.option.frame));
			this._stop();
			this._img.goto(this._img.i);
		};
		contents._play = function(callback){
			this._stop();
			this._img.run();
			if(callback) this._img.endCallback = callback;
		};
		contents._stop = function(){
			if(this._img.isFirstRun) this._img.isFirstStop = true;
			this._img.stop();
		};
		contents.isPlaying = function(){
			return this._img.isPlaying;
		};
		//$(document).data(arg.id, contents);
		$.sqani.obj[arg.id] = contents;
		
		return contents;
	}
})(jQuery);
