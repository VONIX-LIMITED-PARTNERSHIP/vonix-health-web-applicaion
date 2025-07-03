-- Drop existing table if exists (be careful in production!)
DROP TABLE IF EXISTS public.assessments CASCADE;

-- Create new bilingual assessments table
CREATE TABLE public.assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL,
    
    -- Bilingual category titles
    category_title_th TEXT NOT NULL,
    category_title_en TEXT,
    
    -- Assessment data
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
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
CREATE INDEX idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX idx_assessments_category_id ON public.assessments(category_id);
CREATE INDEX idx_assessments_completed_at ON public.assessments(completed_at DESC);
CREATE INDEX idx_assessments_user_category ON public.assessments(user_id, category_id);
CREATE INDEX idx_assessments_risk_level ON public.assessments(risk_level);

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

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assessments_updated_at 
    BEFORE UPDATE ON public.assessments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.assessments TO authenticated;
GRANT ALL ON public.assessments TO service_role;

-- Add helpful comments
COMMENT ON TABLE public.assessments IS 'Bilingual health assessments with Thai and English results';
COMMENT ON COLUMN public.assessments.category_title_th IS 'Assessment category title in Thai';
COMMENT ON COLUMN public.assessments.category_title_en IS 'Assessment category title in English';
COMMENT ON COLUMN public.assessments.risk_factors_th IS 'Risk factors in Thai language';
COMMENT ON COLUMN public.assessments.risk_factors_en IS 'Risk factors in English language';
COMMENT ON COLUMN public.assessments.recommendations_th IS 'Recommendations in Thai language';
COMMENT ON COLUMN public.assessments.recommendations_en IS 'Recommendations in English language';
COMMENT ON COLUMN public.assessments.summary_th IS 'Assessment summary in Thai language';
COMMENT ON COLUMN public.assessments.summary_en IS 'Assessment summary in English language';
