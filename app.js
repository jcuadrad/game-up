const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
const dotenv = require('dotenv');

const passportConfiguration = require('./helpers/passport')
const game = require('./routes/game');
const users = require('./routes/users');
const auth = require('./routes/auth');

const app = express();

// -- setup the app

dotenv.config();

// - session

app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    }),
    secret: "some-string",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

// - passport

app.use(flash());
passportConfiguration();
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// - database

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/game-up', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// - views

app.use(expressLayouts);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "index");

// -- Middlewares

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', game);
app.use('/auth', auth);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
  res.render('not-found');
});

app.use(function(err, req, res, next) {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error');
  }
});

module.exports = app;
