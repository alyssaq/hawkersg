var express = require('express'),
	fs      = require('fs');
	
var app = express();
app.use("/css", express.static(__dirname + '/css'));
app.get('/', function(req, response){
  var data = fs.readFileSync('map.html').toString();
  response.send(data)
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});