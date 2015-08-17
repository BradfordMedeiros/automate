
// BASIC ELEMENTARY TESTS

var testsuite = new Array();
/////////TEST0/////////////////////////////////
var test0 = { };


test0.id = "checks some MessageTypes.js integrity";
test0.func = function (  ){
	var files = require('/home/samantha/.files.js');
	var messagetypes = require(files.messagetypes);
	if (messagetypes.metadata == undefined){
		return false;
	}

	if (messagetypes.SERVER_MESSAGES == undefined){
		return false;
	}

	if (messagetypes.CLIENT_MESSAGES == undefined){
		return false;
	}

	var alldefined = true;
	for (field in messagetypes.CLIENT_MESSAGES){
		alldefined = ( (messagetypes.CLIENT_MESSAGES[field].messagename  != undefined )&& (messagetypes.CLIENT_MESSAGES[field].requirements !=undefined ) );
	}
	return alldefined;
}

test0.answer = true;
testsuite.push(test0);

module.exports = testsuite;