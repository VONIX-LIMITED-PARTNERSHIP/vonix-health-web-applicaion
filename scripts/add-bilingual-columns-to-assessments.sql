-- Add summary columns (both languages) and bilingual columns to assessments table
ALTER TABLE assessments 
ADD COLUMN IF NOT EXISTS summary TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS summary_en TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS risk_factors_en TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS recommendations_en TEXT[] DEFAULT '{}';

-- Add comment to explain the bilingual structure
COMMENT ON COLUMN assessments.risk_factors IS 'Risk factors in Thai language';
COMMENT ON COLUMN assessments.risk_factors_en IS 'Risk factors in English language';
COMMENT ON COLUMN assessments.recommendations IS 'Recommendations in Thai language';
COMMENT ON COLUMN assessments.recommendations_en IS 'Recommendations in English language';
COMMENT ON COLUMN assessments.summary IS 'Summary in Thai language';
COMMENT ON COLUMN assessments.summary_en IS 'Summary in English language';
