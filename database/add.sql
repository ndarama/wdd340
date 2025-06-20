-- Add review_rating column with a default, then add the CHECK constraint
ALTER TABLE public.review
  ADD COLUMN review_rating INTEGER NOT NULL DEFAULT 3;

ALTER TABLE public.review
  ADD CONSTRAINT check_rating
    CHECK (review_rating >= 1 AND review_rating <= 5);
