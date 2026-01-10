# How to Create Storage Buckets in Supabase

## Step-by-Step Guide

### Step 1: Access Storage Section
1. Go to **https://supabase.com/dashboard**
2. Select your project
3. In the left sidebar, look for **"Storage"** (it's usually near the bottom, below "Database" and "Authentication")
4. Click on **"Storage"**

### Step 2: Create First Bucket - `library-audio`
1. You should see a page with "Buckets" section
2. Look for a button that says:
   - **"New bucket"** OR
   - **"Create bucket"** OR
   - **"+"** button OR
   - A button in the top right corner
3. Click that button
4. A modal/form will appear
5. Fill in:
   - **Name**: `library-audio` (must be exact, lowercase, with hyphen)
   - **Public bucket**: Toggle this to **ON** (very important!)
   - **File size limit**: `100` MB (or leave default)
6. Click **"Create bucket"** or **"Save"**

### Step 3: Create Second Bucket - `library-video`
1. Click **"New bucket"** again
2. Fill in:
   - **Name**: `library-video`
   - **Public bucket**: **ON**
   - **File size limit**: `100` MB
3. Click **"Create bucket"**

### Step 4: Create Third Bucket - `thumbnails`
1. Click **"New bucket"** again
2. Fill in:
   - **Name**: `thumbnails`
   - **Public bucket**: **ON**
   - **File size limit**: `5` MB
3. Click **"Create bucket"**

## If You Don't See "New Bucket" Button

### Option A: Check Permissions
- Make sure you're logged in as the project owner/admin
- Storage might be disabled - check project settings

### Option B: Use SQL Editor
If the UI doesn't show the button, you can create buckets via SQL:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this SQL:

```sql
-- Create library-audio bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('library-audio', 'library-audio', true, 104857600);

-- Create library-video bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('library-video', 'library-video', true, 104857600);

-- Create thumbnails bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('thumbnails', 'thumbnails', true, 5242880);
```

### Option C: Use Supabase CLI
If you have Supabase CLI installed:

```bash
supabase storage create library-audio --public
supabase storage create library-video --public
supabase storage create thumbnails --public
```

## Verify Buckets Are Created

After creating buckets, you should see:
- All 3 buckets listed in the Storage page
- Each bucket shows "Public" badge
- You can click on each bucket to see its contents (will be empty initially)

## Set Storage Policies (CRITICAL!)

After creating buckets, you MUST set up storage policies. Without policies, uploads will fail with "row-level security policy" error.

### Quick Method: Use SQL Editor (Recommended)

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"New query"**
3. Copy and paste the entire contents of `STORAGE_POLICIES_SETUP.sql` file
4. Click **"Run"**
5. You should see "Success" message

### Manual Method: Via UI

For each bucket (`library-audio`, `library-video`, `thumbnails`):

1. Click on the bucket name
2. Go to **"Policies"** tab
3. Click **"New Policy"**
4. Create these policies:

**Policy 1: Public Read**
- Policy name: "Public read access"
- Allowed operation: SELECT
- Policy definition: `true`

**Policy 2: Admin Upload**
- Policy name: "Admin upload access"  
- Allowed operation: INSERT
- Policy definition:
```sql
EXISTS (
  SELECT 1 FROM public.users 
  WHERE id = auth.uid() AND role = 'admin'
)
```

**Policy 3: Admin Update** (optional but recommended)
- Policy name: "Admin update access"
- Allowed operation: UPDATE
- Policy definition:
```sql
EXISTS (
  SELECT 1 FROM public.users 
  WHERE id = auth.uid() AND role = 'admin'
)
```

**Policy 4: Admin Delete** (optional but recommended)
- Policy name: "Admin delete access"
- Allowed operation: DELETE
- Policy definition:
```sql
EXISTS (
  SELECT 1 FROM public.users 
  WHERE id = auth.uid() AND role = 'admin'
)
```

## Troubleshooting

**Q: I don't see Storage in the sidebar**
- Make sure you're on the correct project
- Storage might be a paid feature - check your plan

**Q: I see Storage but no "Create bucket" button**
- Try refreshing the page
- Check if you have the right permissions
- Use SQL Editor method instead

**Q: Bucket creation fails**
- Check bucket name is lowercase with hyphens only
- Make sure no bucket with that name already exists
- Check your Supabase plan limits
