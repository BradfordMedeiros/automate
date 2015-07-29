
// BASIC ELEMENTARY TESTS

var testsuite = new Array();
/////////TEST0/////////////////////////////////
var test0 = { };


test0.id = "autotest test 0";
test0.func = function ( getRequire ){
	//require = getRequire ();	// i don't like how this is done, but ok for now
	//require('hello world')

	//var mt = require('/home/samantha/Documents/automationGIT/MessageTypes.js')
	//console.log(mt);

	return 0;
}

test0.answer = 0;
test0.globalRequire = true;
testsuite.push(test0);

/////////TEST1/////////////////////////////////
var test1 = { };
test1.id = "autotest test 1";
test1.func = function (){

	return "hello";
}

test1.answer = "hello";

testsuite.push(test1);





module.exports = testsuite;
