
var automate_common = require("./automate_common.js");

var automate_common_wrapper = {};
automate_common_wrapper.get_interface = function(sendout_message){
	var automate = new automate_common(sendout_message);

	var subscription = function(subscription, callback){
		this.handle = automate.add_subscription(subscription, callback);
	};

	subscription.prototype.stop = function(){
		if (this.handle === undefined){
			throw (new Error("handle undefined.  Subscription was never initialized correctly"));
		}
		automate.remove_subscription(this.handle);
	}

	var publication = function(publication){
		this.handle = automate.add_publication(publication);
	};

	publication.prototype.stop = function(){
		if (this.handle === undefined){
			throw (new Error("handle undefined.  Publication was never initialized correctly"));
		}
		automate.remove_publication(this.handle);
	};

	publication.prototype.publish = function(body){
		automate.publish(this.handle, body);
	};

	var automate_feed_message = automate.feed_update_message.bind(automate);
	return {
		subscription: subscription,
		publication: publication,
		view_topic : automate.view_topic.bind(automate),
		view_topic_sync : automate.view_topic_sync.bind(automate),
		feed_update_message: automate_feed_message
	};
};

module.exports = automate_common_wrapper;