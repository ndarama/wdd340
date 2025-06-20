// routes/review-route.js

const express          = require('express');
const router           = express.Router();

// 🔑 Import utilities from the project root, not "./utilities" inside routes/
const utilities        = require('../utilities');
const reviewController = require('../controllers/reviewController');
const {
  requireAuth,
  reviewRules,
  checkReviewData
} = require('../utilities');

// Route to display the form to add a review for a specific vehicle
router.get(
  '/add/:inv_id',
  requireAuth,
  utilities.handleErrors(reviewController.buildReviewForm)
);

// Route to process the submission of a new review
router.post(
  '/add',
  requireAuth,
  reviewRules(),
  checkReviewData,
  utilities.handleErrors(reviewController.addReview)
);

// Route to display the form to edit an existing review
router.get(
  '/edit/:review_id',
  requireAuth,
  utilities.handleErrors(reviewController.buildEditReview)
);

// Route to process the update of an existing review
router.post(
  '/edit',
  requireAuth,
  reviewRules(),
  checkReviewData,
  utilities.handleErrors(reviewController.updateReview)
);

// Route to display confirmation page before deleting a review
router.get(
  '/delete/:review_id',
  requireAuth,
  utilities.handleErrors(reviewController.confirmDeleteReview)
);

// Route to process the deletion of a review
router.post(
  '/delete',
  requireAuth,
  utilities.handleErrors(reviewController.deleteReview)
);

// Route to display all reviews by the logged‐in user
router.get(
  '/',
  requireAuth,
  utilities.handleErrors(reviewController.getUserReviews)
);

module.exports = router;
