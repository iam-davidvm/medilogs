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

// OVERRIDE DEFAULT HTML METHODS
const methodOverride = require('method-override');

// session save
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

// user authentication
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// security
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

// models

// ROUTES
const userRoutes = require('./routes/user');
const bloodpressureRoutes = require('./routes/bloodpressure');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');
const testRoutes = require('./routes/test');

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

let dbUrl = 'mongodb://127.0.0.1:27017/medipas-v2';
if (process.env.NODE_ENV == 'production') {
  dbUrl = process.env.DB_URL;
}

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

// HELMET SECURITY
const scriptSrcUrls = ['https://cdn.jsdelivr.net/npm/chart.js'];
const styleSrcUrls = ['https://fonts.googleapis.com/', 'fonts.gstatic.com'];
const fontSrcUrls = ['https://fonts.googleapis.com/', 'fonts.gstatic.com'];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'"],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:'],
      fontSrc: ["'self'", ...fontSrcUrls],
      mediaSrc: [],
      childSrc: ['blob:'],
      manifestSrc: ["'self'"], // favicon manifest
    },
  })
);

// we store the session into our mongodb
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: process.env.SECRET,
  },
});

store.on('error', function (e) {
  console.log('SESSION STORE ERROR', e);
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

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sessionConfig.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionConfig));
app.use(flash());

// user authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// security
app.use(mongoSanitize());

// local variables
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.warningBloodpressure = req.flash('warningBloodpressure');
  res.locals.warningPatient = req.flash('warningPatient');
  res.locals.modalComms = req.flash('modalComms');
  next();
});

app.get('/disclaimer', (req, res) => {
  res.render('disclaimer');
});

app.use('/', userRoutes);
app.use('/admin', adminRoutes);
app.use('/:patientId/dashboard', dashboardRoutes);
app.use('/:patientId/bloeddruk', bloodpressureRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/:patientId/dashboard', (req, res) => {
  const { patientId } = req.params;
  res.render('dashboard/index', { title: 'Dashboard', patientId });
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Pagina niet gevonden!', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Er is iets fout gegaan';
  res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
