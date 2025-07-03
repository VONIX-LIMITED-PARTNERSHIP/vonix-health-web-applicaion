-- Add bilingual support columns to assessments table
ALTER TABLE assessments 
ADD COLUMN IF NOT EXISTS risk_factors_th TEXT[],
ADD COLUMN IF NOT EXISTS risk_factors_en TEXT[],
ADD COLUMN IF NOT EXISTS recommendations_th TEXT[],
ADD COLUMN IF NOT EXISTS recommendations_en TEXT[],
ADD COLUMN IF NOT EXISTS summary_th TEXT,
ADD COLUMN IF NOT EXISTS summary_en TEXT,
ADD COLUMN IF NOT EXISTS category_title_th TEXT,
ADD COLUMN IF NOT EXISTS category_title_en TEXT;

-- Update existing records to have bilingual data
UPDATE assessments 
SET 
  risk_factors_th = risk_factors,
  recommendations_th = recommendations,
  category_title_th = category_title
WHERE risk_factors_th IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessments_user_category_completed 
ON assessments(user_id, category_id, completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessments_risk_level 
ON assessments(risk_level);
