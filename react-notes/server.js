var express  = require('express');
var app      = express(); 
var path = require("path");		
var morgan   = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');				

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev')); 

app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

app.use('/api/notes', require('./server/routes/notes'));

var server = app.listen(3000,function(){
	console.log("Listening on port 3000");
});