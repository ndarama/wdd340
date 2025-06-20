// controllers/reviewController.js

const utilities      = require('../utilities');
const reviewModel    = require('../models/review-model');
const inventoryModel = require('../models/inventory-model');
const { body, validationResult } = require('express-validator');

/* ****************************************
 *  Review Validation Rules
 **************************************** */
function reviewValidationRules() {
  return [
    body('review_text')
      .trim()
      .isLength({ min: 10 })
      .withMessage('Review text must be at least 10 characters long.'),
    body('review_rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5.')
  ];
}

/* ****************************************
 *  Display the form to add a review
 **************************************** */
async function buildReviewForm(req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id, 10);
    const vehicle = await inventoryModel.getInventoryById(inv_id);

    if (!vehicle) {
      req.flash('notice', 'Vehicle not found.');
      return res.redirect('/inv');
    }

    const nav = await utilities.getNav();

    // Pass default values so the template’s <%= review_text || '' %> never fails
    res.render('reviews/add-review', {
      title:         `Review ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      errors:        null,
      inv_id:        vehicle.inv_id,
      inv_make:      vehicle.inv_make,
      inv_model:     vehicle.inv_model,
      inv_year:      vehicle.inv_year,
      inv_image:     vehicle.inv_image,
      review_text:   '',
      review_rating: 5
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process the submission of a new review
 **************************************** */
async function addReview(req, res, next) {
  try {
    const { inv_id, review_text, review_rating } = req.body;
    const account_id = res.locals.accountData.account_id;

    // Insert into DB
    const result = await reviewModel.addReview(
      inv_id,
      account_id,
      review_text,
      review_rating
    );

    if (result && result.review_id) {
      req.flash('notice', 'Thank you for your review!');
      return res.redirect(`/inv/detail/${inv_id}`);
    }

    // fallback on error
    req.flash('notice', 'Sorry, there was an error adding your review.');
    return res.redirect(`/reviews/add/${inv_id}`);
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Display the form to edit an existing review
 **************************************** */
async function buildEditReview(req, res, next) {
  try {
    const review_id = parseInt(req.params.review_id, 10);
    const review    = await reviewModel.getReviewById(review_id);

    if (!review) {
      req.flash('notice', 'Review not found.');
      return res.redirect('/account/');
    }
    if (review.account_id !== res.locals.accountData.account_id) {
      req.flash('notice', 'You do not have permission to edit this review.');
      return res.redirect('/account/');
    }

    const nav = await utilities.getNav();
    res.render('reviews/edit-review', {
      title:          `Edit Review for ${review.inv_make} ${review.inv_model}`,
      nav,
      errors:         null,
      review_id:      review.review_id,
      inv_id:         review.inv_id,
      inv_make:       review.inv_make,
      inv_model:      review.inv_model,
      inv_year:       review.inv_year,
      review_text:    review.review_text,
      review_rating:  review.review_rating
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process the update of an existing review
 **************************************** */
async function updateReview(req, res, next) {
  try {
    const { review_id, review_text, review_rating } = req.body;
    const review = await reviewModel.getReviewById(review_id);

    if (!review) {
      req.flash('notice', 'Review not found.');
      return res.redirect('/account/');
    }
    if (review.account_id !== res.locals.accountData.account_id) {
      req.flash('notice', 'You do not have permission to update this review.');
      return res.redirect('/account/');
    }

    const result = await reviewModel.updateReview(
      review_id,
      review_text,
      review_rating
    );

    if (result && result.review_id) {
      req.flash('notice', 'Your review has been updated successfully.');
      return res.redirect(`/inv/detail/${review.inv_id}`);
    }

    req.flash('notice', 'Sorry, there was an error updating your review.');
    return res.redirect(`/reviews/edit/${review_id}`);
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Display confirmation page before deleting a review
 **************************************** */
async function confirmDeleteReview(req, res, next) {
  try {
    const review_id = parseInt(req.params.review_id, 10);
    const review    = await reviewModel.getReviewById(review_id);

    if (!review) {
      req.flash('notice', 'Review not found.');
      return res.redirect('/account/');
    }
    if (review.account_id !== res.locals.accountData.account_id) {
      req.flash('notice', 'You do not have permission to delete this review.');
      return res.redirect('/account/');
    }

    const nav = await utilities.getNav();
    res.render('reviews/delete-confirm', {
      title:          `Delete Review for ${review.inv_make} ${review.inv_model}`,
      nav,
      errors:         null,
      review_id:      review.review_id,
      inv_id:         review.inv_id,
      inv_make:       review.inv_make,
      inv_model:      review.inv_model,
      inv_year:       review.inv_year,
      review_text:    review.review_text,
      review_rating:  review.review_rating
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process the deletion of a review
 **************************************** */
async function deleteReview(req, res, next) {
  try {
    const { review_id } = req.body;
    const review        = await reviewModel.getReviewById(review_id);

    if (!review) {
      req.flash('notice', 'Review not found.');
      return res.redirect('/account/');
    }
    if (review.account_id !== res.locals.accountData.account_id) {
      req.flash('notice', 'You do not have permission to delete this review.');
      return res.redirect('/account/');
    }

    await reviewModel.deleteReview(review_id);
    req.flash('notice', 'Your review has been deleted successfully.');
    return res.redirect(`/inv/detail/${review.inv_id}`);
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Display all reviews by the logged-in user
 **************************************** */
async function getUserReviews(req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id;
    const reviews    = await reviewModel.getReviewsByUser(account_id);
    const nav        = await utilities.getNav();

    res.render('reviews/user-reviews', {
      title:   'Your Reviews',
      nav,
      errors:  null,
      reviews
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  reviewValidationRules,
  buildReviewForm,
  addReview,
  buildEditReview,
  updateReview,
  confirmDeleteReview,
  deleteReview,
  getUserReviews
};
