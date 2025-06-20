-- Test data for the review table
-- This file inserts sample review data for testing purposes

-- Clear existing test data if needed
DELETE FROM review WHERE review_id > 0;

-- Reset the sequence if needed
-- ALTER SEQUENCE review_review_id_seq RESTART WITH 1;

-- Insert sample reviews
-- Review 1: 5-star review for a Delorean
INSERT INTO review (inv_id, account_id, review_text, review_rating, review_date)
VALUES (
  (SELECT inv_id FROM inventory WHERE inv_make = 'DMC' AND inv_model = 'DeLorean' LIMIT 1),
  (SELECT account_id FROM account WHERE account_email = 'tony@starkent.com' LIMIT 1),
  'This car is absolutely amazing! The stainless steel body is timeless and the gull-wing doors are a conversation starter. Great for time travel experiments!',
  5,
  NOW() - INTERVAL '5 days'
);

-- Review 2: 4-star review for a Batmobile
INSERT INTO review (inv_id, account_id, review_text, review_rating, review_date)
VALUES (
  (SELECT inv_id FROM inventory WHERE inv_make = 'Custom' AND inv_model = 'Batmobile' LIMIT 1),
  (SELECT account_id FROM account WHERE account_email = 'tony@starkent.com' LIMIT 1),
  'Excellent vehicle for fighting crime in Gotham. The stealth mode works perfectly, but the fuel economy could be better.',
  4,
  NOW() - INTERVAL '10 days'
);

-- Review 3: 3-star review for a Wrangler
INSERT INTO review (inv_id, account_id, review_text, review_rating, review_date)
VALUES (
  (SELECT inv_id FROM inventory WHERE inv_make = 'Jeep' AND inv_model = 'Wrangler' LIMIT 1),
  (SELECT account_id FROM account ORDER BY account_id LIMIT 1),
  'Good off-road capability but a bit rough on highways. The removable top is a nice feature for summer drives.',
  3,
  NOW() - INTERVAL '15 days'
);

-- Review 4: 5-star review for a Monster Truck
INSERT INTO review (inv_id, account_id, review_text, review_rating, review_date)
VALUES (
  (SELECT inv_id FROM inventory WHERE inv_model LIKE '%Monster%' LIMIT 1),
  (SELECT account_id FROM account ORDER BY account_id LIMIT 1),
  'This monster truck is AWESOME! Crushes everything in its path and the suspension is surprisingly comfortable. Perfect for weekend fun!',
  5,
  NOW() - INTERVAL '20 days'
);

-- Review 5: 2-star review for a Model T
INSERT INTO review (inv_id, account_id, review_text, review_rating, review_date)
VALUES (
  (SELECT inv_id FROM inventory WHERE inv_make = 'Ford' AND inv_model = 'Model T' LIMIT 1),
  (SELECT account_id FROM account ORDER BY account_id OFFSET 1 LIMIT 1),
  'While it has historical significance, it's not practical for daily use. Hard to start and the ride is extremely bumpy.',
  2,
  NOW() - INTERVAL '25 days'
);

-- Review 6: 4-star review for a Mystery Machine
INSERT INTO review (inv_id, account_id, review_text, review_rating, review_date)
VALUES (
  (SELECT inv_id FROM inventory WHERE inv_model LIKE '%Mystery%' LIMIT 1),
  (SELECT account_id FROM account ORDER BY account_id OFFSET 1 LIMIT 1),
  'Great for solving mysteries with friends! Spacious interior and distinctive paint job. Could use better security features though.',
  4,
  NOW() - INTERVAL '30 days'
);

-- Verify the inserted data
-- SELECT r.*, a.account_firstname, a.account_lastname, i.inv_make, i.inv_model
-- FROM review r
-- JOIN account a ON r.account_id = a.account_id
-- JOIN inventory i ON r.inv_id = i.inv_id
-- ORDER BY r.review_date DESC;