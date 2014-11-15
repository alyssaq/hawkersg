var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan  = require('morgan');
var compression = require('compression');
var fs  = require('fs')
var app = express();

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(compression());
app.use(cors({
  origin: '*',
  methods: ['GET, PUT, POST, DELETE, OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


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
