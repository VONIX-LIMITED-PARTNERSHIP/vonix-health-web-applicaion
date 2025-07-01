-- Add language column to assessments table
ALTER TABLE assessments 
ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'th';
