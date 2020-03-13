/*
@auther : taejin kim
@make date : 2014. 07. 29

////////use example///////////

puzzle.init({
	level: 2,
	size: 10,
	words: [
		"apple",
		"html",
		"love",
		"happy",
		"paper",
		"coffee",
		"alpha",
		"people",
		"money",
		"world",
		"phone",
		"super",
		"content"
	],
	width: 400,
	height: 400,
	success: function(){
		console.log("success");
	},
	fail: function(){
		console.log("fail");
	},
	complete: function(){
		console.log("complete");
	},
	isTest: true
});


puzzle.init({
	size: 20,
	words: [
		"merry christmas",
		"happy birthday",
		"happy valentines day",
		"happy easter",
		"happy thanksgiving",
		"i love you",
		"i miss you",
		"happy nameday",
		"congratulations",
		"happy retirement",
		"recover soon",
		"greetings",
		"with love",
		"you are the best",
		"for dad",
		"for mom",
		"enjoy",
		"all the best",
		"it is not a tie",
		"it is not a perfume"
	],
	success: function(){
		console.log("success");
	},
	fail: function(){
		console.log("fail");
	},
	complete: function(){
		console.log("complete");
	},
	isTest: true
});



/////////////sample style/////////////
<style>
#puzzle .alphabet{
	border-left:solid #000 1px;
	border-top:solid #000 1px;
	font-size:14pt;
	line-height:35px;
	color:#666;
}
#puzzle{
	position:absolute;
	border-right: solid #000 1px;
	border-bottom: solid #000 1px;
	left: 118px;
	top: 3px;
	width: 700px;
	height: 700px;
}
#wordList{
	position:absolute;
	left: 868px;
	top: 3px;
}
#puzzle .hover{
	background-color:#FC6;
}
#puzzle .complete, #wordList .complete{
	background-color:#999;
}
#puzzle .active, #wordList .active{
	background-color:#39F;
}

</style>
*/

