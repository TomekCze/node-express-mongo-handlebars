var express = require('express');
var router = express.Router();

//Home page
router.get('/', function(req, res, next) {
  const title = 'Welcome'
  res.render('index', {
    title: title
  });
});

module.exports = router;
