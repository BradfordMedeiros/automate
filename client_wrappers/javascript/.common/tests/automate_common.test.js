

var assert = require("assert");
var files = require(process.env.HOME+"/.files.js");

var messaging = require(files.messaging);
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

            automate.update_subscriptions(update);

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

});

/*
describe("automate_common device init test", function(){

});*/
                         