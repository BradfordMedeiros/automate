FILEFINDER = '/.files'

/*
	This network interface is used for debugging purposes. 

	The idea with this interface is that we can use this to dump a log 
	file of received topic updates to see what was sent to this
	interface.

*/
var debug_network = function () {
	this.is_on = false;
	this.on_message_received = undefined;
}



debug_network.prototype.turn_on_interface = function ( inbound, outbound ){
	this.is_on = true;	
}

debug_network.prototype.sendMessage = function(message,config){
	
}


debug_network.prototype.getNetworkID = function (){
	return 'debug_network';
}

debug_network.prototype.setOnMessageReceived = function( func ){
	this.on_message_received = func;
}

debug_network.prototype.isAvailable = function (){
	return this.is_on;
}


debug_network.prototype.deload = function (){
	this.is_on = false;
}

debug_network.prototype.check_message_content = function ( message ){

}



checkImplementsInterface = require(require(process.env.HOME+FILEFINDER).interface);
checkImplementsInterface(debug_network,'network_interface');


module.exports = debug_network;