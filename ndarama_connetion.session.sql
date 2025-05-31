DELETE FROM public.classification
WHERE classification_id NOT IN (
    SELECT MIN(classification_id)
    FROM public.classification
    GROUP BY classification_name
);
