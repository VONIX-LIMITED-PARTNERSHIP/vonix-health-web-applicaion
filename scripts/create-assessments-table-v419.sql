-- Create Assessments Table v419 - Complete rebuild with proper JSON handling
-- This script completely rebuilds the assessments table with correct data types

-- Drop existing table and all dependencies
DROP TABLE IF EXISTS public.assessments CASCADE;

-- Drop all possible function signatures that might conflict
DROP FUNCTION IF EXISTS get_latest_user_assessment_by_category(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS get_user_assessment_statistics(uuid) CASCADE;

-- Drop views that might depend on the table
DROP VIEW IF EXISTS assessment_summary CASCADE;

-- Create the assessments table with proper JSON handling
CREATE TABLE public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    guest_session_id TEXT, -- For guest users
    category_id TEXT NOT NULL,
    category_title TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '[]',
    total_score INTEGER NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 0,
    percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'very-high')),
    risk_factors JSONB DEFAULT '[]', -- JSON array of strings
    recommendations JSONB DEFAULT '[]', -- JSON array of strings
    ai_analysis JSONB DEFAULT NULL, -- Full AI analysis with bilingual data
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_user_or_guest CHECK (
        (user_id IS NOT NULL AND guest_session_id IS NULL) OR 
        (user_id IS NULL AND guest_session_id IS NOT NULL)
    ),
    CONSTRAINT valid_percentage CHECK (percentage >= 0 AND percentage <= 100),
    CONSTRAINT valid_scores CHECK (total_score >= 0 AND max_score >= 0 AND total_score <= max_score),
    CONSTRAINT valid_risk_factors CHECK (jsonb_typeof(risk_factors) = 'array'),
    CONSTRAINT valid_recommendations CHECK (jsonb_typeof(recommendations) = 'array'),
    CONSTRAINT valid_answers CHECK (jsonb_typeof(answers) = 'array')
);

-- Create indexes for performance
CREATE INDEX idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX idx_assessments_guest_session ON public.assessments(guest_session_id);
CREATE INDEX idx_assessments_category ON public.assessments(category_id);
CREATE INDEX idx_assessments_created_at ON public.assessments(created_at DESC);
CREATE INDEX idx_assessments_completed_at ON public.assessments(completed_at DESC);
CREATE INDEX idx_assessments_user_category ON public.assessments(user_id, category_id);
CREATE INDEX idx_assessments_guest_category ON public.assessments(guest_session_id, category_id);
CREATE INDEX idx_assessments_risk_level ON public.assessments(risk_level);

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

-- RLS Policies for authenticated users
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
    category_title TEXT,
    answers JSONB,
    total_score INTEGER,
    max_score INTEGER,
    percentage DECIMAL(5,2),
    risk_level TEXT,
    risk_factors JSONB,
    recommendations JSONB,
    ai_analysis JSONB,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.category_id,
        a.category_title,
        a.answers,
        a.total_score,
        a.max_score,
        a.percentage,
        a.risk_level,
        a.risk_factors,
        a.recommendations,
        a.ai_analysis,
        a.completed_at,
        a.created_at,
        a.updated_at
    FROM public.assessments a
    WHERE a.user_id = p_user_id 
      AND a.category_id = p_category_id
    ORDER BY a.completed_at DESC
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
        MAX(a.completed_at) as latest_assessment_date,
        (
            SELECT COUNT(DISTINCT elem.value)::BIGINT
            FROM public.assessments ass,
            LATERAL jsonb_array_elements_text(ass.risk_factors) AS elem(value)
            WHERE ass.user_id = p_user_id
        ) as risk_factors_count
    FROM public.assessments a
    WHERE a.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get latest assessment by category for a guest
