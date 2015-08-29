
/**
	This is the warehouse for topics.  It acts as the store for all current topic information.  It knows nothing about the devices.
	It stores information, and creates triggers to call functions when certain conditions are met.

	Triggers are called when the evaluation function acts upon the data. 
**/ 
var topic_manager = function (){

	this.triggerHandleCount = 0;

	var collections = require('collection');
	this.managedTopics = new collections.Set();
	this.topics =  { };
	this.triggers = new Array();


}

/**
	We only monitor topics which are added to the topic manager
**/
topic_manager.prototype.addTopicsToMonitor = function (topics){
	if (Array.isArray(topics)){
		for (var i = 0 ; i < topics.length ; i++ ){
			this.managedTopics.add(topics[i]);
		}
	}else{
		this.managedTopics.add(topics);
	}
}

/**
	Call when a new topic is published from a device.  
**/
topic_manager.prototype.topicReceived = function (topicname, data){
	this.topics[topicname] = data;



}


/**
	Add a new trigger to the manager.  If the evaluation function is true, a callback is called.  
	Evaluation occurs when a new topic is fed.  

	Return a handle to the trigger back
**/
'humidity:<:undefined&temperature:>:30'
topic_manager.createTrigger(humidity).greaterThan(30).do(callback).do(callback2);


var _trigger = function (topicname,topic_manager){
	this.evaluation = new Array();
	this.topicname = topicname;
}


_trigger.prototype.equals = function ( value ){
	this.evaluation.push(function(){
		return topic_manager.topics[this.topicname] == value;
	})

}
_trigger.prototype.greaterThan = function ( value ){

}

_trigger.prototype.lessThan = function ( value ){

}

_trigger.prototype.greaterThanTopic = function ( topic ){

}

_trigger.prototype.lessThanTopic = function ( topic ){

}
_trigger.prototype.equalsTopic = function( topic ){

}

_trigger.prototype.do = function (func){
	
}

_trigger.prototype.install= function (){
	topic_manager.push(this);
}




topic_manager.prototype.createTrigger = function ( topicname ){
	return (new trigger(topicname,this));
}



topic_manager.prototype.addTrigger = function ( callback, evaluation_function ){

}



topic_manager.prototype.removeTrigger = function ( trigger_handle ){
	delete this.triggers[triggerHandleCount];
}

module.exports = topic_manager;






