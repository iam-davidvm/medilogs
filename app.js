if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// basic set-up mongoose / express
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const engine = require('ejs-mate');

// handling form information
app.use(express.urlencoded({ extended: true }));

// default Error handling
const ExpressError = require('./utils/ExpressError');

// session save
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

// user authentication
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// ROUTES
const userRoutes = require('./routes/user');

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

dbUrl = process.env.DB_URL;
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((e) => {
    console.log('An error occured:');
    console.log(e);
  });
mongoose.set('strictQuery', false);

// we store the session into our mongodb
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: process.env.SECRET,
  },
});

const sessionConfig = {
  store,
  secret: process.env.SECRET,
  name: 'session',
  resave: false,
  saveUninitialized: true,
  cookie: {
    sameSite: 'strict',
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

// user authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// local variables
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', userRoutes);

app.get('/', (req, res) => {
  res.render('index', { title: 'Dashboard' });
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Pagina niet gevonden!', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Er is iets fout gegaan';
  res.status(statusCode).send(err);
});

app.listen(3000, () => {
  console.log('Listening to port 3000');
});
