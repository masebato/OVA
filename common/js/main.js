 /*
 	user strict 명령은 엄격하게 JavaScript 룰을 적용하라는 의미이다.
 	일부 브라우저의 경우 use strict 명령을 통해 보다 빠르게 동작하는 경우도 존재하는 것 같다.
 	잘못된 부분에 대한 검증도 보다 엄격하게 동작한다.
 	하지만, 일부 라이브러리의 경우 use strict 명령을 사용하면 동작하지 않는 경우도 있으므로 주의해야 한다.
  */
 'use strict';

 var _customTagList = [];

 function addCustomTag(customTagName, swapTagName, identifier) {
     _customTagList.push({
         customTagName: customTagName,
         swapTagName: swapTagName,
         identifier: identifier
     });
 }



 addCustomTag('sg-btn-hide', 'span', 'data-sg-id="btn-hide"');
 addCustomTag('sg-btn-popup-close', 'div', 'data-sg-id="btn-popup-close"');
 addCustomTag('sg-btn-popup', 'div', 'data-sg-id="btn-popup"');
 addCustomTag('sg-btn-page', 'div', 'data-sg-id="btn-page"');
 addCustomTag('sg-item-popup', 'div', 'data-sg-id="item-popup"');
 addCustomTag('sg-item-page', 'div', 'data-sg-id="item-page"');




 document.addEventListener("DOMContentLoaded", function (e) {
     var body = document.body;
     body.style.visibility = "hidden";
     var html = body.innerHTML;

     function swapTag(findTagName, swapTagName, identifier) {
         if (document.querySelector(findTagName)) {
             identifier = identifier ? ' ' + identifier + ' ' : '';
             html = html
                 .replace(new RegExp('<' + findTagName, 'g'), '<' + swapTagName + identifier)
                 .replace(new RegExp('</' + findTagName + '>', 'g'), '</' + swapTagName + '>');
         }
     }

     _customTagList.forEach(function (o) {
         swapTag(o.customTagName, o.swapTagName, o.identifier);
     });

     /*************attr*************/
     //add custom attribute prefix : data-

     var sgAttrNameReg = /\ssg([\-][\w]*){1,5}(\s)?=/gi,
         s1 = html.split('<'),
         s2, matchArr, r2 = [],
         i;

     for (i = 0; i < s1.length; i++) {
         s2 = s1[i].split('>');
         //console.log(s2);
         for (var j = 0; j < s2.length; j++) {
             if (j % 2 == 0) {
                 //console.log("s2", s2[j]);
                 matchArr = s2[j].match(sgAttrNameReg);
                 //console.log(matchArr);
                 if (matchArr) {
                     for (var k = 0; k < matchArr.length; k++) {
                         //console.log(k, matchArr[k]);
                         s2[j] = s2[j].replace(matchArr[k], " data-" + matchArr[k].substr(1));
                     }
                 }
             }
         }
         //console.log("s22",s2.join('>'));
         r2.push(s2.join('>'));
     }
     //console.log(r2.join('<'));
     html = r2.join('<');

     body.innerHTML = html;
     body.style.visibility = "visible";
     ////end custom tag change for standard



     //add progress img
     var progressImg = new Image();
     progressImg.id = "progressImg";
     progressImg.src = sg.relativeRootPath + "/img/progress_circle.gif";
     progressImg.style.position = "fixed";
     progressImg.style.left = ((window.innerWidth - 32) * 0.5) + "px";
     progressImg.style.top = ((window.innerHeight - 32) * 0.5) + "px";
     document.body.appendChild(progressImg);
 });



 var initList = initList || [];

 var sg = window.sg = sg || {};
 sg.relativeRootPath = sg.relativeRootPath || "../../common";
 sg.skinPath = sg.skinPath || "";
 var soundUrlList = {
     "success": sg.relativeRootPath + "/sounds/success.mp3",
     "success-low": sg.relativeRootPath + "/sounds/success-low.mp3",
     "error": sg.relativeRootPath + "/sounds/error.mp3"
 };



 requirejs.config({
     //html파일 기준으로
     baseUrl: sg.relativeRootPath,
     paths: {
         'text': 'lib/require/text', //HTML 데이터를 가져올때 text! 프리픽스를 붙여준다.
         'jquery': 'lib/jquery/jquery-1.11.1.min',
         'jquery-ui': 'lib/jquery/jquery-ui-1.10.4.custom.min', //jquery-ui-1.10.2.min',
         'jquery-ui-touchpunch': 'lib/jquery/jquery.ui.touch-punch.min',
         'jquery-regex': 'lib/jquery/jquery.regex',
         'jquery-drag': 'lib/jquery/jquery.event.drag-2.2',
         'jquery-hittest': 'lib/jquery/e-smart-hittest-jquery',
         'jquery-easytabs': 'lib/jquery/jquery.easytabs.custom', //jquery.easytabs.min',
         'jquery-fancybox': 'lib/jquery/fancybox/jquery.fancybox',
         'jquery-scrollLock': 'lib/jquery/jquery.scrollLock',
         //'jquery-cycle': 'lib/jquery/jquery.cycle2.min',
         'jquery-ionsound': 'lib/jquery/ion.sound',
         //'jquery-spin': 'lib/jquery/jquery.spin',
         //'angular': 'lib/angular/angular.min',
         //'spin': 'lib/utils/spin.min',
         'json': 'lib/json3/json3',
         //'app': 'js/app',
         'util': 'lib/tj/tj.utils',
         //'bootstrap': 'lib/bootstrap/js/bootstrap.min',
         //'progress': 'lib/progress/ProgressCircle.min'
         'geometry': 'lib/joint/geometry.min',
         'vectorizer': 'lib/joint/vectorizer.min',
         'underscore': 'lib/joint/lodash',
         'backbone': 'lib/joint/backbone',
         'joint': 'lib/joint/joint.clean.min',
         'matched': 'js/matched/matched_v1.0',
         'flip': 'js/flip/jquery.flip'
     },

     /*
     	shim:
     	AMD 형식을 지원하지 않는 라이브러리의 경우 아래와 같이 SHIM을 사용해서 모듈로 불러올 수 있다.
     	참고 : http://gregfranko.com/blog/require-dot-js-2-dot-0-shim-configuration/
     */
     shim: {
         /*
		'angular':{
			deps:['jquery'],
			exports:'angular'
		},
		*/
         'jquery-regex': {
             deps: ['jquery']
         },
         'jquery-ui': {
             deps: ['jquery']
         },
         'jquery-ui-touchpunch': {
             deps: ['jquery-ui']
         },
         'jquery-fancybox': {
             deps: ['jquery']
         },
         'jquery-drag': {
             deps: ['jquery']
         },
         'jquery-hittest': {
             deps: ['jquery']
         },
         /*,
		'jquery-cycle':{
			deps:['jquery']
		},
		*/
         'jquery-scrollLock': {
             deps: ['jquery']
         },
         'jquery-easytabs': {
             deps: ['jquery']
         },
         'jquery-ionsound': {
             deps: ['jquery']
         },
         /*'bootstrap':{
			deps:['jquery']
		},*/
         'backbone': {
             //These script dependencies should be loaded before loading backbone.js.
             deps: ['underscore', 'jquery'],
             //Once loaded, use the global 'Backbone' as the module value.
             exports: 'Backbone'
         },
         'joint': {
             deps: ['geometry', 'vectorizer', 'jquery', 'underscore', 'backbone'],
             exports: 'joint',
             init: function (geometry, vectorizer) {
                 // JointJS must export geometry and vectorizer otheriwse
                 // they won't be exported due to the AMD nature of those libs and
                 // so JointJS would be missing them.
                 this.g = geometry;
                 this.V = vectorizer;
             }
         },
         'underscore': {
             exports: '_'
         },
         'flip': {
             deps: ['jquery']
         },
         'matched': {
             deps: ['jquery', 'flip']
         },
     }
 });



 /*
 var hit = targetObject.hitTestObject({"object":otherObject, "transparency":true});
 var hit = $('#mouseImgHittest').hitTestPoint({"x":e.pageX,"y":e.pageY, "transparency":true});
 */


 //for use angular
 //requirejs( ['jquery', 'json', 'angular',  'app', 'jquery-regex', 'jquery-ui', 'jquery-snd', 'jquery-drag', 'util'], function ($, JSON, angular, app) {
 //'jquery-cycle'

 requirejs(['jquery', 'json', 'jquery-regex', 'jquery-ui', 'jquery-drag', 'jquery-hittest', 'jquery-ui-touchpunch', 'jquery-easytabs', 'jquery-ionsound', 'jquery-fancybox', 'jquery-scrollLock', 'util'], function ($, JSON3) {

     /*
	requirejs(['js/kit/inputKitComp.js'], function(ikit){
		app.controller('inputTypeController', ['$scope', '$element', function($scope, $element){
			$scope.answer = [];
			$scope.answerStr = "";
			$scope.getAnswer = function(){
				$scope.answerString = $scope.answer.join(',');
			};
			$scope.checkAnswer = function(){
				alert(ikit.check($scope.answer, ['a','b','c'], {freeOrderJudge: ["0,1"]}));
			};
			$scope.inputAnswer = function(){
				$scope.answer = $scope.answerString.split(',');
			};
			
			
			
			console.log($element.attr("ng-controller"));
			console.log($element.scope());
			
			//최상위 부모 컨트롤러인 CommonController에서 하위의 컨트롤러들을 잡아낼수 있으면, 그렇게 하는것이 편하고 옳은방법일듯.
			//그게 아니라면, jQuery셀렉터에서 ng-controller가 특정 유형이름인것들을 모두 잡아내야 하나..
			
		}]);
		angular.bootstrap(document, ['myApp']);
	});
	*/


     //console.log("?");

     //angular.bootstrap(document, ['myApp']);

     $(document).ready(function () {

         var JSON = JSON || JSON3;
         var $body = window.$body = $("body");
         var $stage = window.$stage = $("#stage");
         var $content = window.$content = $("#content");
         var $window = $(window);

         sg.zidx = 1;

         function getStageScale() {

             var matrixStr = $stage.css("transform");
             if (matrixStr && matrixStr !== 'none') {
                 var matrix = JSON.parse($stage.css("transform").replace("matrix(", "[").replace(")", "]"));
                 //console.log(matrix);
                 sg.scaleX = matrix[0];
                 sg.scaleY = matrix[3];
             } else {
                 sg.scaleX = sg.scaleY = 0;
             }
         }

         function getScale($target) {

             var matrixStr = $target.css("transform");
             if (matrixStr && matrixStr !== 'none') {

                 var matrix = JSON.parse($target.css("transform").replace("matrix(", "[").replace(")", "]"));
                 //console.log(matrix);
                 sg.scaleX = matrix[0];
                 sg.scaleY = matrix[3];
             } else {
                 sg.scaleX = sg.scaleY = 0;
             }
         }

         function setScaleStyle($target, scalemode) {
             var ww = window.innerWidth;
             var hh = window.innerHeight;

             switch (scalemode) {
             case "showall":
                 var msc = Math.min(ww / sg.sw, hh / sg.sh);

                 $target.css({
                     "transform": "scale(" + msc + ")",
                     "transform-origin": "0 0",
                     "left": ((ww - sg.sw * msc) * 0.5) + "px",
                     "top": ((hh - sg.sh * msc) * 0.5) + "px"
                 });

                 break;

             case "noscale":
                 break;

             case "exactfit":
                 $target.css({
                     "transform": "scale(" + (ww / sg.sw) + "," + (hh / sg.sh) + ")",
                     "transform-origin": "0 0"
                 });
                 break;
             }
         };

         function setStageScaleStyle($target, scalemode) {
             var ww = window.innerWidth;
             var hh = window.innerHeight;
             var ch = $content.height() + pxToNum($content.css("margin-top")) + pxToNum($content.css("margin-bottom")) - 0.529;
             //console.log($content.height() , pxToNum($content.css("margin-top")) , pxToNum($content.css("margin-bottom")));
             switch (scalemode) {
             case "showall":

                 var msc = Math.min(ww / sg.sw, hh / sg.sh) * 1.002;

                 //stage높이보다 content높이가 크다면, 컨텐츠의 일부가 보여질때는 top 0 부터 정렬하면서 스크롤가능하게하고,
                 //컨텐츠의 전부가 보여질때는 세로 가운데정렬 하면서 스크롤을 없애자
                 //console.log(ch, sg.sh);
                 //if(ch>=sg.sh){
                 if (ch - sg.sh <= 1) { //오차 1허용
                     if (ch * msc > hh) {
                         //console.log("top 0, overflow:visible");
                         $target.css({
                             "transform": "scale(" + ((msc) - 0.01) + ")",
                             "transform-origin": "0 0",
                             "left": ((ww - sg.sw * msc) * 0.5) + "px",
                             "top": 0
                         });



                         $target.parent().css({
                             "overflow-y": "visible"
                         });
                         $.scrollLock(false);


                     } else {
                         //console.log("top center, overflow:hidden");
                         $target.css({
                             "transform": "scale(" + ((msc) - 0.02) + ")",
                             "transform-origin": "0 0",
                             "left": ((ww - sg.sw * msc) * 0.5) + "px",
                             "top": ((hh - ch * msc) * 0.5) + "px"
                         });


                         $target.parent().css({
                             "overflow-y": "hidden"
                         });
                         $.scrollLock(false);

                     }
                 } else {
                     //console.log("top center, overflow:auto");
                     $target.css({
                         "transform": "scale(" + ((msc) - 0.02) + ")",
                         "transform-origin": "0 0",
                         "left": ((ww - sg.sw * msc) * 0.5) + "px",
                         "top": ((hh - sg.sh * msc) * 0.5) + "px"
                     });


                     $target.parent().css({
                         "overflow-y": "auto"
                     });
                     $.scrollLock(false);

                 }


                 //$target.parent().height($target.height()*msc);
                 break;

             case "noscale":
                 break;

             case "exactfit":
                 $target.css({
                     "transform": "scale(" + (ww / sg.sw) + "," + (hh / sg.sh) + ")",
                     "transform-origin": "0 0"
                 });
                 break;
             }
         };


         /*************************************** sg functions **********************************************/

         sg.enabled = function enabled(elementOrSelector) {
             return $(elementOrSelector).each(function (i, e) {
                 var $this = $(this);
                 $this.css("cursor", "pointer");
                 var options = $this.data("options") || {};
                 options.enabled = true;
                 $this.data("options", options);
             });
         }

         sg.disabled = function disabled(elementOrSelector) {
             return $(elementOrSelector).each(function (i, e) {
                 var $this = $(this);
                 $this.css("cursor", "default");
                 var options = $this.data("options") || {};
                 options.enabled = false;
                 $this.data("options", options);
             });
         }

         sg.hide = function (elementOrSelector) {
             $(elementOrSelector).hide();
         }
         sg.show = function (elementOrSelector) {
             $(elementOrSelector).show();
         }
         sg.fadeIn = function (elementOrSelector) {
             $(elementOrSelector).fadeIn("slow");
         }
         sg.fadeOut = function (elementOrSelector) {
             $(elementOrSelector).fadeOut("slow");
         }


         /****************************************  전처리   ******************************************/


         //---------------------------------------------클래스 이름 처리----------------------------------------
         function ccp(className) {
             //끝에 붙은 숫자만 제거하면 key
             var key = className.replace(/-?[0-9]{0,4}%?$/, '');
             var value = className.replace(key, '');
             switch (key) {
             case "sg-font":
                 return {
                     "font-size": value + "pt"
                 };
             case "sg-mg":
             case "sg-margin":
                 return {
                     "margin": value + "px"
                 };
             case "sg-mgL":
             case "sg-marginL":
                 return {
                     "margin-left": value + "px"
                 };
             case "sg-mgT":
             case "sg-marginT":
                 return {
                     "margin-top": value + "px"
                 };
             case "sg-mgR":
             case "sg-marginR":
                 return {
                     "margin-right": value + "px"
                 };
             case "sg-mgB":
             case "sg-marginB":
                 return {
                     "margin-bottom": value + "px"
                 };
             case "sg-pd":
             case "sg-padding":
                 return {
                     "padding": value + "px"
                 };
             case "sg-pdL":
             case "sg-paddingL":
                 return {
                     "padding-left": value + "px"
                 };
             case "sg-pdT":
             case "sg-paddingT":
                 return {
                     "padding-top": value + "px"
                 };
             case "sg-pdR":
             case "sg-paddingR":
                 return {
                     "padding-right": value + "px"
                 };
             case "sg-pdB":
             case "sg-paddingB":
                 return {
                     "padding-bottom": value + "px"
                 };

             case "sg-w":
             case "sg-width":
                 return {
                     "width": value + ((value.indexOf("%") > -1) ? "" : "px")
                 };
             case "sg-h":
             case "sg-height":
                 return {
                     "height": value + ((value.indexOf("%") > -1) ? "" : "px")
                 };
             case "sg-x":
                 return {
                     "left": value + ((value.indexOf("%") > -1) ? "" : "px")
                 };
             case "sg-y":
                 return {
                     "top": value + ((value.indexOf("%") > -1) ? "" : "px")
                 };

             case "sg-scaleX":
                 return {
                     "transform": "scale(" + (value / 100) + ")"
                 };
             case "sg-scaleY":
                 return {
                     "transform": "scaleX(" + (value / 100) + ")"
                 };
             case "sg-scale":
                 return {
                     "transform": "scale(" + (value / 100) + "," + (value / 100) + ")"
                 };

             case "sg-offsetX":
                 return {
                     "margin-left": value + "px"
                 };
             case "sg-offsetY":
                 return {
                     "margin-right": value + "px"
                 };
             case "sg-r":
             case "sg-radius":
                 return {
                     "border-radius": value + "px"
                 };
             case "sg-rLT":
             case "sg-radiusLT":
                 return {
                     "border-top-left-radius": value + "px"
                 };
             case "sg-rLB":
             case "sg-radiusLB":
                 return {
                     "border-bottom-left-radius": value + "px"
                 };
             case "sg-rRT":
             case "sg-radiusRT":
                 return {
                     "border-top-right-radius": value + "px"
                 };
             case "sg-rRB":
             case "sg-radiusRB":
                 return {
                     "border-bottom-right-radius": value + "px"
                 };
             case "sg-b":
             case "sg-bold":
                 return value.length ? {
                     "font-weight": value
                 } : {
                     "font-weight": "bold"
                 };
             case "sg-alpha":
             case "sg-opacity":
                 return {
                     "opacity": value / 100
                 };

             default:
                 return null;
             }
         }

         $("[class]").each(function (i, e) {
             var $me = $(this),
                 cns = this.className.split(' '),
                 rcns = [],
                 cn, cssObj;

             while (cns.length) {
                 //왼쪽 class부터 실행
                 cn = cns.shift();
                 cssObj = ccp(cn);
                 if (cssObj) {
                     $me.css(cssObj);
                 } else {
                     rcns.push(cn);
                 }
             }
             this.className = rcns.join(' ');
         });
         //---------------------------------------------------------------------------------------------------------


         //----------------------------------------------------------------------------------------------------------

         /////overlap.. 겹치는 요소 셋팅
         //자식들을 첫번째 요소만 남기고 숨기자. 첫번째요소는 보여져야할 기본요소.

         //$(":regex(data-sg-id,\\b"+"overlap"+"[0-9]{0,2}\\b)")
         $("[data-sg-id=overlap]")
             .each(function (i, e) {
                 $(this).children(":not(:eq(0))").hide();
             });

         $("[data-sg-init]")
             .each(function (i, e) {
                 var com = $(this).attr("data-sg-init");
                 if (com) eval(com);
             });


         ///////////////////////////////drag attr func/////////////////////
         function calculatePosition(objElement, strOffset) {
             var iOffset = 0;
             if (objElement.offsetParent) {
                 do {
                     iOffset += objElement[strOffset];
                     objElement = objElement.offsetParent;
                 } while (objElement);
             }
             return iOffset;
         }

         sg.setDraggable = function (selector, options) {

             var options = options || {};

             $(selector).each(function (i, e) {
                 var $this = $(this);
                 var draggableOptions = {
                     dropSelector: options.dropSelector || $this.attr("data-sg-drop-selector"),
                     revert: (function () {
                         var r = options.revert || $this.attr("data-sg-revert");
                         return typeof r === "string" ? JSON.parse(r) : r;
                     })(),
                     fail: options.fail || $this.attr("data-sg-drop-fail"),
                     success: options.success || $this.attr("data-sg-drop-success"),
                     clone: (function () {
                         var r = options.clone || $this.attr("data-sg-clone");
                         return typeof r === "string" ? JSON.parse(r) : r;
                     })()
                 };

                 $this
                     .attr("data-sg-drop-selector", draggableOptions.dropSelector)
                     .attr("data-sg-revert", draggableOptions.revert)
                     .attr("data-sg-drop-fail", typeof draggableOptions.fail === "string" ? draggableOptions.fail : "")
                     .attr("data-sg-drop-success", typeof draggableOptions.success === "string" ? draggableOptions.success : "")
                     .attr("data-sg-clone", draggableOptions.clone)
                     .data("draggableOptions", draggableOptions);



                 $this.data("_originPos", {
                     left: this.offsetLeft,
                     top: this.offsetTop
                 }).data("originPos", {
                     left: this.offsetLeft,
                     top: this.offsetTop
                 });


                 //#140827 drop check to drop object
                 /*
				if(draggableOptions.dropSelector){
					$(draggableOptions.dropSelector).each(function(i,e){
						$(this)
						.data("dragObjs", [])
						.data("in", );
					});
				}
				*/

                 //잔상 제거효과있음
                 $this
                     .css("overflow", "hidden")
                     .css("cursor", "pointer");

                 ///////////////////////////draggable////////////////////////////////////
                 $this.draggable({

                     helper: (function () {
                         return draggableOptions.clone ? "clone" : undefined;
                     })(),
                     //cursor: 'pointer',  //Since inherit the value of the parent
                     revert: function () {
                         $.scrollLock(false);

                         var options = this.data("draggableOptions");

                         var failAction = options.fail;
                         var successAction = options.success;
                         var dropselector = options.dropSelector;
                         var bool = options.revert;
                         var isClone = options.clone;

                         var hit = false;
                         //console.log($(this).data("cloneTarget"));
                         var helper = this.data("helper") || this;
                         var rect = helper.getRect();
                         if (dropselector) {
                             //checking, center point of drag object
                             $(dropselector).each(function (i, e) {
                                 if (hit) return;

                                 hit = $(this).hitTestPoint({
                                     x: rect.x + rect.width * 0.5 * sg.scaleX,
                                     y: rect.y + rect.height * 0.5 * sg.scaleY,
                                     transparency: false,
                                     scaleX: sg.scaleX,
                                     scaleY: sg.scaleY
                                 });
                                 /*
								hit = $(this).hitTestObject({
									selector: this,
									transparency: false,
									scaleX: sg.scaleX,
									scaleY: sg.scaleY
								});
								*/
                             });
                         }


                         if (hit) {
                             /* //old code
							//bool = false;
							
							var soff = $stage.offset();
							var $clone = this.clone()
							.css("position", "absolute")
							//#140812 드래그 대상을 부모에 append하는것으로, paging 되었을 때 클론된 대상이 남는 현상이나
							//css width의 %값일때 이상이 생기는 것을 해결.
							.appendTo(this.parent()).css({
								left: hit[0].offsetLeft + ( hit.width() - this.width() ) * 0.5,
								top: hit[0].offsetTop + ( hit.height() - this.height() ) * 0.5
							});
														
							$clone.data("hit", hit);
							hit.data("dragObj", $clone);
							
							//#140721
							var cloneObjs = this.data("cloneObjs") || [];
							cloneObjs.push($clone);
							this.data("cloneObjs", cloneObjs);
							//#######
							
							if(!isClone){
								this.css("visibility", "hidden");//.draggable("disable");
							}
							*/

                             ///////////

                             //disconnect to previous connection
                             var tempHit = this.data("hit");
                             if (tempHit) {
                                 var tempDragObjs = tempHit.data("dragObjs");
                                 if (tempDragObjs) sg.splice(tempDragObjs, this);
                             }

                             //save new hit
                             this.data("hit", hit);

                             var dragObjs = hit.data("dragObjs") || [];

                             sg.splice(dragObjs, this);
                             dragObjs.push(this);
                             hit.data("dragObjs", dragObjs);


                             //this.css("visibility", "visible");
                             bool = false;
                             var newOriginPos;

                             if (this.css("position") == "absolute") {
                                 var nop = {
                                     left: hit[0].offsetLeft + (hit.width() - this.width()) * 0.5,
                                     top: hit[0].offsetTop + (hit.height() - this.height()) * 0.5
                                 };
                                 this.css(nop).data("originPos", nop);
                             } else {
                                 //position이 'relative'일 경우의 drop처리
                                 //newOriginPos는 revert처리시 사용할 새로운 위치
                                 var or = this.data("originPos");
                                 newOriginPos = {
                                     left: hit[0].offsetLeft - or.left + (hit[0].offsetWidth - this[0].offsetWidth) * 0.5,
                                     top: hit[0].offsetTop - or.top + (hit[0].offsetHeight - this[0].offsetHeight) * 0.5
                                 };
                                 this.data("newOriginPos", newOriginPos);

                                 if (isClone) {
                                     this.css("position", "relative").css(newOriginPos);
                                 } else {
                                     this.css(newOriginPos);
                                 }



                             }


                             if (successAction) {
                                 if (typeof successAction == "function") {
                                     successAction.apply(this[0]);
                                 } else {
                                     eval(successAction);
                                 }
                             }




                         } else if (!hit && failAction) {
                             if (typeof failAction == "function") {
                                 failAction.apply(this[0]);
                             } else {
                                 eval(failAction);
                             }
                         }



                         if (bool) {
                             var nop;
                             if (isClone) {
                                 bool = false;
                                 if (this.data("newOriginPos")) {
                                     nop = {
                                             left: this[0].offsetLeft,
                                             top: this[0].offsetTop
                                         }
                                         //this.data("originPos", nop);
                                     this.data("newOriginPos", nop);
                                 } else {
                                     nop = this.data("originPos");
                                 }
                                 helper.clone().appendTo(helper.parent()).animate(nop, {
                                     complete: function () {
                                         this.remove()
                                     }
                                 });
                             } else {
                                 if (this.css("position") == "absolute") {
                                     bool = false;
                                     this.animate(this.data("originPos"));
                                 } else if (nop = this.data("newOriginPos")) {
                                     //drop이후에는 revert 위치를 다르게.
                                     bool = false;
                                     this.animate(nop);
                                 }
                             }
                         }



                         return bool;
                     },

                     start: function (e, ui) {
                         var $this = $(this);
                         $.scrollLock(false);
                         //console.log(ui.helper);
                         var op = $this.data("draggableOptions");

                         if ($this.css("position") != "absolute" && !op.clone) {
                             ui.position.left *= sg.scaleX;
                             ui.position.top *= sg.scaleY;
                         }

                         $this
                             .data("disPos", {
                                 left: ui.position.left - e.clientX,
                                 top: ui.position.top - e.clientY
                             }).css("z-index", sg.zidx++);



                         if (op && op.clone) {
                             $this.data("helper", ui.helper);
                         }

                     },

                     drag: function (e, ui) {
                         var disPos = $(this).data("disPos");
                         ui.position = {
                             left: (disPos.left + e.clientX) / sg.scaleX,
                             top: (disPos.top + e.clientY) / sg.scaleY
                         };

                     }
                 });

             })

         }

         sg.setDraggable("[data-sg-draggable]");

         //#140721
         //#140827 by taejin
         sg.resetDraggable = function (selector, isAnimate) {
             //console.log(selector);
             $(selector).each(function (i, e) {
                 //console.log(1,e);
                 var $this = $(this);
                 var _op = $this.data("_originPos");
                 var _rp = {
                     left: 0,
                     top: 0
                 };

                 //reset position
                 if ($this.css("position") == "relative") {
                     if (isAnimate) $this.animate(_rp);
                     else $this.css(_rp);
                 } else {
                     if (_op) {
                         if (isAnimate) $this.animate(_op);
                         else $this.css(_op);
                     }
                 }

                 //reset originPos and newOriginPos
                 $this.data("newOriginPos", null);
                 if (_op) $this.data("originPos", _op);

                 //hit disconnect
                 var hit = $this.data("hit");
                 if (hit) {
                     var dragObjs = hit.data("dragObjs");
                     if (dragObjs) {
                         sg.splice(dragObjs, this);
                     }
                 }
                 $this.data("hit", null);
             });
         }

         sg.destroyDraggable = function (selector) {
             sg.resetDraggable(selector);
             $(selector).draggable("disable");
         }

         //#140827 by taejin
         sg.dropCheck = function (dropObj, dragObj) {
             var $dropObj = $(dropObj);
             var $dragObj = $(dragObj);
             var dragObjs = $dropObj.data("dragObjs");

             if (!(dragObjs && dragObjs.length > 0)) return false;

             for (var k = 0; k < dragObjs.length; k++) {
                 //console.log(dragObjs[k][0], $dragObj[0]);
                 if (dragObjs[k][0] == $dragObj[0]) return true;
             }
             return false;
         }

         //#140827 by taejin
         //Removed from the array
         sg.splice = function (arr, target) {
                 for (var k = 0; k < arr.length; k++) {
                     if (arr[k].jquery) {
                         if (arr[k][0] == $(target)[0]) {
                             arr.splice(k, 1);
                         }
                     } else {
                         if (arr[k] == target) {
                             arr.splice(k, 1);
                         }
                     }
                 }
                 return arr;
             }
             //########


         /****************************************** 이벤트 **********************************/

         //앵귤러 문법으로 html페이지에서 사용할 폭,너비 변수들 //resize이벤트때마다 갱신하자
         /*
		function setWindowSizeInfo(){
			var scope = angular.element($body[0]).scope();
			scope.$apply(function(){
				scope.winWidth = window.innerWidth;
				scope.winHeight = window.innerHeight;
				scope.bodyWidth = $body.width();
				scope.bodyHeight = $body.height();
				scope.contentBodyWidth = $content.width();
				scope.contentBodyHeight = $content.height();
			});
		}
		*/






         /**************************************** sg function ***************************************/
         //태그의 sg-call속성에 있는 자바스크립트 실행///////*함수명으로 함수호출*/
         function sg_call(element) {
             if (!element) {
                 throw "sg_call에서 element값이 " + element;
                 return;
             }
             //var fnNames = element.dataset["sgCall"];
             var fnNames = element.getAttribute("data-sg-call");
             if (fnNames) {
                 eval(fnNames);
             }
         }

         //현재.. hideBtn의 속성값 sg-onimg에 동작. //sg-onimg에는 id가 들어옴
         //flag에따라 보이고 숨기고 함
         function sg_onImg(element, flag) {
             if (!element) {
                 throw "sg_onImg에서 element값이 " + element;
                 return;
             }
             //var onimgSelector = element.dataset["sgOnimg"];
             var onimgSelector = element.getAttribute("data-sg-onimg");
             if (onimgSelector != undefined) {
                 if (flag) $(onimgSelector).show();
                 else $(onimgSelector).hide();
             }
         }

         //현재.. hideBtn의 속성값 sg-swapimg에 동작. //sg-swapimg에는 selector가 들어옴
         //해당 img태그는 sg-src 속성값을 가지고, src와 스왑시켜 이미지를 바꿈
         function sg_swapImg(element, playFlag) {
             if (!element) {
                 throw "sg_swapImg에서 element값이 " + element;
                 return;
             }
             //var swapimgSelector = element.dataset["sgSwapimg"];
             var swapimgSelector = element.getAttribute("data-sg-swapimg");
             if (swapimgSelector != undefined) {

                 if (playFlag) sg.swapImg(swapimgSelector);
                 else {
                     var img = new Image();
                     img.src = $(swapimgSelector).attr("data-sg-src");
                     try {
                         img.load();
                     } catch (e) {
                         console.log(e)
                     };
                 }
             }
         }

         sg.swapImg = function swapImg(elementOrSelector) {
             var $img = $(elementOrSelector);
             $img.each(function (i, e) {
                 /*
				if(this.dataset["sgSrc"]){
					var tempSrc = this.src;
					this.src = this.dataset["sgSrc"];
					this.dataset["sgSrc"] = tempSrc;
				}
				*/
                 var $me = $(this);
                 var tempSrc = $me.attr("src");
                 $me.attr("src", $me.attr("data-sg-src"));
                 $me.attr("data-sg-src", tempSrc);
             });
         }

         /*
		Autor: Jorge Lozano
		Description: Metodo utilizado para el cambio de clase de un elemento
		Date: 27/08/2014
		*/
         sg.swapClass = function swapClass(elementOrSelector, oldClass, newClass) {
             var elementos = $(elementOrSelector);
             if (elementos.length) {
                 elementos.each(function (i, e) {
                     if ($(e).hasClass(oldClass)) {
                         $(e).addClass(newClass).removeClass(oldClass);
                     } else {
                         $(e).addClass(oldClass).removeClass(newClass);
                     }
                 });
             }

         }


         /*
		태그속성 이름은 data-sg-sound
		함수사용시 sg.sound
		
		sg.sound(태그나 사운드경로, 플레이여부:true, 이름:undefined); //첫번째 인자만 필수
		태그를 인자로 넣을 경우 태그에서 data-sg-sound속성에 있는 사운드경로를 참조함.
		*/
         var sounds = [];

         function getSoundObj(url) {
             var i, len = sounds.length;
             for (i = 0; i < len; i++) {
                 //console.log(url, sounds[i].getAttribute("data-relativeSrc"));
                 if (url == sounds[i].getAttribute("data-relativeSrc")) {
                     return sounds[i];
                 }
             }
             return null;
         }

         function sg_sound(elementOrPath, playFlag, setName) {
             if (!elementOrPath) {
                 throw "sg_sound에서 element값이 " + elementOrPath;
                 return;
             }

             var soundName, soundUrl, $element;
             if (typeof elementOrPath === "string") {
                 //is url
                 soundName = elementOrPath;
             } else {
                 soundName = elementOrPath.getAttribute("data-sg-sound");
             }

             //var soundName = element.dataset["sgSound"];
             if (soundName) {
                 if (soundUrlList[soundName]) {
                     //UrlList에 있는 사운드 이름이면
                     soundUrl = soundUrlList[soundName];
                 } else {
                     soundUrl = soundName;
                     if (setName) {
                         soundUrlList[setName] = soundUrl;
                     }
                 }

                 var audio = getSoundObj(soundUrl);

                 if (!audio) {
                     audio = new Audio(); //$('<audio src="' + soundUrl + '"/>')[0];
                     audio.src = soundUrl;
                     audio.setAttribute("data-relativeSrc", soundUrl);
                     audio.load();
                     sounds.push(audio);
                 }
                 if (playFlag == true || playFlag == undefined) {
                     try {
                         audio.currentTime = 0;
                     } catch (e) {}
                     audio.play();
                 }
             }
         }

         sg.sound = sg_sound;

         /****************************************  버튼 셋팅 *****************************************/
         /*
          * target	: seletor or object
          * abil		: string of ability list
          */
         function btnInit(target, abil) {
             var $me = $(target);
             var options = getOptions(target);
             $me.data("options", options);
             $me.data("isSg", true);

             if (options.enabled) $me.css("cursor", "pointer");
             else $me.css("cursor", "default");

         }

         //인터렉션 요소의 옵션을 json으로 파싱
         function getOptions(element) {
             if (!element) {
                 throw "getOptions에서 element값이 " + element;
                 return;
             }
             //옵션이 없을 경우 입힐 기본옵션 정의
             var defaultOptions = {
                 loop: true, //인터렉션 요소의 일회성, 반복성 결정.
                 enabled: true //버튼활성유무
             };

             //var optionJson = element.dataset["sgOptions"];
             var optionJson = element.getAttribute("data-sg-options");
             var options = optionJson ? JSON.parse(optionJson) : {};
             for (var o in defaultOptions) {
                 if (options[o] == undefined) options[o] = defaultOptions[o];
             }
             return options;
         }

         //
         function pxToNum(str) {
             if (typeof str == "string") {
                 return parseInt(str.replace("px", ""), 10);
             } else return 0; //throw str + " is no pixel string.";
         }
         window.pxToNum = pxToNum;


         /*
		Autor: Jorge Lozano
		Description: metodo que permite a un elemento usar Placeholder 
		con un mismo compartamiento en cualquier navegador; Al momento de obtener 
		foco el elemento se borra el placeholder.
		Date: 18/09/2014
		*/
         $("[data-sg-placeholder]")
             .each(function (i, e) {
                 $(e).val($(e).data("sgPlaceholder"));
                 $(this).css({
                     'color': '#c2c3c8'
                 });
             }).focus(function () {
                 var valor = $.trim($(this).val());
                 if (valor == $(this).data("sgPlaceholder")) {
                     $(this).val("");
                     $(this).css({
                         'color': ''
                     });
                 }
             }).blur(function () {
                 var valor = $.trim($(this).val());
                 if (valor == "") {
                     $(this).val($(this).data("sgPlaceholder"));
                     $(this).css({
                         'color': '#c2c3c8'
                     });
                 }
             });

         //////////hideBtn remake////////////////////////////////////////////////
         //$(":regex(data-sg-id,\\b"+"btn-hide"+"[0-9]{0,2}\\b)")
         $("[data-sg-id=btn-hide]")
             .each(function (i, e) {
                 btnInit(this);
                 var $me = $(this);
                 var $child = $('<span></span>');


                 $child.html("dfsfsdf");

                 $child.html($me.html()).css("visibility", "hidden").html();
                 $me.html("").append($child);
                 var options = $me.data("options");
                 $me.data("visible", options.visible || false); //undefined라면 false넣기위해
                 $me.data("$child", $child);

                 //onimg 동기화
                 sg_onImg(this, options.visible);

                 //스왑이미지 프리로드
                 sg_swapImg(this, true);

                 //음원속성이 있다면 프리로드			
                 sg_sound(this, false);
             }).click(function (e) {

                 var $me = $(this);
                 //console.log($me.data("key"));
                 var options = $me.data("options");
                 if (!options.enabled) return;

                 var $child = $me.data("$child");
                 var flag = $me.data("visible");
                 //console.log($child);
                 //console.log(flag?"hidden":"visible");
                 $child.css("visibility", flag ? "hidden" : "visible");
                 $me.data("visible", !flag);

                 //반복실행가능 여부
                 if (options.loop == false) $me.unbind("click").css("cursor", "auto");

                 //visible값을 이미지 숨김 보임으로 연결
                 sg_onImg(this, !flag);

                 //연결된 이미지를 swap기능 수행
                 sg_swapImg(this, true);

                 //실행 스크립트
                 sg_call(this);

                 //음원속성이 있다면 재생
                 sg_sound(this);
             }).bind("mousedown", function () {
                 return false;
             });



         ////////////////////////////////////////////////////////////////////////
         var pageIdxs = {};
         //var pageIdx = 0;
         var pageLen = 0;
         var $pageBtns = $("[data-sg-id=btn-page]"); //$(":regex(data-sg-id,\\b"+"btn-page"+"([0-9]{0,2}|Next|Prev)\\b)");
         if ($pageBtns.length) {
             var $pageItems = $("[data-sg-id=item-page]"); //$(":regex(data-sg-id,\\b"+"item-page"+"[0-9]{0,2}\\b)");
             $pageItems.each(function (i, e) {
                 //음원속성이 있다면 프리로드
                 sg_sound(this, false);
             }).not("[data-sg-key=1]").hide();
         }

         $pageBtns
             .each(function (i, e) {
                 btnInit(this);
                 var $me = $(this);
                 var options = $me.data("options");
                 if (options.visible == true) $me.show();
                 else if (options.visible == false) $me.hide();

                 var groupkey = this.getAttribute("data-sg-group");
                 var groupSelector = groupkey ? "[data-sg-group=" + groupkey + "]" : "";
                 var pageIdx = pageIdxs[groupkey] = 0;

                 var $nextbt = $("[data-sg-id=btn-page]" + groupSelector + "[data-sg-key=next]");
                 var $prevbt = $("[data-sg-id=btn-page]" + groupSelector + "[data-sg-key=prev]");
                 if (pageIdx - 1 < 0) {
                     if ($nextbt.length) sg.enabled($nextbt.removeClass("off"));
                     if ($prevbt.length) sg.disabled($prevbt.addClass("off"));
                 } else if (pageIdx + 1 > pageLen - 1) {
                     if ($nextbt.length) sg.disabled($nextbt.addClass("off"));
                     if ($prevbt.length) sg.enabled($prevbt.removeClass("off"));
                 } else {
                     if ($nextbt.length) sg.enabled($nextbt.removeClass("off"));
                     if ($prevbt.length) sg.enabled($prevbt.removeClass("off"));
                 }
                 //음원속성이 있다면 프리로드
                 sg_sound(this, false);
             })
             .click(function () {
                 var $me = $(this);
                 var options = $me.data("options");
                 if (!options.enabled) return;

                 //var idkey = $me.attr("data-sg-id").match( /([0-9]{0,2}|Next|Prev)$/ )[0];//this.id.match( /([0-9]{0,2}|Next|Prev)$/ )[0];
                 //var idkey = this.dataset["sgKey"];
                 var idkey = this.getAttribute("data-sg-key");
                 var groupkey = this.getAttribute("data-sg-group");
                 var groupSelector = groupkey ? "[data-sg-group=" + groupkey + "]" : "";
                 var $page;
                 var pageIdx = pageIdxs[groupkey];
                 //console.log(pageIdx);

                 var pageLen = $("[data-sg-id=item-page]" + groupSelector).length;

                 var callFlag = false;

                 if (idkey == "next") {
                     if (pageIdx + 1 < pageLen) {
                         if (groupkey) $pageItems.filter(groupSelector).hide();
                         else $pageItems.hide();

                         pageIdx++;
                         $page = $pageItems.filter(groupSelector + "[data-sg-key=" + (pageIdx + 1) + "]");
                         if ($page.length == 0) {
                             throw groupSelector + "[data-sg-key=" + (pageIdx + 1) + "]" + "is none.";
                         } else {
                             $page.show();
                             callFlag = true;
                         }


                     }
                 } else if (idkey == "prev") {
                     if (pageIdx - 1 >= 0) {
                         if (groupkey) $pageItems.filter(groupSelector).hide();
                         else $pageItems.hide();
                         pageIdx--;
                         $page = $pageItems.filter(groupSelector + "[data-sg-key=" + (pageIdx + 1) + "]");
                         if ($page.length == 0) {
                             throw groupSelector + "[data-sg-key=" + (pageIdx + 1) + "]" + "is none.";
                         } else {
                             $page.show();
                             callFlag = true;
                         }
                     }
                 } else {
                     if (groupkey) $pageItems.filter(groupSelector).hide();
                     else $pageItems.hide();
                     pageIdx = parseInt(idkey, 10) - 1;
                     $page = $pageItems.filter(groupSelector + "[data-sg-key=" + idkey + "]");
                     if ($page.length == 0) {
                         throw groupSelector + "[data-sg-key=" + idkey + "]" + "is none.";
                     } else {
                         $page.show();
                         callFlag = true;
                     }
                 }

                 //prev next버튼이 있을 때 active, deactive 처리
                 var $nextbt = $("[data-sg-id=btn-page]" + groupSelector + "[data-sg-key=next]");
                 var $prevbt = $("[data-sg-id=btn-page]" + groupSelector + "[data-sg-key=prev]");
                 if (pageIdx - 1 < 0) {
                     if ($nextbt.length) sg.enabled($nextbt.removeClass("off"));
                     if ($prevbt.length) sg.disabled($prevbt.addClass("off"));
                 } else if (pageIdx + 1 > pageLen - 1) {
                     if ($nextbt.length) sg.disabled($nextbt.addClass("off"));
                     if ($prevbt.length) sg.enabled($prevbt.removeClass("off"));
                 } else {
                     if ($nextbt.length) sg.enabled($nextbt.removeClass("off"));
                     if ($prevbt.length) sg.enabled($prevbt.removeClass("off"));
                 }

                 pageIdxs[groupkey] = pageIdx;

                 //Establece la opacidad del elemento cliqueado en 1 , los demas en 0.5
                 var opacity = this.getAttribute("data-sg-opacity");

                 if (opacity && opacity === "true") {
                     $("[data-sg-id=btn-page]" + groupSelector + " *").css({
                         opacity: 0.5
                     });
                     $(this).children().css({
                         opacity: 1
                     });
                 }
                 //Se al momento de pulsar un btn-page, se pausen los videos 
                 //Date 12/02/2015
                 //Author Jorge Lozano
                 if ($('video').length > 0) {
                     $('video').each(function (i, obj) {
                         obj.pause();
                     });
                 }
                 //console.log($page);

                 //IE css렌더 버그.. line-height의 사이즈가 박스쉐도우의 그림자부분에 겹칠때, display:none을 해도 그림자가 남는현상 해결위한 선택.. 배경의 css랜더링위함
                 $body.css("background-color", $body.css("background-color"));

                 //window resize 이벤트를 수신하는 놈들을 위해 페이지 변경시, 디스패치
                 $window.trigger("resize");

                 if (callFlag) {
                     sg_call($page[0]);
                     //음원속성이 있다면 재생
                     sg_sound($page[0]);
                 }

                 sg_call(this);
                 //음원속성이 있다면 재생
                 sg_sound(this);
             });



         //////////////////////////////////////////////////////////
         //////////////////////////////////////////////////////////
         var $currentPopup;
         var currentPopups = [];
         var $popupBtns = $("[data-sg-id=btn-popup]"); //$(":regex(data-sg-id,\\b"+"btn-popup"+"[0-9]{0,2}\\b)");
         var $popupBg;


         function popupHandle() {
             var $me = $(this);
             var options = $me.data("options");
             if (!options.enabled) return;

             //var key = this.id.replace(/-?[0-9]{0,4}%?$/, '');
             //var id = this.id.replace(//, '');
             //console.log(this.id.match(/[0-9]{0,4}%?$/));
             //var idx = $me.attr("data-sg-id").match(/[0-9]{0,4}$/);//this.id.match(/[0-9]{0,4}$/);
             //var idx = this.dataset["sgKey"];
             var idx = this.getAttribute("data-sg-key");
             //팝업버튼 id 'popupBtn'에 번호가 안붙은 경우 popupItem에도 번호가 없다.
             var popupAttrID = "[data-sg-id=item-popup]" + (idx == undefined ? "" : "[data-sg-key=" + idx + "]");

             var $popupItem = $(popupAttrID);

             if (!$currentPopup || $currentPopup[0] != this) {
                 var ww = window.innerWidth;
                 var wh = window.innerHeight;

                 $body.append($popupBg);


                 //$popupItem.width(sw).height(sh).css({left:pleft, top: ptop}).appendTo($body).show();
                 //console.log(sg.scaleMode);
                 //setScaleStyle($popupItem, sg.scaleMode);

                 //center fixed  sg.sw, hh / sg.sh
                 setScaleStyle($popupItem, scalemode);
                 getScale($popupItem);

                 $popupItem.css({
                     'position': 'absolute',
                     //'margin-top': '4%',
                     //'margin-left': '12.5%' 
                 }).appendTo($body).show();

                 currentPopups.push($popupItem);
                 $currentPopup = $popupItem;
                 sg_call($popupItem[0]);

                 //음원속성이 있다면 재생
                 sg_sound($popupItem[0]);
             }

             //반복실행가능 여부
             if (options.loop == false) $me.unbind("click").css("cursor", "auto");

             //연동스크립트
             sg_call(this);

             //음원속성이 있다면 재생
             sg_sound(this);
         }

         window.setPopupBtn = function setPopupBtn(elementOrSelector) {
             var $target = $(elementOrSelector);
             if ($target.length) {
                 $target.each(function (i, e) {
                     //var idx = $target.attr("data-sg-id").match(/[0-9]{0,4}%?$/);//this.id.match(/[0-9]{0,4}%?$/);
                     //var idx = this.dataset["sgKey"];
                     var idx = this.getAttribute("data-sg-key");
                     var popupAttrID = "[data-sg-id=item-popup]" + (idx == undefined ? "" : "[data-sg-key=" + idx + "]");
                     var $popupItem = $(popupAttrID);

                     //팝업아이템에 음원속성이 있다면 프리로드
                     sg_sound($popupItem[0], false);
                     $popupItem.hide().children("[data-sg-id=btn-popup-close]")
                         .click(function () {

                             var idx = $(this).parent().data('sgKey');
                             var popupAttrID = "[data-sg-id=item-popup]" + (idx == undefined ? "" : "[data-sg-key=" + idx + "]");
                             var $popupItem = $(popupAttrID);

                             if ($popupItem && currentPopups.length > 0 && currentPopups[currentPopups.length - 1].data('sgKey') == $popupItem.data('sgKey')) {
                                 //En el ultimo pop up se quita el background 
                                 if (currentPopups[0].data('sgKey') == $popupItem.data('sgKey')) {
                                     $popupBg.remove();
                                 }
                                 $currentPopup.hide();
                                 sg.splice(currentPopups, $popupItem);
                                 $currentPopup = currentPopups.length > 0 ? currentPopups[currentPopups.length - 1] : null;
                             }

                             //#141010 add attribute functional
                             sg_call(this);
                         });

                 });

                 $popupBg = $('<div></div>')
                     .attr("data-sg-id", "popupBg")
                     .css({
                         width: '100%',
                         height: '100%'
                     });

                 $target
                     .click(popupHandle)
                     .each(function (i, e) {
                         btnInit(this);

                     });
             }
         }
         setPopupBtn($popupBtns);

         //#141010 open popup by key
         sg.openPopup = function (key) {
             $("[data-sg-id=btn-popup]" + "[data-sg-key=" + key + "]").trigger("click");
         }


         //이전에 클릭들이 작동한후 작동하도록..이곳에.
         //addEventListener를 사용하지않는한 이벤트 바인드순서로 정하자.
         $("[data-sg-click], [data-sg-one]")
             .each(function (i, e) {
                 btnInit(this);
                 sg_sound(this, false);
             })
             .click(function () {
                 var $me = $(this);
                 var oneCom = $me.attr("data-sg-one");
                 var com = $me.attr("data-sg-click");
                 var options = $me.data("options");
                 if (!options.enabled) return;
                 if (oneCom) {
                     eval(oneCom);
                     $me.attr("data-sg-one", null);
                     if (!com) $me.unbind("click").css("cursor", "auto");
                 }
                 if (com) eval(com);
                 sg_sound(this);
                 //반복실행가능 여부
                 if (options.loop == false) $me.unbind("click").css("cursor", "auto");
             });

         //---------------------------------------------end setting---------------------------------------------
         /*
		초기에 content를 visibility hidden을 시키면 visible시키기전에 수행되는 init과정에서 jquery.easytabs같은 것을 초기화할때 visibility값을
		상속받은체로 남아서 탭 이동시에도 visible로 되지않는 오작동을하게 된다.
		content를 display:none하게될 경우 init에서 무언가 셋팅시. width, height값을 알수 없게된다..
		
		모든요소의 셋팅과정을 가린채 셋팅이 끝난후 모습을 보여주려하는데, 위와같은 문제를 어떻게 해결해야할까
		*/
         //$content.show();

         //크롬에서,,즉시실행시 오류. 비동기로 해보자
         setTimeout(function () {
             $window.trigger("resize");
         }, 0);

         /////////////// html 에서 작성된 init();
         if (window.init) {
             //console.log(window.init);
             window.init();
         }
         //다른 스크립트에서 등록한 초기화 내용들이 있다면 수행
         if (window.initList) {
             for (var fo in window.initList) {
                 window.initList[fo]();
             }
         }


         //init함수 먼저 실행후에 디스패치
         setTimeout(function () {
             $window.trigger("init");
         }, 0);


         function getMsize(target) {
             var h = 0;
             var $this = $(target);
             h += pxToNum($this.css("padding-top")) + pxToNum($this.css("padding-bottom"));
             h += pxToNum($this.css("margin-top")) + pxToNum($this.css("margin-bottom"));
             h += pxToNum($this.css("border-top-width")) + pxToNum($this.css("border-bottom-width"));
             return h;
         }

         ///////////////초기셋팅까지 끝난시점에 사이즈를 측정

         if ($stage.length) {
             sg.sw = $stage.width();
             sg.sh = $stage.height();


             /*
			//컨텐츠배경사이즈를 스테이지에 맞추는과정
			*/
             //header의 크기를 제외한 나머지 크기만큼을 내용배경의 높이로 잡아서, 배경의 최소높이를 스테이지의 높이에 맞춘다.


             var acH = 0;
             var $header = $("header");
             $content.children().each(function (i, e) {
                 //console.log(e);
                 acH += getMsize(e);
             });
             acH += $header.height();
             acH += getMsize($content) + 1;

             $(".gga_contenido, .ggb_contenido, .ggc_contenido, .ggd_contenido, .gge_contenido").css("min-height", sg.sh - acH);


             //크기확인 테스트용
             /*
			$('<div/>').css({
				"position":"absolute",
				"background-color":"#ff0000",
				"opacity":"0.3",
				"width":$content.width(),
				"height":sg.ch,
				"left":"0px",
				"top":"0px"
			}).appendTo($stage);
			*/



             var scalemode = sg.scaleMode = $stage.attr("data-sg-scalemode");
             $body.css("overflow-x", "hidden");
             $window.bind("resize", function (e) {
                 setStageScaleStyle($stage, scalemode);
                 getStageScale();

                 //sets the popup to the adjusted scale
                 if ($currentPopup && $currentPopup.length > 0) {
                     $(currentPopups).each(function (i, e) {
                         setScaleStyle(e, scalemode);
                         getScale(e);
                     });
                 }

             });

             setStageScaleStyle($stage, scalemode);
             getStageScale();

         } else {
             sg.sw = 0;
             sg.sh = 0;
         }

         if (window.ready) {
             //console.log(window.init);
             window.ready();
         }

         $("#progressImg").remove();
         $content.css("visibility", "visible");
     });
 });