const pool = require('../database/dbConfig');

/* *****************************
*   Add a new review
* *************************** */
async function addReview(inv_id, account_id, review_text, review_rating) {
    try {
        const sql = "INSERT INTO review (inv_id, account_id, review_text, review_rating) VALUES ($1, $2, $3, $4) RETURNING *";
        const result = await pool.query(sql, [inv_id, account_id, review_text, review_rating]);
        return result.rows[0];
    } catch (error) {
        console.error("addReview error: " + error);
        return error.message;
    }
}

/* *****************************
*   Get all reviews for a specific vehicle
* *************************** */
async function getReviewsByVehicle(inv_id) {
    try {
        const sql = `
            SELECT r.*, a.account_firstname, a.account_lastname 
            FROM review AS r
            JOIN account AS a ON r.account_id = a.account_id
            WHERE r.inv_id = $1
            ORDER BY r.review_date DESC
        `;
        const result = await pool.query(sql, [inv_id]);
        return result.rows;
    } catch (error) {
        console.error("getReviewsByVehicle error: " + error);
        return new Error("No reviews found for this vehicle");
    }
}

/* *****************************
*   Get all reviews by a specific user
* *************************** */
async function getReviewsByUser(account_id) {
    try {
        const sql = `
            SELECT r.*, i.inv_make, i.inv_model, i.inv_year
            FROM review AS r
            JOIN inventory AS i ON r.inv_id = i.inv_id
            WHERE r.account_id = $1
            ORDER BY r.review_date DESC
        `;
        const result = await pool.query(sql, [account_id]);
        return result.rows;
    } catch (error) {
        console.error("getReviewsByUser error: " + error);
        return new Error("No reviews found for this user");
    }
}

/* *****************************
*   Get a specific review by ID
* *************************** */
async function getReviewById(review_id) {
    try {
        const sql = `
            SELECT r.*, a.account_firstname, a.account_lastname, i.inv_make, i.inv_model, i.inv_year
            FROM review AS r
            JOIN account AS a ON r.account_id = a.account_id
            JOIN inventory AS i ON r.inv_id = i.inv_id
            WHERE r.review_id = $1
        `;
        const result = await pool.query(sql, [review_id]);
        return result.rows[0];
    } catch (error) {
        console.error("getReviewById error: " + error);
        return new Error("Review not found");
    }
}

/* *****************************
*   Update an existing review
* *************************** */
async function updateReview(review_id, review_text, review_rating) {
    try {
        const sql = "UPDATE review SET review_text = $1, review_rating = $2 WHERE review_id = $3 RETURNING *";
        const result = await pool.query(sql, [review_text, review_rating, review_id]);
        return result.rows[0];
    } catch (error) {
        console.error("updateReview error: " + error);
        return error.message;
    }
}

/* *****************************
*   Delete a review
* *************************** */
async function deleteReview(review_id) {
    try {
        const sql = "DELETE FROM review WHERE review_id = $1";
        const result = await pool.query(sql, [review_id]);
        return result;
    } catch (error) {
        console.error("deleteReview error: " + error);
        return new Error("Delete Review Error");
    }
}

module.exports = {
    addReview,
    getReviewsByVehicle,
    getReviewsByUser,
    getReviewById,
    updateReview,
    deleteReview
};