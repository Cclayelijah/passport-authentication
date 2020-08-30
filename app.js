var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');

// Express
var app = express();

// DB Config
var db = require('./config/keys').MongoURI;
// Connect to Mongo
mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(function() { console.log('MongoDB Connected...'); })
  .catch(function(err) { console.log(err); });

// ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(session({
  secret: 'my secret',
  resave: true,
  saveUninitialized: true
}));

// Connect flash
app.use(flash());

// Global vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

var PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("Server started on port " + PORT));