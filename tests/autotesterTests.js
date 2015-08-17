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

////////TEST3/////////////////////////////////
var test3 = { };
test3.id = "global require test 3 | make sure require works in inside imported file dependent on t4";
test3.func = function (){
	var file  = require('/home/samantha/.files');
	var messagehandler1 = new (require(file.messagehandler));
	var messagehandler2 = new (require(file.messagehandler));
	messagehandler1.MESSAGETYPES.SERVER_MESSAGES._TESTFIELD = 9309;
	if (messagehandler2.MESSAGETYPES.SERVER_MESSAGES._TESTFIELD == 9309){	
		return "correct";
	}else{
		return "incorrect";
	}



}

test3.answer = "correct";
testsuite.push(test3);

////////TEST4/////////////////////////////////
var test4 = { };
test4.id = "global require test 4 | make sure require resest after dependent on t3";
test4.func = function (){
	//delete require.cache['/home/samantha/Documents/automationGIT/MessageTypes.js']

	//delete require.cache
	//console.log(require.cache)
	var file  = require('/home/samantha/.files');
	var messagehandler = new (require(file.messagehandler));
	if (messagehandler.MESSAGETYPES.SERVER_MESSAGES._TESTFIELD == undefined){
		return "correct";
	}else{
		return "incorrect";
	}
}

test4.answer = "correct";
testsuite.push(test4);







module.exports = testsuite;