-- Add explicit foreign key constraint to link library_items.created_by to users.id
ALTER TABLE public.library_items
DROP CONSTRAINT IF EXISTS fk_library_items_created_by;

ALTER TABLE public.library_items
ADD CONSTRAINT fk_library_items_created_by
FOREIGN KEY (created_by)
REFERENCES public.users(id)
ON DELETE SET NULL;

-- Force a schema cache reload (sometimes needed for PostgREST/Supabase to see the new FK)
NOTIFY pgrst, 'reload config';
