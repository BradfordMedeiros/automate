var express = require('express');
var app = express();

app.get('', function (req, res) {
	console.log('hello')
  console.log(req)
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  var host = '127.0.0.1';
  var port = 80;

  console.log('Example app listening at http://%s:%s', host, port);
});