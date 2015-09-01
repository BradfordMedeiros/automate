
var FILEFINDER = './files';
/**
	This is the warehouse for topics.  It acts as the store for all current topic information.  It knows nothing about the devices.
	It stores information, and creates triggers to call functions when certain conditions are met.

	Triggers are called when the evaluation function acts upon the data. 
**/ 
var topic_manager = function (){

	this.triggerHandleCount = 0;
	this.trigger_eval_period = (require((require(process.env.HOME+FILEFINDER)).options)).trigger_eval_period;

	var collections = require('collection');
	this.managedTopics = new collections.Set();
	this.topics =  { };
	this.triggers = new Array();

	setInterval(this.processTriggers, this.trigger_eval_period).bind(this);

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
	THIS MAYBE SHOULD BE A MESSAGE AND WE JUST MAKE SURE THE MESSAGE TYPE IS RIGHT****************************
	@todo decide whether to make this a single message (i think so right now but lets decide)
**/
topic_manager.prototype.topicReceived = function (topic_name, data){
	this.topics[topic_name] = data;

	// we only add if it is a managed topic, otherwise who cares
	if (this.managedTopics.has(topic_name)){
		this.topics[topic_name] = data;
	}
}

// send out triggers for messages which invoke trigger action
topic_manager.prototype.processTriggers = function (){

}


/**
	Add a new trigger to the manager.  If the evaluation function is true, a callback is called.  
	Evaluation occurs when a new topic is fed.  

	Return a handle to the trigger back
**/
//'humidity:<:undefined&temperature:>:30'
//topic_manager.createTrigger(humidity).greaterThan(30).do(callback).do(callback2);


var count = 0 ;
var _trigger = function (topicname,topic_manager){
	var that  = this;
	this.evaluation = new Array();
	this.topicname = topicname;
	this.topic_manager = topic_manager;
	this.handle = count;
	count = count + 1;

	this.public = {
		equals:  function (value){
			that.evaluation.push({
				operator: '==',
				value: value
			});
			return this;
		},

		greaterThan: function ( value ){
			that.evaluation.push({
				operator: '>',
				value: value
			});
			return this;
		},

		lessThan: function ( value ){
			that.evaluation.push({
				operator: '<',
				value: value
			});
			return this;
		},

		// check to make sure topics are valid
		equalsTopic: function (topic_name){
			if (that.topic_manager.managedTopics[topic_name == undefined){
				throw (new Error('topic must be added to monitor list.  Call TopicManager.addTopicsToMonitor if you wish to compare to this field'))
			}
			that.evaluation.push({
				operator: '==',
				topic: topic_name
			});
			return this;
		},

		greaterThanTopic: function (topic_name){
			if (that.topic_manager.managedTopics[topic_name == undefined){
				throw (new Error('topic must be added to monitor list.  Call TopicManager.addTopicsToMonitor if you wish to compare to this field'))
			}
			that.evaluation.push ({
				operator: '>',
				topic: topic_name
			});
			return this;
		},

		lessThanTopic: function (topic_name){
			if (that.topic_manager.managedTopics[topic_name == undefined){
				throw (new Error('topic must be added to monitor list.  Call TopicManager.addTopicsToMonitor if you wish to compare to this field'))
			}
			that.evaluation.push({
				operator: '<',
				topic: topic_name
			});
			return this;
		},

		do: function (func){
			if (typeof(func) != 'function'){
				throw (new Error('do must be a function'));
			}
			that.evaluation.push({
				operator: 'do',
				func: func
			});
			return this;
		},

		install : function( callback ) {
			that.topic_manager.triggers[this.handle] = {
				evaluation: that.evaluation,
				callback: callback
			};
			return this.trigger_handle;
		}

	}
}



topic_manager.prototype.createTrigger = function ( topicname ){
	return (new _trigger(topicname,this)).public;
}




topic_manager.prototype.removeTrigger = function ( trigger_handle ){
	delete this.triggers[trigger_handle];
}

module.exports = topic_manager;






