const { body, validationResult } = require('express-validator');
const validate = {};

/*  **********************************
 *  Review Data Validation Rules
 * ********************************* */
validate.reviewRules = () => {
    return [
        // review_text is required and must be between 10-200 characters
        body('review_text')
            .trim()
            .isLength({ min: 10, max: 200 })
            .withMessage('Review text must be between 10 and 200 characters.'),

        // review_rating is required and must be between 1-5
        body('review_rating')
            .isInt({ min: 1, max: 5 })
            .withMessage('Rating must be between 1 and 5.')
    ];
};

/* ******************************
 * Check review data and return errors or continue
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
    const { review_text, review_rating, inv_id } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Get nav from res.locals or request it if needed
        let nav = res.locals.nav;
        if (!nav) {
            // If nav is not in res.locals, we'll redirect back with flash messages instead
            req.flash("errors", errors.array());
        
            // Determine which path to redirect to based on the route
            if (req.originalUrl.includes('/reviews/add')) {
                return res.redirect(`/reviews/add/${inv_id}`);
            } else if (req.originalUrl.includes('/reviews/edit')) {
                const { review_id } = req.body;
                return res.redirect(`/reviews/edit/${review_id}`);
            }
            
            // Default fallback
            return res.redirect('back');
        }
        
        // If we have nav, render the appropriate view
        if (req.originalUrl.includes('/reviews/add')) {
            // For add review form
            res.render('reviews/add-review', {
                errors,
                title: 'Add Review',
                nav,
                review_text,
                review_rating,
                inv_id
            });
            return;
        } else if (req.originalUrl.includes('/reviews/edit')) {
            // For edit review form
            const { review_id, inv_make, inv_model, inv_year } = req.body;
            res.render('reviews/edit-review', {
                errors,
                title: `Edit Review for ${inv_make} ${inv_model}`,
                nav,
                review_id,
                inv_id,
                inv_make,
                inv_model,
                inv_year,
                review_text,
                review_rating
            });
            return;
        }
        
        // Default fallback with flash messages
        req.flash("errors", errors.array());
        return res.redirect('back');
    }
    next();
};

module.exports = validate;