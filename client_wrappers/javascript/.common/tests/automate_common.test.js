

var assert = require("assert");
var files = require(process.env.HOME+"/.files.js");

var messaging = require(files.messaging);
var message_handler = messaging.message_handler.getMessageHandlerInstance();
var automate_common = require("../automate_common.js");

describe ("subscription tests",function(){


        it ("returns null when get subscriptions before any added ",function(){
			var automate = new automate_common(function(){});
        	var subscriptions = automate.get_subscriptions();
        	assert.deepEqual(subscriptions,[]);
        });

      	automate = new automate_common(function(){});
        it ("get_subscriptions returns the field names of the aggregate of subscriptions added",function(){
			var automate = new automate_common(function(){});
        	automate.add_subscription(['fire','ice'],function(){});
        	automate.add_subscription(['fire','ice'],function(){});
        	automate.add_subscription(['fire','ice'],function(){});
        	var subscriptions = automate.get_subscriptions();
        	assert.equal(subscriptions.length, 2);
        });


        it ("remove_subscription successfully removes subscriptions", function (){
        	var automate = new automate_common(function(){});
        	automate.add_subscription(['fire','cold'],function(){});
        	var handle1 = automate.add_subscription(['fire','ice','flames'],function(){});
        	automate.remove_subscription(handle1);
        	
        	var subscriptions = automate.get_subscriptions();
        	var contains_fire_and_cold = (subscriptions.indexOf("cold") > -1) && (subscriptions.indexOf("fire") > -1);
        	assert.equal(contains_fire_and_cold, true);

        	var count1 = automate.get_subscription_count();
        	assert.equal(count1,1);

        	var handle2 = automate.add_subscription(["cold","warm"],function(){});
        	automate.add_subscription("cold",function(){});
        	var count2 = automate.get_subscription_count();
        	assert.equal(count2,3);

        	automate.remove_subscription(handle2);
        	assert.equal(automate.get_subscription_count(),2);

        	var contains_fire_and_cold2 = (subscriptions.indexOf("cold") > -1) && (subscriptions.indexOf("fire") > -1);
        	assert.equal(contains_fire_and_cold2, true);

        	var not_contain_warm = (automate.get_subscriptions().indexOf("warm") < 0);
        	assert.equal(not_contain_warm,true);
        });

        it ("get count returns the proper number of subscriptions, one for each proto subscription (one for each callback)",
            function(){
                var automate = new automate_common(function(){});
                var handle = automate.add_subscription("fire", function(){});
                automate.add_subscription(["fire","ice"], function(){});
                assert.equal(automate.get_subscription_count(), 2);

                automate.remove_subscription(handle);
                assert.equal(automate.get_subscription_count(),1);       
        });

        it ("properly updates the subscriptions calling the proper callbacks given a topic update",function(){
            var automate = new automate_common(function(){});
            
            var values = {
                fire: undefined,
                ice: undefined
            };

            var values_other = {
                fire: undefined,
                water: undefined
            };

            var update = {
                fire: 145,
                ice: 349,
                water: "hello world"
            };


            automate.add_subscription(["fire","ice"], function(update){
                values.fire = update.fire;
                values.ice = update.ice;
            });

            automate.add_subscription(["fire","water"], function(update){
                values_other.fire = update.fire;
                values_other.water = update.water;
            });


            update_message = message_handler.getMessageBuilder(
                message_handler.MESSAGETYPES.SERVER_MESSAGES.SERVER_TOPIC_UPDATE).setTopics(update).build();
            automate.feed_update_message(update_message);

            assert.equal(values.fire, 145);
            assert.equal(values.ice, 349);
            assert.equal(values_other.fire,145);
            assert.equal(values_other.water,"hello world");
        });
});

describe("publication tests", function(){

    it ("returns null when get_publications before any added",function(){
        var automate = new automate_common(function(){});
        var publications = automate.get_publications();
        assert.deepEqual(publications,[]);

    });

    it ("get_publications returns the field names of the aggregate of publications added",function(){
        var automate = new automate_common(function(){});
        automate.add_publication(["fire","ice"]);
        automate.add_publication(["fire","ice"]);
        automate.add_publication(["fire","water"]);
        var publications = automate.get_publications();
        assert.equal(publications.length,3);
    });

    it ("remove_publications successfully removes publications",function(){
        var automate = new automate_common(function(){});
        automate.add_publication(['fire','cold']);
        var handle1 = automate.add_publication(['fire','ice','flames']);
        automate.remove_publication(handle1);
            
        var publications = automate.get_publications();
        var contains_fire_and_cold = (publications.indexOf("cold") > -1) && (publications.indexOf("fire") > -1);
        assert.equal(contains_fire_and_cold, true);

        var count1 = automate.get_publication_count();
        assert.equal(count1,1);

        var handle2 = automate.add_publication(["cold","warm"]);
        automate.add_publication("cold");
        var count2 = automate.get_publication_count();
        assert.equal(count2,3);

        automate.remove_publication(handle2);
        assert.equal(automate.get_publication_count(),2);

        var contains_fire_and_cold2 = (publications.indexOf("cold") > -1) && (publications.indexOf("fire") > -1);
        assert.equal(contains_fire_and_cold2, true);

        var not_contain_warm = (automate.get_publications().indexOf("warm") < 0);
        assert.equal(not_contain_warm,true);

    });

    it ("get count returns the proper number of publications, one for each proto publication (one for each call to add publication)", function(){
        var automate = new automate_common(function(){});
        var handle = automate.add_publication("fire", function(){});
        automate.add_publication(["fire","ice"], function(){});
        assert.equal(automate.get_publication_count(), 2);

        automate.remove_publication(handle);
        assert.equal(automate.get_publication_count(),1);  
    });

    it ("publisher publishes the topics to the send function",function(){
        
        var send_proxy_called = 0;
        var send_proxy = function(outbound_message){
            if (send_proxy_called === 1){
              assert.equal(outbound_message.messagename,"TOPIC_UPDATE");
            }
            send_proxy_called = send_proxy_called + 1;
        };
        var automate = new automate_common(send_proxy);
        var handle = automate.add_publication("fire");

        automate.publish(handle,{fire:10});
        assert.equal(send_proxy_called,2);
        
    });

    it ("throws and error when publisher does not have permission",function(){
        var automate = new automate_common(function(){});
        var handle = automate.add_publication("fire");

        var throws_error0 = false;
        try{
            automate.publish(handle,{ water: 10});
        }catch(e){
            throws_error0 = true;
        }

        var throws_error1 = false;
        try{
            automate.publish(handle,{fire:10});
        }catch(e){
            throws_error1 = true;
        }
        assert.equal(throws_error0,true);
        assert.equal(throws_error1, false);
    });

});

describe("automate_common device init test", function(){
    it ("calls the send function when it updates its publications",function(){
        
        var count = 0;
        var send_function = function(){
            count = count+1;
        }

        var automate = new automate_common(send_function);
        automate.add_publication("fire");
        assert.equal(count,1);

    });

    it ("calls the send function when it updates its subscriptions",function(){
        var count = 0;
        var send_function = function(){
            count = count+1;
        }

        var automate = new automate_common(send_function);
        automate.add_publication("fire");
        assert.equal(count,1);
    });

    it ("sends a client device init message when it update", function(){
     
        var called_count = 0;
        var send_function = function(x){
            assert.equal(x.messagename,"CLIENT_DEVICE_INIT");
            called_count = called_count + 1;
        }

        var automate = new automate_common(send_function);
        automate.add_publication("fire");
        automate.add_subscription(["water","liquid"],function(){});
        assert.equal(called_count, 2);
    });
});
                         