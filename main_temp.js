
var FILEFINDER = '/.files';
var files = require(process.env.HOME+FILEFINDER);

var func = function(x){
	console.log(x);
}


var events = require ('events');
process.eventEmitter = new events.EventEmitter();
var stuff = {

	messagehandler : new (require(files.messagehandler)),
	abstractnetwork : new (require(files.abstractnetwork))(func)

}


module.exports = stuff;






