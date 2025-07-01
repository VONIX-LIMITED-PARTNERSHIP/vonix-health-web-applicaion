-- Drop existing assessments table and recreate with bilingual support
DROP TABLE IF EXISTS public.assessments CASCADE;

-- Create assessments table with bilingual fields
CREATE TABLE public.assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL,
    category_title TEXT NOT NULL,
    category_title_en TEXT,
    answers JSONB NOT NULL,
    total_score INTEGER NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 100,
    percentage INTEGER NOT NULL DEFAULT 0,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'very-high')),
    language TEXT NOT NULL DEFAULT 'th' CHECK (language IN ('th', 'en')),
    
    -- Thai language fields
    risk_factors TEXT[] DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    summary TEXT,
    
    -- English language fields
    risk_factors_en TEXT[] DEFAULT '{}',
    recommendations_en TEXT[] DEFAULT '{}',
    summary_en TEXT,
    
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX idx_assessments_category_id ON public.assessments(category_id);
CREATE INDEX idx_assessments_completed_at ON public.assessments(completed_at);
CREATE INDEX idx_assessments_user_category ON public.assessments(user_id, category_id);

-- Enable RLS
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

-- Grant permissions
GRANT ALL ON public.assessments TO authenticated;
GRANT SELECT ON public.assessments TO anon;

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
