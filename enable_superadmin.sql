-- 1. Allow 'superadmin' in users check constraint (if applicable) or comment
-- If you have a constraint like "check (role in ('user', 'admin'))", drop and recreate it.
-- Example (run this if you get constraint violations):
-- ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
-- ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin', 'superadmin'));

-- 2. Update RLS policies to include 'superadmin'

-- Drop existing admin/super policies to be safe/clean
DROP POLICY IF EXISTS "Admins can insert library items" ON public.library_items;
DROP POLICY IF EXISTS "Admins can update library items" ON public.library_items;
DROP POLICY IF EXISTS "Admins can delete library items" ON public.library_items;

-- Re-create them with 'superadmin' support
CREATE POLICY "Admins and Superadmins can insert library items" ON public.library_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins and Superadmins can update library items" ON public.library_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Admins and Superadmins can delete library items" ON public.library_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- 3. Ensure 'created_by' foreign key is visible for joins (usually automatic)
-- If fetching uploader name fails, check if foreign key exists:
-- ALTER TABLE public.library_items ADD CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES public.users(id);
