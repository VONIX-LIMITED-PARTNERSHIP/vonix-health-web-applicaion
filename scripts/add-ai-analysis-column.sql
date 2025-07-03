-- Add ai_analysis column to store full bilingual AI analysis data
ALTER TABLE assessments 
ADD COLUMN IF NOT EXISTS ai_analysis JSONB;

-- Add comment to explain the column
COMMENT ON COLUMN assessments.ai_analysis IS 'Stores full bilingual AI analysis data including summary and bilingual risk factors/recommendations';

-- Create index for better performance when querying ai_analysis
CREATE INDEX IF NOT EXISTS idx_assessments_ai_analysis ON assessments USING GIN (ai_analysis);

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'assessments' 
AND column_name = 'ai_analysis';
