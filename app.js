const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const indexRouter = require('./route/index');
const aboutRouter = require('./route/about');
const ideasRouter = require('./route/ideas');
const usersRouter = require('./route/users');

const app = express();

//Passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/database');

//Map promise
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect(db.mongoURI, { 
  useNewUrlParser: true 
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

//Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Method override middleware
app.use(methodOverride('_method'));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport midleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Use routes
app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/ideas',ideasRouter);
app.use('/users', usersRouter);

const PORT = process.env.PORT || 3000;

app.use(function (req, res, next) {
  req.flash('error_msg', `Sorry can't find that!`);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});