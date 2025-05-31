require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const staticRouter = require('./routes/static');
const indexRouter = require('./routes/index');

const app = express();

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/', staticRouter);

app.use((req, res) => {
  res.status(404).render('errors/404', { title: '404 — Page Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errors/500', { title: '500 — Server Error' });
});

const host = process.env.HOST || 'localhost';
const port = parseInt(process.env.PORT, 10) || 5500;
app.listen(port, host, () => {
  console.log(`Server listening at http://${host}:${port}/`);
});
