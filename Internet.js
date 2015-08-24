FILEFINDER = '/.files'

var Internet = function ( ){
	this.a = 2;
	this.onMessageReceived = undefined;
	this.http = require('http');
	console.log('jkdfj')
}	

Internet.prototype.sendMessage = function(message,config){

}

Internet.prototype.getNetworkID = function (){
	return 'internet'
}

Internet.prototype.setOnMessageReceived = function( func ){
	this.onMessageReceived = func;
}

var test = function(){
	console.log('got response');
}

Internet.prototype.sendOut = function (message){

}




checkImplementsInterface = require(require(process.env.HOME+FILEFINDER).interface);
checkImplementsInterface(Internet,'network_interface');

module.exports = Internet;