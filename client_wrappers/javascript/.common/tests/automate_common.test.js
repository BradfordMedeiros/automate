

var assert = require("assert");
var automate_common = require("../automate_common.js");
var publication_manager = new automate_common.publication_manager();

describe ("subscription tests",function(){


        it ("returns null when get subscriptions before any added ",function(){
			var subscription_manager = new automate_common.subscription_manager();
        	var subscriptions = subscription_manager.get_subscriptions();
        	assert.deepEqual(subscriptions,[]);
        });

      	subscription_manager = new automate_common.subscription_manager();
        it ("get_subscriptions returns the field names of the aggregate of subscriptions added",function(){
			var subscription_manager = new automate_common.subscription_manager();
        	subscription_manager.add_subscription(['fire','ice'],function(){});
        	subscription_manager.add_subscription(['fire','ice'],function(){});
        	subscription_manager.add_subscription(['fire','ice'],function(){});
        	var subscriptions = subscription_manager.get_subscriptions();
        	assert.equal(subscriptions.length, 2);
        });


        it ("remove_subscription successfully removes subscriptions", function (){
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

        it ("get count returns the proper number of subscriptions, one for each proto subscription (one for each callback)",
            function(){
                var subscription_manager = new automate_common.subscription_manager();
                var handle = subscription_manager.add_subscription("fire", function(){});
                subscription_manager.add_subscription(["fire","ice"], function(){});
                assert.equal(subscription_manager.get_count(), 2);

                subscription_manager.remove_subscription(handle);
                assert.equal(subscription_manager.get_count(),1);       
        });

        it ("properly updates the subscriptions calling the proper callbacks given a topic update",function(){
            var subscription_manager = new automate_common.subscription_manager();
            
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



            subscription_manager.add_subscription(["fire","ice"], function(update){
                values.fire = update.fire;
                values.ice = update.ice;
            });

            subscription_manager.add_subscription(["fire","water"], function(update){
                values_other.fire = update.fire;
                values_other.water = update.water;
            });

            subscription_manager.update_subscriptions(update);

            assert.equal(values.fire, 145);
            assert.equal(values.ice, 349);
            assert.equal(values_other.fire,145);
            assert.equal(values_other.water,"hello world");



        });
});

describe("publication tests", function(){

    it ("returns null when get_publications before any added",function(){
        var publication_manager = new automate_common.publication_manager();
        var publications = publication_manager.get_publications();
        assert.deepEqual(publications,[]);

    });

    it ("get_publications returns the field names of the aggregate of publications added",function(){
        var publication_manager = new automate_common.publication_manager();
        publication_manager.add_publication(["fire","ice"]);
        publication_manager.add_publication(["fire","ice"]);
        publication_manager.add_publication(["fire","water"]);
        var publications = publication_manager.get_publications();
        assert.equal(publications.length,3);
    });

    it ("remove_publications successfully removes publications",function(){
        var publication_manager = new automate_common.publication_manager();
        publication_manager.add_publication(['fire','cold']);
        var handle1 = publication_manager.add_publication(['fire','ice','flames']);
        publication_manager.remove_publication(handle1);
            
        var publications = publication_manager.get_publications();
        var contains_fire_and_cold = (publications.indexOf("cold") > -1) && (publications.indexOf("fire") > -1);
        assert.equal(contains_fire_and_cold, true);

        var count1 = publication_manager.get_count();
        assert.equal(count1,1);

        var handle2 = publication_manager.add_publication(["cold","warm"]);
        publication_manager.add_publication("cold");
        var count2 = publication_manager.get_count();
        assert.equal(count2,3);

        publication_manager.remove_publication(handle2);
        assert.equal(publication_manager.get_count(),2);

        var contains_fire_and_cold2 = (publications.indexOf("cold") > -1) && (publications.indexOf("fire") > -1);
        assert.equal(contains_fire_and_cold2, true);

        var not_contain_warm = (publication_manager.get_publications().indexOf("warm") < 0);
        assert.equal(not_contain_warm,true);

    });

    it ("get count returns the proper number of publications, one for each proto publication (one for each call to add publication)", function(){
        var publication_manager = new automate_common.publication_manager();
        var handle = publication_manager.add_publication("fire", function(){});
        publication_manager.add_publication(["fire","ice"], function(){});
        assert.equal(publication_manager.get_count(), 2);

        publication_manager.remove_publication(handle);
        assert.equal(publication_manager.get_count(),1);  
    });

});
                         