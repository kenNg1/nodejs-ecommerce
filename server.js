var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
//mongodb is depending on session... login part 1, 2min 30
var MongoStore = require('connect-mongo/es5')(session);
var passport = require('passport');

var secret = require('./config/secret');
var User = require('./models/user');

var app = express();

// where root is the user and 12345 is the pass
mongoose.connect(secret.database, function(err){
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
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUnitialized: true,
  //random secret thing
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database, autoReconnect: true })
}));
app.use(flash());
app.use(passport.initialize());
//acts as a middleware to alter the request object and change the user value that is currently the session id from client cookie into the true deserialised user object
app.use(passport.session());
//every route will have this user object by default
app.use(function(req,res,next){
  res.locals.user = req.user;
  next();
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);



app.listen(secret.port, function(err) {
  if (err) throw err;
  console.log("Server is running on port " + secret.port);
});
