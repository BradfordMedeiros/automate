
var func = function(){

}

var func2 = function(){

}

func2.prototype.createfunc = function(){
	var func = new func();
}

func.prototype.createfunc = function(){
	var func2 = new func2();
}
module.exports = func;