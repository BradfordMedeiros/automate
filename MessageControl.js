// if this ever gets complicated we can consider making each function a class
// and just instantiating a bunch of these classes
var message_control = function ( devicestrapper ) {
	var messagehandler = (new (new require((require(process.env.HOME+'/.files.js')).messagehandler))).getMessageHandlerInstance();
	this.devicestrapper = devicestrapper;
    
   
}

message_control.prototype.route_devicestrapper = function (){
	 messagehandler.attachFunctionToMessageType( messagehandler.MESSAGETYPES.CLIENT_MESSAGES.CLIENT_DEVICE_INIT, function ( message ){
        console.log(message)
        var network_interface = message.metadata.network_interface;
        var identifier = message.metadata.identifier;
        var subscriptions = message.body.subscriptions;
        var publications = message.body.publications;
        var config = this.devicestrapper.createConfig (identifier, network_interface, subscriptions, publications);
        this.devicestrapper.addDevice(config);
    });
}

module.exports = message_control;