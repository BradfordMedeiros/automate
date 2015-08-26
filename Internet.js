FILEFINDER = '/.files'

var Internet = function ( ){

	var networkCheckingFrequency = require((require(process.env.HOME+FILEFINDER)).options).interface_refresh_speed;
	this.onMessageReceived = undefined;
	this.interfaceIsAvailable = undefined;
	this.checkInterfaceAvailablility();
	this.request = require('request');
	this.express = require('express');
	this.app = this.express();
	this.app.post('/',function(req,res){
		res.send('got post');
	});

	this.port = require(require(process.env.HOME+FILEFINDER).options).request_port;
	this.server = undefined;
	

	this.handle = setInterval( this.checkInterfaceAvailablility.bind(this), 1000* networkCheckingFrequency );

}	


Internet.prototype.turnOnServer = function (){
	var that = this;
	this.server = this.app.listen(that.port, function (){
		var host = that.server.address().address;
  		var port = that.server.address().port;
		console.log('listening at http://%s:%s', host, port);
	})
}

Internet.prototype.sendMessage = function(message,config){
	var ipaddress = config.identifier+':'+this.port;
	this.request.post(
		ipaddress,
    	{ 
    		json:  message  
    	},
    	function (error, response, body) {
        	console.log('error:  '+error);				// should figure out what
        	console.log('response: '+response);			// we want to do here
        	console.log('body:  '+body);
    	}
	);
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
	if (this.server){
		this.server.close();
	}
	delete this;
}


checkImplementsInterface = require(require(process.env.HOME+FILEFINDER).interface);
checkImplementsInterface(Internet,'network_interface');



module.exports = Internet;