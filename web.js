var express = require('express'),
	fs      = require('fs');
	
var app = express();
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use("/css", express.static(__dirname + '/css'));
app.use("/js" , express.static(__dirname  + '/js'));

app.get('/', function(req, response){
  var data = require('./hawkersSG.json');
  response.render('index.ejs', data);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
