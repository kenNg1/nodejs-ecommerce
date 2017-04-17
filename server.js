var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');

var User = require('./models/user');

var app = express();

// where root is the user and 12345 is the pass
mongoose.connect('mongodb://root:12345@ds161960.mlab.com:61960/ecommerce', function(err){
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

//Middleware
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
// x-www.form-urlencoded only
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);



app.listen(3000, function(err) {
  if (err) throw err;
  console.log("Server is running");
});
