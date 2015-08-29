FILEFINDER = '/.files'

var Internet = function ( ){


	var networkCheckingFrequency = require((require(process.env.HOME+FILEFINDER)).options).interface_refresh_speed;
	this._onMessageReceived = undefined;
	this._interfaceIsAvailable = undefined;
	this._checkInterfaceAvailablility();
	this._request = require('request');
	this._express = require('express');
	this._app = this._express();

	var that = this;

	


	this._app.post('/',function(req,res){
		that._onMessageReceived();
	});
	

	this._port = require(require(process.env.HOME+FILEFINDER).options).request_port;
	console.log('$:  '+this._port)
	this._server = undefined;
	this._handle = setInterval( this._checkInterfaceAvailablility.bind(this), 1000* networkCheckingFrequency );

}	


Internet.prototype.turnOnServer = function (){
	var that = this;
	this._server = this._app.listen(that._port, function (){
		var host = that._server.address().address;
  		var port = that._server.address()._port;
		console.log('listening at http://%s:%s', host, port);
	})
}

Internet.prototype.sendMessage = function(message,config){
	var ipaddress = config.identifier+':'+this._port;
	this._request.post(
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
	this._onMessageReceived = func;


	
}

Internet.prototype.isAvailable = function (){
	return this._interfaceIsAvailable;
}




Internet.prototype._checkInterfaceAvailablility = function (){
	var that = this;
	require('dns').lookup('google.com',function(err){
		if (err && err.code == 'ENOTFOUND'){
			that._interfaceIsAvailable = false;
		}else{
			that._interfaceIsAvailable = true;
		}
	});
}


Internet.prototype.cleanUp = function (){
	clearInterval(this._handle);
	if (this._server){
		this._server.close();
	}
	delete this;
}


checkImplementsInterface = require(require(process.env.HOME+FILEFINDER).interface);
checkImplementsInterface(Internet,'network_interface');




module.exports = Internet;