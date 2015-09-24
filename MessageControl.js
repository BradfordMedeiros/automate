// if this ever gets complicated we can consider making each function a class
// and just instantiating a bunch of these classes
var UNSUPPORTED_OPERATION_EXCEPTION = { 
    message: 'This message type does not yet have any functionality attached to it'
};

var message_control = function ( devicestrapper ) {
	this.messagehandler = (new (new require((require(process.env.HOME+'/.files.js')).messagehandler))).getMessageHandlerInstance();
	this.devicestrapper = devicestrapper;
    this.route_devicestrapper();
    
   
}

message_control.prototype.route_devicestrapper = function (){

    var that = this;
	this.messagehandler.attachFunctionToMessageType( this.messagehandler.MESSAGETYPES.CLIENT_MESSAGES.CLIENT_DEVICE_INIT, function ( message ){
        var network_interface = message.metadata.network_interface;
        var identifier = message.metadata.identifier;
        var subscriptions = message.body.subscriptions;
        var publications = message.body.publications;
        var config = that.devicestrapper.createConfig (identifier, network_interface, subscriptions, publications);
        that.devicestrapper.addDevice(config);
    });

    this.messagehandler.attachFunctionToMessageType( this.messagehandler.MESSAGETYPES.CLIENT_MESSAGES.REMOVE_DEVICE, function ( message ){
        var identifier = message.metadata.identifier;
        that.devicestrapper.removeDevice(identifier);
    });

    this.messagehandler.attachFunctionToMessageType ( this.messagehandler.MESSAGETYPES.CLIENT_MESSAGES.TOPIC_UPDATE, function( message ){
        var topics = message.body;
        that.devicestrapper.update_topics(topics);
    });

    this.messagehandler.attachFunctionToMessageType ( this.messagehandler.MESSAGETYPES.CLIENT_MESSAGES.SERVICE_REQUEST,function(){
        throw (new UNSUPPORTED_OPERATION_EXCEPTION);
    });
}

module.exports = message_control;