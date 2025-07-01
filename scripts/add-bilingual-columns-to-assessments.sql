-- Add bilingual support columns to assessments table
ALTER TABLE assessments 
ADD COLUMN IF NOT EXISTS summary TEXT,
ADD COLUMN IF NOT EXISTS summary_en TEXT,
ADD COLUMN IF NOT EXISTS risk_factors_en TEXT[],
ADD COLUMN IF NOT EXISTS recommendations_en TEXT[];

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_assessments_language ON assessments(language);

-- Update existing assessments to have default language
UPDATE assessments SET language = 'th' WHERE language IS NULL;
