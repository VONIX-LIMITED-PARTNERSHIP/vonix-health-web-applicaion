-- Drop existing table if exists and create new bilingual assessments table
DROP TABLE IF EXISTS public.assessments CASCADE;

-- Create new assessments table with bilingual support
CREATE TABLE public.assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL,
    category_title_th TEXT NOT NULL,
    category_title_en TEXT NOT NULL,
    total_score INTEGER NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 100,
    percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'very_high')),
    
    -- Bilingual risk factors (arrays)
    risk_factors_th TEXT[] DEFAULT '{}',
    risk_factors_en TEXT[] DEFAULT '{}',
    
    -- Bilingual recommendations (arrays)
    recommendations_th TEXT[] DEFAULT '{}',
    recommendations_en TEXT[] DEFAULT '{}',
    
    -- Bilingual summaries
    summary_th TEXT DEFAULT '',
    summary_en TEXT DEFAULT '',
    
    -- Assessment answers (JSONB for flexibility)
    answers JSONB DEFAULT '[]',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX idx_assessments_category_id ON public.assessments(category_id);
CREATE INDEX idx_assessments_user_category ON public.assessments(user_id, category_id);
CREATE INDEX idx_assessments_created_at ON public.assessments(created_at DESC);
CREATE INDEX idx_assessments_risk_level ON public.assessments(risk_level);

-- Enable Row Level Security
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can insert their own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can update their own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can delete their own assessments" ON public.assessments;

-- Create RLS policies
CREATE POLICY "Users can view their own assessments" ON public.assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments" ON public.assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" ON public.assessments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assessments" ON public.assessments
    FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.assessments TO authenticated;
GRANT ALL ON public.assessments TO service_role;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_assessments_updated_at ON public.assessments;
CREATE TRIGGER update_assessments_updated_at
    BEFORE UPDATE ON public.assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some test data to verify the structure
-- This will be replaced by actual assessment data
COMMENT ON TABLE public.assessments IS 'Bilingual assessments table with Thai and English support';
COMMENT ON COLUMN public.assessments.risk_factors_th IS 'Risk factors in Thai language (array)';
COMMENT ON COLUMN public.assessments.risk_factors_en IS 'Risk factors in English language (array)';
COMMENT ON COLUMN public.assessments.recommendations_th IS 'Recommendations in Thai language (array)';
COMMENT ON COLUMN public.assessments.recommendations_en IS 'Recommendations in English language (array)';
COMMENT ON COLUMN public.assessments.summary_th IS 'Summary in Thai language';
COMMENT ON COLUMN public.assessments.summary_en IS 'Summary in English language';
