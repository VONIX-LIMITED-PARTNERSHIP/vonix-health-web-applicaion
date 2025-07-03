-- Fix the assessments table schema to properly handle JSON arrays
-- First, let's see what's in the table currently
SELECT COUNT(*) as total_records FROM assessments;

-- Drop any problematic constraints
ALTER TABLE assessments DROP CONSTRAINT IF EXISTS assessments_recommendations_check;
ALTER TABLE assessments DROP CONSTRAINT IF EXISTS assessments_risk_factors_check;

-- Ensure the columns are properly typed as JSONB arrays
ALTER TABLE assessments 
ALTER COLUMN recommendations TYPE JSONB USING recommendations::JSONB;

ALTER TABLE assessments 
ALTER COLUMN risk_factors TYPE JSONB USING risk_factors::JSONB;

-- Add proper constraints to ensure they are arrays
ALTER TABLE assessments 
ADD CONSTRAINT assessments_recommendations_is_array 
CHECK (jsonb_typeof(recommendations) = 'array');

ALTER TABLE assessments 
ADD CONSTRAINT assessments_risk_factors_is_array 
CHECK (jsonb_typeof(risk_factors) = 'array');

-- Verify the changes
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'assessments' 
AND column_name IN ('recommendations', 'risk_factors');
