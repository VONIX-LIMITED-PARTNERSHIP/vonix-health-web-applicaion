-- Add language column to assessments table
ALTER TABLE assessments 
ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'th';

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_assessments_language ON assessments(language);

-- Update existing records to have default language
UPDATE assessments 
SET language = 'th' 
WHERE language IS NULL;

-- Add comment to the column
COMMENT ON COLUMN assessments.language IS 'Language used for the assessment (th, en)';
