FILEFINDER = '/.files';


var Internet = function ( is_client ){

	if ( is_client === undefined ){
		throw (new Error("must define internet as client or not"));
	}

	var networkCheckingFrequency = require((require(process.env.HOME+FILEFINDER)).options).interface_refresh_speed;
	this._onMessageReceived = undefined;
	this._interfaceIsAvailable = undefined;
	this._checkInterfaceAvailablility();
	this._request = require('request');
	this._express = require('express');
	this._app = this._express();
	this._is_client = is_client;

	var bodyParser = require("body-parser");
	this._app.use(bodyParser());
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
		console.log(req.body);
		res.send('OK');

		if (req.body !== undefined && req.body.metadata !==undefined){
			req.body.metadata.network_interface = that.get_network_id();
			req.body.metadata.identifier = req.connection.remoteAddress;
			func (req.body);
		}else{
			console.log("message discarded, invalid");
		}
	
	});
	
	if ( this._is_client ){
		this._port = require(require(process.env.HOME+FILEFINDER).options).request_port_client;
	}else{
		this._port = require(require(process.env.HOME+FILEFINDER).options).request_port_server;
	}

	if ( this._is_client){
		this._outbound_request_port = require(require(process.env.HOME+FILEFINDER).options).outbound_request_port_client;
	}
	else{
		this._outbound_request_port = require(require(process.env.HOME+FILEFINDER).options).outbound_request_port_server;
	}
	this._server = undefined;
	this._handle = setInterval( this._checkInterfaceAvailablility.bind(this), 1000* networkCheckingFrequency );
};	

Internet.prototype.getOnMessageRecieved = function () {
	return this._onMessageReceived;
};

Internet.prototype.turn_on_interface = function ( inbound, outbound ){
	var that = this;
	this.inbound_on = inbound;
	this.outbound_on = outbound;

	if ( !inbound ){
		return;
	}

	this._server = this._app.listen(that._port, function (){
		if (that._server.address() === null){
			return;
		}
		var host = that._server.address().address;
  		var port = that._port;
		console.log('listening at http://%s:%s', host, port);
		console.log("internet interface loaded");
	});
};

Internet.prototype.send_message = function(message, identifier ){
	if ( !this.outbound_on ){
		return;
	}

	if (message === undefined || identifier === undefined){
		throw (new Error('Parameters incorrectly defined in Internet::sendMessage'));
	}
	var ipaddress = 'http://'+identifier+':'+this._outbound_request_port;
	this._request.post(
		ipaddress,
    	{ 
    		json:  message  
    	},
    	function (error, response, body) {
    		console.log("callback for send message");
        	console.log('error:  '+error);				// should figure out what
        	console.log('response: '+JSON.stringify(response));			// we want to do here
        	console.log('body:  '+body);
    	}
	);
};



Internet.prototype.get_network_id = function (){
	return 'internet';
};

Internet.prototype.set_on_message_received = function( func ){
	console.log('setting on message receieved');
	console.log('on message receieved:  '+func);

	this._onMessageReceived = func;
};

Internet.prototype.is_available = function (){
	return this._interfaceIsAvailable;
};




Internet.prototype._checkInterfaceAvailablility = function (){
	var that = this;
	require('dns').lookup('google.com',function(err){
		if (err && err.code == 'ENOTFOUND'){
			that._interfaceIsAvailable = false;
		}else{
			that._interfaceIsAvailable = true;
		}
	});
};


Internet.prototype.deload = function (){
	clearInterval(this._handle);
	if (this._server){
		this._server.close();
	}
	console.log ("internet interface deloaded");
};


module.exports = Internet;
