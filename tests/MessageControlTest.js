
// BASIC ELEMENTARY TESTS
var FILEFINDER = '/.files';

var testsuite = new Array();
/////////TEST0/////////////////////////////////
var test0 = { };
test0.id = "MessageControl:  CLIENT: Client Device Init";
test0.func = function ( ){

	return false;
}

test0.answer = true;
testsuite.push(test0);

/////////TEST1/////////////////////////////////
var test1 = { };
test1.id = "MessageControl:  CLIENT: Client Topic Update";
test1.func = function ( ){

	return false;
}

test1.answer = true;
testsuite.push(test1);

/////////TEST2/////////////////////////////////
var test2 = { };
test2.id = "MessageControl:  CLIENT: Client Status";
test2.func = function ( ){

	return false;
}

test2.answer = true;
testsuite.push(test2);

/////////TEST3////////////////////////////////
var test3 = { };
test3.id = "MessageControl:  CLIENT: Service Request";
test3.func = function ( ){

	return false;
}

test3.answer = true;
testsuite.push(test3);





module.exports = testsuite;


