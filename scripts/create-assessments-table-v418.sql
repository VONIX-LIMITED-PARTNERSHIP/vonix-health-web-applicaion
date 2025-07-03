-- Create Assessments Table v418 - Fixed function name conflicts
-- This script drops all existing conflicting functions and creates new ones with unique names

-- Drop existing table and all dependencies
DROP TABLE IF EXISTS public.assessments CASCADE;

-- Drop all possible function signatures that might conflict
DROP FUNCTION IF EXISTS get_latest_assessment_by_category(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS get_latest_assessment_by_category(uuid) CASCADE;
DROP FUNCTION IF EXISTS get_latest_assessment_by_category(text) CASCADE;
DROP FUNCTION IF EXISTS get_assessment_stats(uuid) CASCADE;
DROP FUNCTION IF EXISTS get_assessment_stats() CASCADE;

-- Drop views that might depend on the table
DROP VIEW IF EXISTS assessment_summary CASCADE;

-- Create the assessments table
CREATE TABLE public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    guest_session_id TEXT, -- For guest users
    category_id TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}',
    total_score INTEGER NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 0,
    percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'very-high')),
    risk_factors TEXT[] DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    ai_analysis JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_user_or_guest CHECK (
        (user_id IS NOT NULL AND guest_session_id IS NULL) OR 
        (user_id IS NULL AND guest_session_id IS NOT NULL)
    ),
    CONSTRAINT valid_percentage CHECK (percentage >= 0 AND percentage <= 100),
    CONSTRAINT valid_scores CHECK (total_score >= 0 AND max_score >= 0 AND total_score <= max_score)
);

-- Create indexes for performance
CREATE INDEX idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX idx_assessments_guest_session ON public.assessments(guest_session_id);
CREATE INDEX idx_assessments_category ON public.assessments(category_id);
CREATE INDEX idx_assessments_created_at ON public.assessments(created_at DESC);
CREATE INDEX idx_assessments_user_category ON public.assessments(user_id, category_id);
CREATE INDEX idx_assessments_guest_category ON public.assessments(guest_session_id, category_id);

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
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own assessments
CREATE POLICY "Users can view own assessments" ON public.assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments" ON public.assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments" ON public.assessments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments" ON public.assessments
    FOR DELETE USING (auth.uid() = user_id);

-- Guest policies (for guest_session_id based access)
CREATE POLICY "Allow guest read access" ON public.assessments
    FOR SELECT USING (guest_session_id IS NOT NULL);

CREATE POLICY "Allow guest insert" ON public.assessments
    FOR INSERT WITH CHECK (guest_session_id IS NOT NULL);

-- Grant permissions
GRANT ALL ON public.assessments TO authenticated;
GRANT SELECT, INSERT ON public.assessments TO anon;

-- Create helper functions with unique names

-- Function to get latest assessment by category for a user
CREATE OR REPLACE FUNCTION get_latest_user_assessment_by_category(
    p_user_id UUID,
    p_category_id TEXT
)
RETURNS TABLE (
    id UUID,
    category_id TEXT,
    answers JSONB,
    total_score INTEGER,
    max_score INTEGER,
    percentage DECIMAL(5,2),
    risk_level TEXT,
    risk_factors TEXT[],
    recommendations TEXT[],
    ai_analysis JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.category_id,
        a.answers,
        a.total_score,
        a.max_score,
        a.percentage,
        a.risk_level,
        a.risk_factors,
        a.recommendations,
        a.ai_analysis,
        a.created_at,
        a.updated_at
    FROM public.assessments a
    WHERE a.user_id = p_user_id 
      AND a.category_id = p_category_id
    ORDER BY a.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get assessment statistics for a user
CREATE OR REPLACE FUNCTION get_user_assessment_statistics(p_user_id UUID)
RETURNS TABLE (
    total_assessments BIGINT,
    completed_categories TEXT[],
    average_score DECIMAL(5,2),
    latest_assessment_date TIMESTAMPTZ,
    risk_factors_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_assessments,
        ARRAY_AGG(DISTINCT a.category_id) as completed_categories,
        COALESCE(AVG(a.percentage), 0)::DECIMAL(5,2) as average_score,
        MAX(a.created_at) as latest_assessment_date,
        (SELECT COUNT(DISTINCT unnest(risk_factors)) FROM public.assessments WHERE user_id = p_user_id)::BIGINT as risk_factors_count
    FROM public.assessments a
    WHERE a.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for assessment summary
CREATE VIEW assessment_summary AS
SELECT 
    a.id,
    a.user_id,
    a.guest_session_id,
    a.category_id,
    a.total_score,
    a.max_score,
    a.percentage,
    a.risk_level,
    CARDINALITY(a.risk_factors) as risk_factors_count,
    CARDINALITY(a.recommendations) as recommendations_count,
    a.created_at,
    a.updated_at,
    CASE 
        WHEN a.percentage >= 0 AND a.percentage <= 25 THEN 'low'
        WHEN a.percentage > 25 AND a.percentage <= 50 THEN 'medium'
        WHEN a.percentage > 50 AND a.percentage <= 75 THEN 'high'
        ELSE 'very-high'
    END as calculated_risk_level
FROM public.assessments a;

-- Grant permissions on functions and views
GRANT EXECUTE ON FUNCTION get_latest_user_assessment_by_category(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_assessment_statistics(UUID) TO authenticated;
GRANT SELECT ON assessment_summary TO authenticated;
GRANT SELECT ON assessment_summary TO anon;

-- Add comments for documentation
COMMENT ON TABLE public.assessments IS 'Stores health assessment results for both registered users and guests';
COMMENT ON COLUMN public.assessments.user_id IS 'Reference to authenticated user (NULL for guests)';
COMMENT ON COLUMN public.assessments.guest_session_id IS 'Session identifier for guest users (NULL for authenticated users)';
COMMENT ON COLUMN public.assessments.category_id IS 'Assessment category identifier (basic, heart, nutrition, mental, physical, sleep)';
COMMENT ON COLUMN public.assessments.answers IS 'JSON object containing all question answers';
COMMENT ON COLUMN public.assessments.ai_analysis IS 'JSON object containing AI analysis results';
COMMENT ON FUNCTION get_latest_user_assessment_by_category(UUID, TEXT) IS 'Returns the most recent assessment for a user in a specific category';
COMMENT ON FUNCTION get_user_assessment_statistics(UUID) IS 'Returns assessment statistics for a user';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Assessments table v418 created successfully with:';
    RAISE NOTICE '- Table: public.assessments';
    RAISE NOTICE '- Functions: get_latest_user_assessment_by_category, get_user_assessment_statistics';
    RAISE NOTICE '- View: assessment_summary';
    RAISE NOTICE '- 6 indexes for performance';
    RAISE NOTICE '- RLS policies for security';
    RAISE NOTICE '- Support for both authenticated users and guests';
END $$;
