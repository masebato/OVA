var prototypeOfObject = Object.prototype;
var _toString = prototypeOfObject.toString;


window.isFunction = function (val) {
    return _toString.call(val) === '[object Function]';
};
window.isRegex = function (val) {
    return _toString.call(val) === '[object RegExp]';
};
window.isArray = function isArray(obj) {
    return _toString.call(obj) === "[object Array]";
};
window.isArguments = function isArguments(value) {
    var str = _toString.call(value);
    var isArgs = str === '[object Arguments]';
    if (!isArgs) {
        isArgs = !isArray(str)
            && value !== null
            && typeof value === 'object'
            && typeof value.length === 'number'
            && value.length >= 0
            && isFunction(value.callee);
    }
    return isArgs;
};
window.now = function(){ return Date.now(); }

window.range = function(min,max,val){
	if(val > max) return max;
	else if(val < min) return min;
	return val;
}

window.getRect = function( element ) {
	var x = 0;
	var y = 0;
	var width = element.offsetWidth;
	var height = element.offsetHeight;

	do {

		x += element.offsetLeft;
		y += element.offsetTop;

	} while ( element = element.offsetParent );

	return { x:x, y:y, width:width, height:height };
}

String.prototype.trim = function(){
	return this.replace(/(^\s*)|(\s*$)/g,"");
};
String.prototype.trimAll = function(){
	return this.replace(/\s/g,"");
};
String.prototype.replaceAll = function(text,replaceText){
	return this.split(text).join(replaceText);
}