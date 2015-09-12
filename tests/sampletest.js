//require = GLOBAL.require;

// BASIC ELEMENTARY TESTS

var testsuite = new Array();
/////////TEST0/////////////////////////////////
var test0 = { };


test0.id = "basic testing suite test";
test0.func = function ( getRequire ){
	return "hello";
}

test0.answer = "hello";
testsuite.push(test0);

/////////TEST1/////////////////////////////////
var test1 = { };
test1.id = "global require test 1 | require works as GLOBAL.require";
test1.func = function (){
	var file  = require('/home/samantha/.files');
	file._DONOTUSE = 6;
	var file1 = require('/home/samantha/.files');
	return file1._DONOTUSE == 6 ? "correct" : "error"; 
}

test1.answer = "correct";
testsuite.push(test1);


/////////TEST2/////////////////////////////////
var test2 = { };
test2.id = "global require test 2 | global.require is sandboxed dependent on t1";
test2.func = function (){
	var file  = require('/home/samantha/.files');
	return file._DONOTUSE == undefined ? "correct" : "error";
}

test2.answer = "correct";
testsuite.push(test2);


module.exports = testsuite;