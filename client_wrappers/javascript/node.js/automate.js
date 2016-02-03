

var automate_common_wrapper = require('./common/automate_common_wrapper.js');

var files = require(process.env.HOME+"/.files.js");
var SERVER_IDENTIFIER = "localhost";
var SERVER_NETWORK_INTERFACE = "internet";

var messaging = require(files.messaging);
var network = require(files.network);
var message_handler = messaging.message_handler.getMessageHandlerInstance();

var abstract_network = new network.abstract_network(message_handler.feedMessage.bind(message_handler),['internet'],true,true,true);

var send_network_message = function(outbound_message){
	abstract_network.sendMessage(outbound_message,SERVER_IDENTIFIER,SERVER_NETWORK_INTERFACE);
}
var _interface = automate_common_wrapper.get_interface(send_network_message);
message_handler.attachFunctionToMessageType(message_handler.MESSAGETYPES.SERVER_MESSAGES.SERVER_TOPIC_UPDATE,_interface.feed_update_message);

module.exports = _interface;

