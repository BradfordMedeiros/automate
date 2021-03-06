var assert = require("assert");
var files = require('/home/samantha/.files.js');
var messaging = require(files.messaging);

describe ("sanity check of messagetypes file",function(){

	var messagetypes = messaging.message_types;

	it ("message metadata defined ",function(){
		assert.notEqual(messagetypes.metadata, undefined);
	});

	it ("server messages defined", function(){
		assert.notEqual(messagetypes.SERVER_MESSAGES,undefined);
	});

	it("each message has required fields defined",function(){
		var alldefined = true;
		for (field in messagetypes.CLIENT_MESSAGES){
			alldefined = ( (messagetypes.CLIENT_MESSAGES[field].messagename  != undefined )&& (messagetypes.CLIENT_MESSAGES[field].requirements !=undefined ) );
		}
		assert.equal(alldefined,true);
	});

});
