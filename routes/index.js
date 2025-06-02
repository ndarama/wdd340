const express = require('express');
const router = express.Router();

// GET home page
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home'
  });
router.get('/cause-error', (req, res, next) => {
  // Intentionally trigger an error
    next(new Error('Test error from footer link!'));
  });
});

module.exports = router;
