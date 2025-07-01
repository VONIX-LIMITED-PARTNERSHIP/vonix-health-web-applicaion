-- Add language column to assessments table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'assessments' 
        AND column_name = 'language'
    ) THEN
        ALTER TABLE assessments 
        ADD COLUMN language VARCHAR(5) DEFAULT 'th';
        
        -- Add comment to the column
        COMMENT ON COLUMN assessments.language IS 'Language used for the assessment (th, en)';
        
        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_assessments_language ON assessments(language);
        
        RAISE NOTICE 'Language column added to assessments table successfully';
    ELSE
        RAISE NOTICE 'Language column already exists in assessments table';
    END IF;
END $$;

-- Update existing records to have default language if they are NULL
UPDATE assessments 
SET language = 'th' 
WHERE language IS NULL;

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    column_default, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'assessments' 
AND column_name = 'language';
