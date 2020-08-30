var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

// User model
var User = require('../models/User');

// Login Page
router.get('/login', function(req, res) { res.render('login'); });

// Register Page
router.get('/register', function(req, res) { res.render('register'); });

// Register Handle
router.post('/register', function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;
  var errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  //Check pass length
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      password: password,
      password2: password2
    });
  } else { // validation passed
    User.findOne({ email: email }) //returns promise
      .then(function(user) {
        if (user) { // user exists
          errors.push({ msg: 'Email is already registered' });
          res.render('register', {
            errors: errors,
            name: name,
            email: email,
            password: password,
            password2: password2
          });
        } else {
          var newUser = new User({
            name: name,
            email: email,
            password: password
          });

          // Hash password
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
              if (err) throw err;
              //Set password to hashed
              newUser.password = hash;
              //Save user
              newUser.save()
                .then(function(user) {
                  req.flash('success_msg', 'New user has been created');
                  res.redirect('login');
                })
                .catch(function(err) {
                  console.log(err);
                });
            });
          });
        }
      });
  }
});

module.exports = router;