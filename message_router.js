/**
    This class routes incoming messages and routes them to do the appropriate operations
    based upon the message type.  This way we can avoid having nay of this info in the 
    functional classes and just have this dumb routing system.
**/

// WARNING: dependency:  MessageHandler (singleton)
// we should probably just pass in the message handler 


var events = require('events');
var files = require (process.env.HOME + "/.files.js");
var messaging = require (files.messaging);

var UNSUPPORTED_OPERATION_EXCEPTION = { 
    message: 'This message type does not yet have any functionality attached to it'
};

var UNDEFINED_PARAMETERS_EXCEPTION = function () {
    this.message = "parameters defined incorrectly";
    throw (new Error(this.message));
};

var SERVER_TOPIC_UPDATE_EVENT = "message_router::SERVER_MESSAGES::SERVER_TOPIC_UPDATE_MESSAGE";
var message_control = function ( devicestrapper , network  ) {

    if ( devicestrapper === undefined || network === undefined ){
        throw (new UNDEFINED_PARAMETERS_EXCEPTION ());
    }

    //console.log(messaging)
    this.messagehandler = messaging.message_handler.getMessageHandlerInstance();
    this.event_emitter = new events.EventEmitter;

    this.devicestrapper = devicestrapper;
    this.network = network;

    // functions associating functionality with message types coming from messagehandler
    this.route_devicestrapper(); // @todo pass in parameters to as opposed to it being dependent on state variables
    this.route_network ( network );
    
   
};

message_control.prototype.route_devicestrapper = function (){
    //console.log('routing devicestrapper');

    var that = this;

    /**
        Listens to CLIENT_DEVICE_INIT messages sent from client devices
        Adds the device specified in the message body.
    **/
	this.messagehandler.attachFunctionToMessageType( this.messagehandler.MESSAGETYPES.CLIENT_MESSAGES.CLIENT_DEVICE_INIT, function ( message ){
        //console.log ("CLIENT DEVICE INTI MESSAGE in router");
        var network_interface = message.metadata.network_interface;
        var identifier = message.metadata.identifier;
        var subscriptions = message.body.subscriptions;
        var publications = message.body.publications;
        var config = that.devicestrapper.createConfig (identifier, network_interface, subscriptions, publications);
        that.devicestrapper.addDevice(config);

        console.log("adding device")
        console.log("identifier: ");
        console.log(message.metadata.identifier)

    });

    /**
        Listens to REMOVE_DEVICE messages sent from client devices
        Removes the device specified by the message body
    **/
    this.messagehandler.attachFunctionToMessageType( this.messagehandler.MESSAGETYPES.CLIENT_MESSAGES.REMOVE_DEVICE, function ( message ){
        //console.log ("REMOVE DEVICE MESSAGE in router");

        var identifier = message.metadata.identifier;
        that.devicestrapper.removeDevice(identifier);
    });

    /**
        Listens to TOPIC_UPDATE messages sent from client devices
        Sends server TOPIC_UPDATE message to the messagehandler
        Idea is that anything listening to this type of message will act on that.
        This does not actually sent topics outbound.  Something else capable of doing that
        should attach itself to the message type (messagehandler.attachFunctionTo...) and
        do it there.  Prefer that method to event emitters.  Emitters should be used between
        'bigger' parts of the program (although honestly maybe we should just scope the event emitter
        down and switch to that? -- but this way implies more message safety checking from the message handler class)
    **/
    this.messagehandler.attachFunctionToMessageType ( this.messagehandler.MESSAGETYPES.CLIENT_MESSAGES.TOPIC_UPDATE, function( message ){
        //console.log ('CLIENT TOPIC UPDATE MESSAGE in router');


        var topics = message.body.topics;

        // @todo we should check valid publications, and device what to do on invalid update
        // initial thoughts are just to discard and send a message saying you did it wrong back

        //that.devicestrapper.is_valid_update(message.identifier);
        var update_topics =   that.devicestrapper.get_update_messages(topics);
        for ( var identifier in update_topics ){
            //console.log(identifier);
            //console.log(update_topics[identifier]);
            var outgoing_topic_update = that.messagehandler.getMessageBuilder(that.messagehandler.MESSAGETYPES.SERVER_MESSAGES.SERVER_TOPIC_UPDATE).setTopics(update_topics[identifier] ).build();
            outgoing_topic_update.metadata.identifier = identifier;
            outgoing_topic_update.metadata.network_interface = that.devicestrapper.get_network_interface(identifier);
            //console.log(outgoing_topic_update);
            that.event_emitter.emit( SERVER_TOPIC_UPDATE_EVENT, outgoing_topic_update);
        }
      
    });

    /**
        @todo Services are not yet implemented.  Complete this when it is added.
    **/
    this.messagehandler.attachFunctionToMessageType ( this.messagehandler.MESSAGETYPES.CLIENT_MESSAGES.SERVICE_REQUEST,function(){
        throw (new UNSUPPORTED_OPERATION_EXCEPTION());
    });
};


message_control.prototype.route_network = function ( network ){

    this.event_emitter.on( SERVER_TOPIC_UPDATE_EVENT, function ( message){
        console.log("SERVER TOPIC UPDATE ");
        console.log("sending to ");
        console.log("identifier:  "+message.metadata.identifier);
        console.log("interface:   "+message.metadata.network_interface);
        network.sendMessage(message, message.metadata.identifier, message.metadata.network_interface);
    });

};

module.exports = message_control;
