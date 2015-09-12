FILEFINDER = '/.files'


var Internet = function ( ){


	var networkCheckingFrequency = require((require(process.env.HOME+FILEFINDER)).options).interface_refresh_speed;
	this._onMessageReceived = undefined;
	this._interfaceIsAvailable = undefined;
	this._checkInterfaceAvailablility();
	this._request = require('request');
	this._express = require('express');
	this._app = this._express();

	var bodyParser = require("body-parser");
	this._app.use(bodyParser())
	this.inbound_on = undefined;
	this.outbound_on = undefined;

	var that = this;

	


	// this needs to parse the body and get the message out of it, and then pass that up
	this._app.post('/',function(req,res){
		var func = that.getOnMessageRecieved();
		if (typeof(func) != 'function'){
			throw (new Error ('func should always be type function: func = ')+func);
		}

		console.log('got a request');
		res.send('OK')
		func (req.body);
	});
	

	this._port = require(require(process.env.HOME+FILEFINDER).options).request_port;
	this._server = undefined;
	this._handle = setInterval( this._checkInterfaceAvailablility.bind(this), 1000* networkCheckingFrequency );
}	

Internet.prototype.getOnMessageRecieved = function () {
	return this._onMessageReceived;
}

Internet.prototype.turn_on_interface = function ( inbound, outbound ){
	var that = this;
	this.inbound_on = inbound;
	this.outbound_on = outbound;

	if ( !inbound ){
		return;
	}

	this._server = this._app.listen(that._port, function (){
		if (that._server.address() == null){
			return;
		}
		var host = that._server.address().address;
  		var port = that._port;
		console.log('listening at http://%s:%s', host, port);
	})
}

Internet.prototype.sendMessage = function(message,config){
	if ( !this.outbound_on ){
		return;
	}

	if (message ==undefined || config == undefined){
		throw (new Error('Parameters incorrectly defined in Internet::sendMessage'));
	}
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
	console.log('setting on message receieved');
	console.log('on message receieved:  '+func);

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


Internet.prototype.deload = function (){
	clearInterval(this._handle);
	if (this._server){
		this._server.close();
	}
	delete this;
}


checkImplementsInterface = require(require(process.env.HOME+FILEFINDER).interface);
checkImplementsInterface(Internet,'network_interface');


module.exports = Internet;