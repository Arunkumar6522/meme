-- Diagnostic Query: Check Database Structure
-- Run this FIRST to understand your database setup

-- 1. Check if media_type is an enum or text column
SELECT 
    table_name,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_name = 'library_items' 
  AND column_name = 'media_type';

-- 2. If it's an enum, check existing values
SELECT 
    t.typname AS enum_name,
    e.enumlabel AS enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'media_type'
ORDER BY e.enumsortorder;

-- 3. Check existing RLS policies on artists table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'artists';

-- 4. Check if RLS is enabled on artists table
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'artists';