define(['jquery'], function($){
	var ap = "abcdefghijklmnopqrstuvwxyz"
			, words
			, size = 0
			, apLen = ap.length
			, table = []
			, tableInfo = []
			, isTest
			, isInit = false;
			
	
	function init(options){
		
		var i,j;
		var defaultOpt = {
			level: 1,
			size: 5,
			words: [],
			width: null,
			height: null,
			success: null,
			fail: null,
			complete: null,
			isTest: false
		};
		var options = options || {};
		for(var o in defaultOpt) if(options[o] == undefined) options[o] = defaultOpt[o];
		
		size = options.size;
		words = options.words;
		isTest = options.isTest;
		
		
		
		var $puzzle = $("#puzzle");
		var wlen = words.length;
		var wsize;
		var xl,yl,xi,yi,r,k,c;
		var dropList = [];
		var writeCount = 0;
		var chkCount = 0;
		var revWord;
		var thisDropList;
		var word;
		var maxLevel = 3;
		var level = Math.min(options.level || 1, maxLevel) - 1;
		var levelVal = [1, 2, 3];//difficult
		console.log("level:", level);
		if($puzzle.length == 0){
			throw "There is no DIV with ID 'puzzle'";
			return;
		}
		isInit = true;
		
		for(i=0; i<size; i++){
			table[i] = [];
			tableInfo[i] = []
			for(j=0; j<size; j++){
				table[i][j] = " ";
				tableInfo[i][j] = -1;
			}
		}
		
		suffle(words);
		
		ap = ap.toUpperCase();
		
		for(i=0; i<wlen; i++){
			words[i] = words[i].toUpperCase();
			word = trim(words[i]);
			wsize = word.length - 1;
			revWord = reverse(word);
			thisDropList = [];
			
			console.log(word);
			
			//listing write able info
			for(yi=0; yi<size; yi++){
				for(xi=0; xi<size; xi++){
					//level 1(index0)때는 직선배치의 확률이 더 높도록 +1
					for(c=0; c<=level+1; c++){
						//check
						if(xi < size - wsize && checkLine( xi, yi, word, {x:1,y:0} )) thisDropList.push({dir:{x:1,y:0}, word:word, x:xi, originWord:words[i], y:yi});
						if(yi < size - wsize && checkLine( xi, yi, word, {x:0,y:1} )) thisDropList.push({dir:{x:0,y:1}, word:word, x:xi, originWord:words[i], y:yi});
						//reverse check
						if(xi < size - wsize && checkLine( xi, yi, revWord, {x:1,y:0} )) thisDropList.push({dir:{x:1,y:0}, word:revWord, originWord:words[i], x:xi, y:yi});
						if(yi < size - wsize && checkLine( xi, yi, revWord, {x:0,y:1} )) thisDropList.push({dir:{x:0,y:1}, word:revWord, originWord:words[i], x:xi, y:yi});
					}
					
					//level이 높아질수록 대각선배치 확률이 더 높도록
					for(c=0; c<=level; c++){
						//check
						if(xi < size - wsize && yi < size - wsize && checkLine( xi, yi, word, {x:1,y:1} )) for(k=0;k<levelVal[level];k++){ thisDropList.push({dir:{x:1,y:1}, word:word, originWord:words[i], x:xi, y:yi}); }
						//if(xi >= wsize && yi < size - wsize && checkLine( xi, yi, word, {x:-1,y:1} )) for(k=0;k<levelVal[level];k++){ thisDropList.push({dir:{x:-1,y:1}, word:word, originWord:words[i], x:xi, y:yi}); }
						if(xi < size - wsize && yi >= wsize && checkLine( xi, yi, word, {x:1,y:-1} )) for(k=0;k<levelVal[level];k++){ thisDropList.push({dir:{x:1,y:-1}, word:word, originWord:words[i], x:xi, y:yi}); }
						//reverse check
						if(xi < size - wsize && yi < size - wsize && checkLine( xi, yi, revWord, {x:1,y:1} )) for(k=0;k<levelVal[level];k++){ thisDropList.push({dir:{x:1,y:1}, word:revWord, originWord:words[i], x:xi, y:yi}); }
						//if(xi >= wsize && yi < size - wsize && checkLine( xi, yi, revWord, {x:-1,y:1} )) for(k=0;k<levelVal[level];k++){ thisDropList.push({dir:{x:-1,y:1}, word:revWord, originWord:words[i], x:xi, y:yi}); }
						if(xi < size - wsize && yi >= wsize && checkLine( xi, yi, revWord, {x:1,y:-1} )) for(k=0;k<levelVal[level];k++){ thisDropList.push({dir:{x:1,y:-1}, word:revWord, originWord:words[i], x:xi, y:yi}); }
					}
				}
			}
			
			//write charater to array
			if(thisDropList.length){
				r = (Math.random() * thisDropList.length) >> 0;
				
				dropList[writeCount] = thisDropList[r];
				writeLine(thisDropList[r], writeCount);
				writeCount++;
				
				thisDropList.lenght = 0;
			}
		}
		
		console.log("totalCount", wlen);
		console.log("writeCount", writeCount);
		
		//charater random fill
		fillAp(table);
		
		var pw = options.width || $puzzle.width() || 500;
		var ph = options.height || $puzzle.height() || 500;
		var aw = pw/size;
		var ah = ph/size;
		var colors = [];
		
		$puzzle.width(pw);
		$puzzle.height(ph);
		//console.log(pw);
		
		if(isTest){
			colors[0] = "#000000";
			for(i=0; i<wlen; i++){
				colors[i+1] = "#"+((Math.random() * 0xffffff)>>0).toString(16);
			}
		}
		
		var $alphabet;
		var outerHTML;
		var isDown = false;
		var $downChar;
		var $overChar;
		var tempChars = [];
		// make DOM and bind
		for(i=0; i<size; i++){
			for(j=0; j<size; j++){
				$puzzle.addClass("sg-noselect").css("cursor", "pointer");
				outerHTML = '<div class="alphabet" style="position:absolute; left:' + (j*aw) + 'px; top:' + (i*ah) + 'px; width:' + aw + 'px; height:' + ah + 'px;">' + table[i][j] + '</div>';
				$alphabet = $(outerHTML).appendTo($puzzle)
				.data("j", j).attr("data-j",j)
				.data("i", i).attr("data-i",i)
				.attr("data-ap-idx", tableInfo[i][j])
				.hover(
					function(e){
						if(isDown){
							$overChar = $(this);
						}else{
							$(this).addClass("hover");
						}
					},
					function(e){
						if(isDown && $downChar[0] != this){
							$(this).removeClass("active");
						}else{
							$(this).removeClass("hover");
						}
					}
				)
				.bind("mousedown", function(e){
					isDown = true;
					$overChar = $downChar = $(this).addClass("active").removeClass("hover");
					
					var dx = e.clientX;
					var dy = e.clientY;
					var di = $downChar.data("i");
					var dj = $downChar.data("j");
					tempChars = [];
					var tempEl;
					$puzzle.bind("mousemove", function(e){
						if(!$overChar) return;
						var el = Math.max(Math.abs(dj-$overChar.data("j")), Math.abs(di-$overChar.data("i")));
						var angle = Math.atan2(e.clientY-dy, e.clientX-dx) * 180 / Math.PI + 90;
						//angle snap. step 45deg
						angle = Math.round(angle/45) * 45;
						//angle clamp
						angle = angle < 0 ? angle + 360 : angle > 360 ? angle - 360 : angle;
						//define directer by angle
						var dir = {x:0,y:0};
						switch(angle){
							case 0:
							case 360: dir.x=0; dir.y=-1; break;
							case 45: dir.x=1; dir.y=-1; break;
							case 90: dir.x=1; dir.y=0; break;
							case 135: dir.x=1; dir.y=1; break;
							case 180: dir.x=0; dir.y=1; break;
							case 225: dir.x=-1; dir.y=1; break;
							case 270: dir.x=-1; dir.y=0; break;
							case 315: dir.x=-1; dir.y=-1; break;
						}
						
						//div's select snap angle
						var i;
						if(tempChars.length){
							//console.log("r", tempChars);
							for(i=0; i<tempChars.length; i++){
								tempChars[i].removeClass("active");
							}
							tempChars=[];
						}
						for(i=0; i<=el; i++){
							tempChars[i] = $('[data-i=' + (di+dir.y*i) + '][data-j=' + (dj+dir.x*i) + ']').addClass("active");
						}
						
					});
				})
				.bind("mouseup", function(e){
					var i,j,l;
					l = tempChars.length;
					var chk = l>1;
					var ii,jj;
					var infoIdx;
					isDown = false;
					
					//check words of seleted character
					if(chk){
						var tempArr;
						var tempStr1;
						var tempStr2;
						for(i=0; i<l; i++){
							ii = tempChars[i].data("i");
							jj = tempChars[i].data("j");
							infoIdx = tableInfo[ii][jj];
							if(infoIdx == -1) continue;
							tempArr = [];
							for(j=0; j<l; j++){
								tempArr.push(tempChars[j].text());
							}
							tempStr1 = tempArr.sort().join('');
							tempStr2 = dropList[infoIdx].word.split('').sort().join('');
							chk = tempStr1 == tempStr2;
							console.log(tempStr1, tempStr2);
							if(chk) break;
						}
						
					}
					console.log(chk);
					
					// apply success, fail, complete
					for(i=0; i<l; i++){
						if(chk) tempChars[i].addClass("complete");
						tempChars[i].removeClass("active");
					}
					if(chk){
						chkCount++;
						if($wordList.length) $('[data-wd-idx=' + infoIdx + ']').addClass("complete");
						if(options.success != null) options.success.apply(this);
						if(chkCount == writeCount){
							if(options.complete != null) options.complete.apply(this);
							destroy();
						}
					}else{
						if(options.fail != null) options.fail.apply(this);
					}
					$(this).removeClass("active");
					$downChar.removeClass("active");
					$puzzle.unbind("mousemove");
				});
				
				$puzzle.bind("mouseleave", function(e){
					isDown = false;
					$puzzle.unbind("mousemove");
					if(tempChars.length){
						for(var i=0; i<tempChars.length; i++){
							tempChars[i].removeClass("active");
						}
					}
				});
							
				if(isTest){
					$alphabet.css("color", colors[tableInfo[i][j]]);
				}
			}
		}
		
		//add word list
		var $wordDiv;
		var $wordList = $("#wordList");
		if($wordList.length){
			for(i=0; i<dropList.length; i++){
				$wordDiv = $('<div data-wd-idx="' + i + '">' + dropList[i].originWord + '</div>');
				
				if(isTest){
					$wordDiv.hover(
						function(){
							$('[data-ap-idx=' + $(this).attr("data-wd-idx") + ']').addClass("active");
							$(this).addClass("active");
						},
						function(){
							$('[data-ap-idx=' + $(this).attr("data-wd-idx") + ']').removeClass("active");
							$(this).removeClass("active");
						}
					);
				}
				
				$wordList.append($wordDiv);
			}
		}
		
		if(isTest){
			for(i=0; i<size; i++){
				console.log(table[i]);
			}
		}
	}
	
	function setAlphabet(str){
		ap = str;
	}
	
	function writeLine(lineInfo, num){
		//console.log(lineInfo);
		var i,len = lineInfo.word.length;
		var y,x;
		for(i=0; i<len; i++){
			x = lineInfo.x+(i*lineInfo.dir.x);
			y = lineInfo.y+(i*lineInfo.dir.y);
			table[y][x] = lineInfo.word.charAt(i);
			tableInfo[y][x] = num;
		}
	}
	
	function checkLine(x, y, word, checkStep){
		var i,len = word.length;
		//checkStep = {x:,y:};
		var cx, cy;
		for(i=0; i<len; i++){
			cx = x+(i*checkStep.x);
			cy = y+(i*checkStep.y);
			if(cx < 0 || cx >= size || cy < 0 || cy >= size || !(table[cy][cx] == " " || table[cy][cx] == word.charAt(i))) return false;//
		}
		return true;
	}
	
	
	function fillAp(arr){
		var i,j,l = arr.length;
		for(i=0; i<l; i++){
			for(j=0; j<l; j++){
				if(arr[i][j] == " ") arr[i][j] = ap.charAt((Math.random()*apLen)>>0);
			}
		}
	}
	
	function reverse(arrayOrString){
		if(typeof arrayOrString === "string"){
			return arrayOrString.split("").reverse().join("");
		}else if(typeof arrayOrString === "object"){
			return arrayOrString.reverse();
		}
	}
	
	function suffle(arrayOrString){
		if(typeof arrayOrString === "string"){
			return arrayOrString.split("").sort(function(a,b){
				return Math.random() < 0.5 ? -1 : 1;
			}).join("");
		}else if(typeof arrayOrString === "object"){
			return arrayOrString.sort(function(a,b){
				return Math.random() < 0.5 ? -1 : 1;
			});
		}
	}
	
	function trim(str){
		return str.replace(/\s/ig,'');
	}
	
	function destroy(){
		if(!isInit) return;
		console.log("destroy");
		$("#puzzle").unbind("mouseleave");
		$("#wordList").children().each(function(i,e){
			$(this).unbind("mouseenter mouseleave");
		});
		$("[data-ap-idx]").unbind("mouseup mousedown mouseenter mouseleave").removeClass("hover").removeClass("active");
	}
	
	return {
		setAlphabet: setAlphabet,
		init: init,
		destroy: destroy
	}
});