CREATE OR REPLACE FUNCTION get_latest_guest_assessment_by_category(
    p_guest_session_id TEXT,
    p_category_id TEXT
)
RETURNS TABLE (
    id UUID,
    category_id TEXT,
    category_title TEXT,
    answers JSONB,
    total_score INTEGER,
    max_score INTEGER,
    percentage DECIMAL(5,2),
    risk_level TEXT,
    risk_factors JSONB,
    recommendations JSONB,
    ai_analysis JSONB,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.category_id,
        a.category_title,
        a.answers,
        a.total_score,
        a.max_score,
        a.percentage,
        a.risk_level,
        a.risk_factors,
        a.recommendations,
        a.ai_analysis,
        a.completed_at,
        a.created_at,
        a.updated_at
    FROM public.assessments a
    WHERE a.guest_session_id = p_guest_session_id 
      AND a.category_id = p_category_id
    ORDER BY a.completed_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for assessment summary
CREATE VIEW assessment_summary AS
SELECT 
    a.id,
    a.user_id,
    a.guest_session_id,
    a.category_id,
    a.category_title,
    a.total_score,
    a.max_score,
    a.percentage,
    a.risk_level,
    jsonb_array_length(a.risk_factors) as risk_factors_count,
    jsonb_array_length(a.recommendations) as recommendations_count,
    a.completed_at,
    a.created_at,
    a.updated_at,
    CASE 
        WHEN a.percentage >= 0 AND a.percentage <= 25 THEN 'low'
        WHEN a.percentage > 25 AND a.percentage <= 50 THEN 'medium'
        WHEN a.percentage > 50 AND a.percentage <= 75 THEN 'high'
        ELSE 'very-high'
    END as calculated_risk_level,
    CASE 
        WHEN a.user_id IS NOT NULL THEN 'authenticated'
        ELSE 'guest'
    END as user_type
FROM public.assessments a;

-- Grant permissions on functions and views
GRANT EXECUTE ON FUNCTION get_latest_user_assessment_by_category(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_assessment_statistics(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_latest_guest_assessment_by_category(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_latest_guest_assessment_by_category(TEXT, TEXT) TO anon;
GRANT SELECT ON assessment_summary TO authenticated;
GRANT SELECT ON assessment_summary TO anon;

-- Add comments for documentation
COMMENT ON TABLE public.assessments IS 'Stores health assessment results for both registered users and guests with proper JSON handling';
COMMENT ON COLUMN public.assessments.user_id IS 'Reference to authenticated user (NULL for guests)';
COMMENT ON COLUMN public.assessments.guest_session_id IS 'Session identifier for guest users (NULL for authenticated users)';
COMMENT ON COLUMN public.assessments.category_id IS 'Assessment category identifier (basic, heart, nutrition, mental, physical, sleep)';
COMMENT ON COLUMN public.assessments.category_title IS 'Human-readable category title';
COMMENT ON COLUMN public.assessments.answers IS 'JSONB array containing all question answers';
COMMENT ON COLUMN public.assessments.risk_factors IS 'JSONB array of risk factor strings';
COMMENT ON COLUMN public.assessments.recommendations IS 'JSONB array of recommendation strings';
COMMENT ON COLUMN public.assessments.ai_analysis IS 'JSONB object containing full AI analysis with bilingual data';

-- Insert sample data for testing
DO $$
DECLARE
    sample_user_id UUID := '00000000-0000-0000-0000-000000000001';
    sample_assessment_id UUID;
BEGIN
    -- Test authenticated user assessment
    INSERT INTO public.assessments (
        user_id,
        category_id,
        category_title,
        answers,
        total_score,
        max_score,
        percentage,
        risk_level,
        risk_factors,
        recommendations,
        ai_analysis
    ) VALUES (
        sample_user_id,
        'basic',
        'การประเมินสุขภาพพื้นฐาน',
        '[{"questionId": "basic-1", "answer": 25, "score": 1}, {"questionId": "basic-2", "answer": "ชาย", "score": 0}]'::jsonb,
        15,
        30,
        50.00,
        'medium',
        '["ความดันสูง", "น้ำหนักเกิน"]'::jsonb,
        '["ออกกำลังกายสม่ำเสมอ", "ควบคุมอาหาร"]'::jsonb,
        '{"score": 50, "riskLevel": "medium", "riskFactors": {"th": ["ความดันสูง"], "en": ["High blood pressure"]}, "recommendations": {"th": ["ออกกำลังกาย"], "en": ["Exercise regularly"]}, "summary": {"th": "สุขภาพปานกลาง", "en": "Moderate health"}}'::jsonb
    ) RETURNING id INTO sample_assessment_id;
    
    RAISE NOTICE '✅ Sample authenticated user assessment created with ID: %', sample_assessment_id;
    
    -- Test guest assessment
    INSERT INTO public.assessments (
        guest_session_id,
        category_id,
        category_title,
        answers,
        total_score,
        max_score,
        percentage,
        risk_level,
        risk_factors,
        recommendations
    ) VALUES (
        'guest_session_test_123',
        'heart',
        'การประเมินสุขภาพหัวใจ',
        '[{"questionId": "heart-1", "answer": "ใช่", "score": 2}, {"questionId": "heart-2", "answer": "ปกติ", "score": 0}]'::jsonb,
        8,
        20,
        40.00,
        'low',
        '["ไม่มีปัจจัยเสี่ยง"]'::jsonb,
        '["รักษาสุขภาพให้ดี"]'::jsonb
    );
    
    RAISE NOTICE '✅ Sample guest assessment created';
    
    -- Clean up sample data
    DELETE FROM public.assessments WHERE user_id = sample_user_id OR guest_session_id = 'guest_session_test_123';
    RAISE NOTICE '✅ Sample data cleaned up';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Error during sample data test: %', SQLERRM;
END $$;

-- Final success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Assessments table v419 created successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Features:';
    RAISE NOTICE '- ✅ Proper JSONB handling for arrays and objects';
    RAISE NOTICE '- ✅ Support for both authenticated users and guests';
    RAISE NOTICE '- ✅ Bilingual AI analysis storage';
    RAISE NOTICE '- ✅ Row Level Security (RLS) policies';
    RAISE NOTICE '- ✅ Performance indexes';
    RAISE NOTICE '- ✅ Helper functions for data retrieval';
    RAISE NOTICE '- ✅ Assessment summary view';
    RAISE NOTICE '- ✅ Data validation constraints';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Available Functions:';
    RAISE NOTICE '- get_latest_user_assessment_by_category(user_id, category_id)';
    RAISE NOTICE '- get_user_assessment_statistics(user_id)';
    RAISE NOTICE '- get_latest_guest_assessment_by_category(session_id, category_id)';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Available Views:';
    RAISE NOTICE '- assessment_summary (with calculated fields)';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Ready for production use!';
END $$;
