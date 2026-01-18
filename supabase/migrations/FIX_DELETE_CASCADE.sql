-- FIX DELETE CASCADE
-- Run this to allow deleting items even if they are in someone's favorites

-- 1. Fix favorites table
ALTER TABLE public.favorites 
DROP CONSTRAINT IF EXISTS favorites_item_id_fkey,
ADD CONSTRAINT favorites_item_id_fkey 
  FOREIGN KEY (item_id) 
  REFERENCES public.library_items(id) 
  ON DELETE CASCADE;

-- 2. Check if there are other dependencies? 
-- (If you have a separate downloads table, add it here too, but usually it's just a count on the item)
