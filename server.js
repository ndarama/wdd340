require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

// Routers
const staticRouter = require('./routes/static');
const indexRouter = require('./routes/index');
const inventoryRouter = require('./routes/inventory');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Flash messages
app.use(flash());

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/', staticRouter);
app.use('/inv', inventoryRouter); 

// 404 handler
app.use((req, res) => {
  res.status(404).render('errors/404', { title: '404 — Page Not Found' });
});

// 500 handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errors/500', {
    title: '500 — Server Error',
    error: err    // Pass error for detail
  });
});


// Server start
const host = process.env.HOST || 'localhost';
const port = parseInt(process.env.PORT, 10) || 5500;
app.listen(port, host, () => {
  console.log(`Server listening at http://${host}:${port}/`);
});
