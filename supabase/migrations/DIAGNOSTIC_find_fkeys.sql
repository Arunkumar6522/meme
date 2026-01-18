-- FIND FOREIGN KEYS for library_items
-- Run this to see what tables reference library_items

SELECT
    conname AS constraint_name,
    conrelid::regclass AS table_name,
    a.attname AS column_name,
    confrelid::regclass AS foreign_table_name,
    f.attname AS foreign_column_name
FROM
    pg_constraint c
    JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
    JOIN pg_attribute f ON f.attnum = ANY(c.confkey) AND f.attrelid = c.confrelid
WHERE
    confrelid = 'public.library_items'::regclass;
