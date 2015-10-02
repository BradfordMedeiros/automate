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
    console.log('routing devicestrapper');

    var that = this;
	this.messagehandler.attachFunctionToMessageType( this.messagehandler.MESSAGETYPES.CLIENT_MESSAGES.CLIENT_DEVICE_INIT, function ( message ){
        console.log ("CLIENT DEVICE INTI MESSAGE in router");
        var network_interface = message.metadata.network_interface;
        var identifier = message.metadata.identifier;
        var subscriptions = message.body.subscriptions;
        var publications = message.body.publications;
        var config = that.devicestrapper.createConfig (identifier, network_interface, subscriptions, publications);
        that.devicestrapper.addDevice(config);
    });

    this.messagehandler.attachFunctionToMessageType( this.messagehandler.MESSAGETYPES.CLIENT_MESSAGES.REMOVE_DEVICE, function ( message ){
        console.log ("REMOVE DEVICE MESSAGE in router");

        var identifier = message.metadata.identifier;
        that.devicestrapper.removeDevice(identifier);
    });

    this.messagehandler.attachFunctionToMessageType ( this.messagehandler.MESSAGETYPES.CLIENT_MESSAGES.TOPIC_UPDATE, function( message ){
        console.log ('CLIENT TOPIC UPDATE MESSAGE in router');


        var topics = message.body;

        // @todo we should check valid publications, and device what to do on invalid update
        // initial thoughts are just to discard and send a message saying you did it wrong back

        //that.devicestrapper.is_valid_update(message.identifier);
        var update_topics =   that.devicestrapper.get_update_messages(topics);
        for ( identifier in update_topics ){
            console.log(identifier);
            console.log(update_topics[identifier]);
        }
      
    });

    this.messagehandler.attachFunctionToMessageType ( this.messagehandler.MESSAGETYPES.CLIENT_MESSAGES.SERVICE_REQUEST,function(){
        throw (new UNSUPPORTED_OPERATION_EXCEPTION);
    });
}

module.exports = message_control;