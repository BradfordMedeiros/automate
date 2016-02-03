

var $ =  require("jquery-browserify");
var options = require("/home/samantha/Documents/automationGIT/config/options.js");
var message_handler = new (require("/home/samantha/Documents/automationGIT/messaging/message_handler.js"));
$(window).load(function(){
	$("#test1").append("hello")
})


var browser_internet = function ( is_client ){
	this.request_port_server = options.request_port_server;
	this.message_handler = message_handler.getMessageHandlerInstance();
	
};	

browser_internet.prototype.getOnMessageRecieved = function () {
	throw (new Error("unimplemented"));
};

/**
	Starts making posts to the server to check if it has any new messages


	**/
browser_internet.prototype.turn_on_interface = function ( inbound, outbound ){
	throw (new Error("unimplemented"));
};

browser_internet.prototype.send_message = function(message, identifier ){
	throw (new Error("unimplemented"));
};



browser_internet.prototype.get_network_id = function (){
	return 'browser_internet';
};

browser_internet.prototype.set_on_message_received = function( func ){
	throw (new Error("unimplemented"));
};

browser_internet.prototype.is_available = function (){
	throw (new Error("unimplemented"));
};




browser_internet.prototype._checkInterfaceAvailablility = function (){
	throw (new Error("unimplemented"));
};


browser_internet.prototype.deload = function (){
	throw (new Error("unimplemented"));
};


module.exports = browser_internet;
