-- Create new bilingual assessments table
-- This script creates a new assessments table that supports bilingual results

-- Drop existing table if exists (optional - remove this line if you want to keep existing data)
-- DROP TABLE IF EXISTS public.assessments;

-- Create new assessments table with bilingual support
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL,
    
    -- Bilingual category titles
    category_title_th TEXT NOT NULL,
    category_title_en TEXT,
    
    -- Assessment data
    answers JSONB NOT NULL,
    total_score INTEGER NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 100,
    percentage INTEGER NOT NULL DEFAULT 0,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'very-high')),
    
    -- Thai results
    risk_factors_th TEXT[] DEFAULT '{}',
    recommendations_th TEXT[] DEFAULT '{}',
    summary_th TEXT DEFAULT '',
    
    -- English results
    risk_factors_en TEXT[] DEFAULT '{}',
    recommendations_en TEXT[] DEFAULT '{}',
    summary_en TEXT DEFAULT '',
    
    -- Timestamps
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_category_id ON public.assessments(category_id);
CREATE INDEX IF NOT EXISTS idx_assessments_completed_at ON public.assessments(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_user_category ON public.assessments(user_id, category_id);

-- Enable Row Level Security
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own assessments" ON public.assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments" ON public.assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" ON public.assessments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assessments" ON public.assessments
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_assessments_updated_at 
    BEFORE UPDATE ON public.assessments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON public.assessments TO authenticated;
GRANT ALL ON public.assessments TO service_role;

-- Add comment
COMMENT ON TABLE public.assessments IS 'Bilingual health assessments with Thai and English results';
