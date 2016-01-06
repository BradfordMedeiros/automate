

var assert = require("assert");
var automate_common = require("../automate_common.js");
var publication_manager = new automate_common.publication_manager();

describe ("publication tests",function(){


        it ("returns null when get subscriptions before any added ",function(){
			var subscription_manager = new automate_common.subscription_manager();
        	var subscriptions = subscription_manager.get_subscriptions();
        	assert.deepEqual(subscriptions,[]);
        });

      	subscription_manager = new automate_common.subscription_manager();
        it ("returns the field names of the aggregate of subsriptions added",function(){
			var subscription_manager = new automate_common.subscription_manager();
        	subscription_manager.add_subscription(['fire','ice'],function(){});
        	subscription_manager.add_subscription(['fire','ice'],function(){});
        	subscription_manager.add_subscription(['fire','ice'],function(){});
        	var subscriptions = subscription_manager.get_subscriptions();
        	assert.equal(subscriptions.length, 2);
        });


        it ("successfully removes subscriptions", function (){
        	var subscription_manager = new automate_common.subscription_manager();
        	subscription_manager.add_subscription(['fire','cold'],function(){});
        	var handle1 = subscription_manager.add_subscription(['fire','ice','flames'],function(){});
        	subscription_manager.remove_subscription(handle1);
        	
        	var subscriptions = subscription_manager.get_subscriptions();
        	var contains_fire_and_cold = (subscriptions.indexOf("cold") > -1) && (subscriptions.indexOf("fire") > -1);
        	assert.equal(contains_fire_and_cold, true);

        	var count1 = subscription_manager.get_count();
        	assert.equal(count1,1);

        	var handle2 = subscription_manager.add_subscription(["cold","warm"],function(){});
        	subscription_manager.add_subscription("cold",function(){});
        	var count2 = subscription_manager.get_count();
        	assert.equal(count2,3);

        	subscription_manager.remove_subscription(handle2);
        	assert.equal(subscription_manager.get_count(),2);

        	var contains_fire_and_cold2 = (subscriptions.indexOf("cold") > -1) && (subscriptions.indexOf("fire") > -1);
        	assert.equal(contains_fire_and_cold2, true);

        	var not_contain_warm = (subscription_manager.get_subscriptions().indexOf("warm") < 0);
        	assert.equal(not_contain_warm,true);
        });




     

});
                         