const router = require('express').Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User').User;

router.get('/', (req, res, next) => {
  res.render('test');
});

router.get('/login', (req, res, next) => {
  res.render('users/login');
});

router.get('/register', (req, res, next) => {
  res.render('users/register');
});

// Login form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Register Form POST
router.post('/register', (req, res, next) => {
  let errors = [];

  if(req.body.password != req.body.password2){
    errors.push({text: 'Passwords do not match'});
  }
  
  if(req.body.password.length < 4){
    errors.push({text: 'Passwords must be at least 4 characters.'});
  }

  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) throw err;
        newUser.password = hash;
        newUser.save()
          .then(user => {
            req.flash('success_msg', 'You are now registered and can log in.');
            res.redirect('/users/login');
          })
          .catch(err => {
            console.log(err.code);
            console.log(err.message);
            req.flash('error_msg', 'Email already registered.');
            res.redirect('/users/login');
          });
      });
    });
  }
});

// Logout User
router.get('/logout', (req, res) => {
  req.logout(); //function from passport
  req.flash('success_msg', 'You are logout');
  res.redirect('/users/login');
});

module.exports = router;