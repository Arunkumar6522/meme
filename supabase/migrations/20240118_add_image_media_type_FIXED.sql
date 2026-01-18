-- Fix 1: Add 'image' to media_type (simpler approach)
-- First, let's check what the actual type name is and add image value

-- Option A: If media_type column is just a text field
-- ALTER TABLE library_items ALTER COLUMN media_type TYPE text;

-- Option B: If it's an enum, add the value (run this first to check)
-- Check if enum exists
DO $$ 
BEGIN
    -- Try to add 'image' value to the enum if it exists
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_type') THEN
        -- Check if 'image' value doesn't already exist
        IF NOT EXISTS (
            SELECT 1 FROM pg_enum 
            WHERE enumlabel = 'image' 
            AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'media_type')
        ) THEN
            ALTER TYPE media_type ADD VALUE 'image';
        END IF;
    ELSE
        -- If enum doesn't exist, the column might be text type
        -- In that case, no action needed - text accepts any value
        RAISE NOTICE 'media_type enum does not exist - column might be text type';
    END IF;
END $$;
