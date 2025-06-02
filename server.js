require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

// Routers
const staticRouter = require('./routes/static');
const indexRouter = require('./routes/index');
const inventoryRouter = require('./routes/inventory'); // ✅ Inventory route included

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');

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
    error: err    // Pass error for details (optional)
  });
});


// Server start
const host = process.env.HOST || 'localhost';
const port = parseInt(process.env.PORT, 10) || 5500;
app.listen(port, host, () => {
  console.log(`Server listening at http://${host}:${port}/`);
});
