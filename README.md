<h1>Welcome to the automate !</h1>

<b>Current Main Functionality </b> <hr> 

Main server is built.  Devices may now subscribe to a topic, and they will receive update messages from any other client who publishes to the device automagically. 
<br>
The idea is you can subscribe to topics and publish to them from any device.  Communication is facilitated by a common server.  A callback with the new topic update is 
automatically called when something publishes to that topic.

<b>Usage</b>
<hr>

<code>
var automate = require('automate'); </code> <br> <code>
var subscriptions = new automate.subscription( &lt;subscription name(s)&gt;, &lt;callback function&gt; ); 
</code>

<hr>
Alternatively you can view the current state of the topic without subscribing by using:
<code>
automate.view_topic(<topic_name>, <callback(x)>) 
</code>
where the callback is called passing in the current state of the topic as x.  
and for publishing: 
<br>
<br>
<code>
var publisher = new automate.publisher( &lt;publication topic name(s)&gt; );
</code> <br>
<code>
publisher.publish ( &lt;topic_update&gt; );  // will be sent out to all devices
</code>
<br> <br>
More functionality to come.

<br><hr>
Next feature:  Implementing a form of logic system where you can say something like -- assuming we have these subscriptions already : "when the <i>temperature > 50</i> and is it night time and the wind_sensor > 20 publish the value "hot breezy night" to topic temperature_description and publish open_door to requested_door_state".  
<br> <hr>
<small><i>The ultimate goal is simpler --> GUI based embedded devices development. <!> It will happen <!> </i></small>
