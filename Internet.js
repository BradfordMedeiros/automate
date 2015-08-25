FILEFINDER = '/.files'

var Internet = function ( ){

	var networkCheckingFrequency = require((require(process.env.HOME+FILEFINDER)).options).interface_refresh_speed;
	this.onMessageReceived = undefined;
	this.interfaceIsAvailable = undefined;
	this.checkInterfaceAvailablility();
	this.handle = setInterval( this.checkInterfaceAvailablility.bind(this), 1000* networkCheckingFrequency );

}	

Internet.prototype.sendMessage = function(message,config){

}

Internet.prototype.getNetworkID = function (){
	return 'internet'
}

Internet.prototype.setOnMessageReceived = function( func ){
	this.onMessageReceived = func;
}

Internet.prototype.isAvailable = function (){
	return this.interfaceIsAvailable;
}

Internet.prototype.sendOut = function (message){

}


Internet.prototype.checkInterfaceAvailablility = function (){
	var that = this;
	require('dns').lookup('google.com',function(err){
		if (err && err.code == 'ENOTFOUND'){
			that.interfaceIsAvailable = false;
		}else{
			that.interfaceIsAvailable = true;
		}
	});
}

Internet.prototype.cleanUp = function (){
	clearInterval(this.handle);
	delete this;
}


checkImplementsInterface = require(require(process.env.HOME+FILEFINDER).interface);
checkImplementsInterface(Internet,'network_interface');



module.exports = Internet;