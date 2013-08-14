var express = require('express'),
	fs      = require('fs');
	
var app = express();
app.use(express.static(__dirname + '/'));
app.get('/', function(req, response){
  var data = fs.readFileSync('map.html').toString();
  response.send(data)
});

app.listen(3000);