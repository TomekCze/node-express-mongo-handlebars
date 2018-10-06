const router = require('express').Router();
const Idea = require('../models/Idea').Idea;
const {ensureAuthenticated} = require('../helpers/auth');

//Ideas page
router.post('/', ensureAuthenticated, function(req, res, next) {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Please add a details' });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    new Idea(newUser).save().then(idea => {
      req.flash('success_msg', 'Video idea added');
      res.redirect('/ideas');
    });
  }
});

router.put('/:id', ensureAuthenticated, (req, res, next) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    //new values
    idea.title = req.body.title, 
    idea.details = req.body.details;

    idea.save().then(idea => {
      req.flash('success_msg', 'Video idea updated');
      res.redirect('/ideas');
    });
  });
});

router.get('/', ensureAuthenticated, (req, res, next) => {
  Idea.find({user: req.user.id})
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

router.get('/add', ensureAuthenticated, (req, res, next) => {
  res.render('ideas/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res, next) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    if(idea.user != req.user.id){
      req.flash('error_msg','You are not authorized for this');
      res.redirect('/ideas');
    }else {
      res.render('ideas/edit', {
        idea: idea
      });
    }
  });
});

router.delete('/:id', ensureAuthenticated, (req, res, next) => {
  Idea.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Video idea removed');
      res.redirect('/ideas');
    });
});

module.exports = router;
