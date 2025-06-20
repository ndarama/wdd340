// server.js
require('dotenv').config();

const express       = require('express');
const expressLayouts= require('express-ejs-layouts');
const session       = require('express-session');
const flash         = require('connect-flash');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const utilities     = require('./utilities');

// Routers
const staticRouter    = require('./routes/static');
const indexRouter     = require('./routes/index');
const inventoryRouter = require('./routes/inventory');
const accountRouter   = require('./routes/account-route');
const reviewRouter    = require('./routes/review-route');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // set true if you use HTTPS
}));

// Flash messages
app.use(flash());
// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookie parsing & JWT check
app.use(cookieParser());
app.use(utilities.checkJWT);

// Static files (css, js, images, etc)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', staticRouter);

// Mount routers
app.use('/', indexRouter);
app.use('/inv', inventoryRouter);
app.use('/account', accountRouter);
app.use('/reviews', reviewRouter);

// Quick route to test your 500 page
app.get('/cause-error', (req, res, next) => {
  next(new Error('This is a test error to check the 500 error page.'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('errors/404', { title: '404 — Page Not Found' });
});

// 500 handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  let message = 'Oh no! There was a crash. Maybe try a different route?';
  if (err.code === 'ETIMEDOUT' || err.message.includes('database')) {
    message = 'Sorry, we are experiencing database connection issues. Please try again later.';
  }
  res.status(500).render('errors/500', {
    title: 'Server Error',
    message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const host = process.env.HOST || 'localhost';
const port = parseInt(process.env.PORT, 10) || 5500;
app.listen(port, host, () => {
  console.log(`Server listening at http://${host}:${port}/`);
});
