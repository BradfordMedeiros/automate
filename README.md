<h1>Welcome to the automate !</h1>

<b>Current Main Functionality </b> <hr> 

Main server is built.  Devices may now subscribe to a topic, and they will receive update messages from any other client who publishes to the device automagically. 

<br>
<b>Next Main Functionality </b> <hr> 
Work more on the device side.  Make the client API easy to understand and use.  I want to make something like this from a use case perspective (Node.js support first -- other devices/languages later): 

<code>
var automate = require('automate'); </code> <br> <code>
var subscriptions = new automate.subscription( <subscription name(s)>, <callback function> ); 
</code>

and for publishing: 
<br>
<br>
<code>
var publisher = new automate.publisher( <publication topic name(s)>);
</code> <br>
<code>
publisher.publish ( topic_update );  // will be sent out to all devices
</code>
<br> <br>
So this should be simple enough. This all exists on backend, just needs to be friendly from a programmer perspective. More functionality to come.
<br> <hr>
<small><i>The ultimate goal is simpler --> GUI based embedded devices development. <!> It will happen <!> </i></small>
