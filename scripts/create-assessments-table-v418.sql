-- Drop existing table and ALL versions of functions if they exist
DROP TABLE IF EXISTS assessments CASCADE;

-- Drop all versions of get_latest_assessment_by_category function
DROP FUNCTION IF EXISTS get_latest_assessment_by_category(UUID, TEXT, TEXT);
DROP FUNCTION IF EXISTS get_latest_assessment_by_category(UUID, TEXT);
DROP FUNCTION IF EXISTS get_latest_assessment_by_category(UUID);
DROP FUNCTION IF EXISTS get_latest_assessment_by_category(TEXT, TEXT);
DROP FUNCTION IF EXISTS get_latest_assessment_by_category(TEXT);
DROP FUNCTION IF EXISTS get_latest_assessment_by_category();

-- Drop all versions of get_assessment_stats function
DROP FUNCTION IF EXISTS get_assessment_stats(UUID);
DROP FUNCTION IF EXISTS get_assessment_stats();
DROP FUNCTION IF EXISTS get_user_assessment_stats(UUID);
DROP FUNCTION IF EXISTS get_user_assessment_stats();

-- Drop views
DROP VIEW IF EXISTS assessment_summary CASCADE;

-- Drop trigger function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create assessments table
CREATE TABLE assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    guest_session_id TEXT,
    category_id TEXT NOT NULL,
    category_title TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_score INTEGER NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 100,
    percentage INTEGER NOT NULL DEFAULT 0,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'very-high')),
    risk_factors TEXT[] DEFAULT ARRAY[]::TEXT[],
    recommendations TEXT[] DEFAULT ARRAY[]::TEXT[],
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure either user_id or guest_session_id is provided, but not both
    CONSTRAINT check_user_or_guest CHECK (
        (user_id IS NOT NULL AND guest_session_id IS NULL) OR
        (user_id IS NULL AND guest_session_id IS NOT NULL)
    )
);

-- Create indexes for better performance
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_guest_session_id ON assessments(guest_session_id);
CREATE INDEX idx_assessments_category_id ON assessments(category_id);
CREATE INDEX idx_assessments_completed_at ON assessments(completed_at DESC);
CREATE INDEX idx_assessments_user_category ON assessments(user_id, category_id);
CREATE INDEX idx_assessments_guest_category ON assessments(guest_session_id, category_id);

-- Enable Row Level Security
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own assessments" ON assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments" ON assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" ON assessments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assessments" ON assessments
    FOR DELETE USING (auth.uid() = user_id);

-- Allow guest assessments (no authentication required)
CREATE POLICY "Allow guest assessments select" ON assessments
    FOR SELECT USING (guest_session_id IS NOT NULL);

CREATE POLICY "Allow guest assessments insert" ON assessments
    FOR INSERT WITH CHECK (guest_session_id IS NOT NULL);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_assessments_updated_at
    BEFORE UPDATE ON assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create NEW function to get latest assessment by category with unique name
CREATE OR REPLACE FUNCTION get_latest_user_assessment_by_category(
    p_user_id UUID DEFAULT NULL,
    p_guest_session_id TEXT DEFAULT NULL,
    p_category_id TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    guest_session_id TEXT,
    category_id TEXT,
    category_title TEXT,
    answers JSONB,
    total_score INTEGER,
    max_score INTEGER,
    percentage INTEGER,
    risk_level TEXT,
    risk_factors TEXT[],
    recommendations TEXT[],
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT a.*
    FROM assessments a
    WHERE 
        (p_user_id IS NOT NULL AND a.user_id = p_user_id) OR
        (p_guest_session_id IS NOT NULL AND a.guest_session_id = p_guest_session_id)
        AND (p_category_id IS NULL OR a.category_id = p_category_id)
    ORDER BY a.completed_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get assessment statistics with unique name
CREATE OR REPLACE FUNCTION get_user_assessment_statistics(p_user_id UUID)
RETURNS TABLE (
    total_assessments BIGINT,
    categories_completed BIGINT,
    avg_score NUMERIC,
    latest_assessment_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_assessments,
        COUNT(DISTINCT category_id) as categories_completed,
        ROUND(AVG(percentage), 2) as avg_score,
        MAX(completed_at) as latest_assessment_date
    FROM assessments
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for assessment summary
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
    CASE 
        WHEN a.risk_level = 'low' THEN 'ความเสี่ยงต่ำ'
        WHEN a.risk_level = 'medium' THEN 'ความเสี่ยงปานกลาง'
        WHEN a.risk_level = 'high' THEN 'ความเสี่ยงสูง'
        WHEN a.risk_level = 'very-high' THEN 'ความเสี่ยงสูงมาก'
        ELSE 'ไม่ระบุ'
    END as risk_level_th,
    array_length(a.risk_factors, 1) as risk_factors_count,
    array_length(a.recommendations, 1) as recommendations_count,
    a.completed_at,
    a.created_at,
    CASE 
        WHEN a.user_id IS NOT NULL THEN 'registered'
        ELSE 'guest'
    END as user_type
FROM assessments a;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON assessments TO authenticated;
GRANT SELECT, INSERT ON assessments TO anon;
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_latest_user_assessment_by_category TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_user_assessment_statistics TO authenticated;
GRANT SELECT ON assessment_summary TO authenticated, anon;

-- Add comments for documentation
COMMENT ON TABLE assessments IS 'Stores health assessment results for both registered users and guests';
COMMENT ON COLUMN assessments.user_id IS 'Reference to authenticated user (NULL for guest assessments)';
COMMENT ON COLUMN assessments.guest_session_id IS 'Session identifier for guest users (NULL for authenticated users)';
COMMENT ON COLUMN assessments.category_id IS 'Assessment category identifier (basic, heart, mental, etc.)';
COMMENT ON COLUMN assessments.answers IS 'JSON array of question answers with scores';
COMMENT ON COLUMN assessments.risk_level IS 'Calculated risk level: low, medium, high, very-high';
COMMENT ON COLUMN assessments.risk_factors IS 'Array of identified risk factors';
COMMENT ON COLUMN assessments.recommendations IS 'Array of health recommendations';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Assessment table v418 created successfully!';
    RAISE NOTICE '📋 Features included:';
    RAISE NOTICE '  - User and guest assessment support';
    RAISE NOTICE '  - Row Level Security (RLS) policies';
    RAISE NOTICE '  - Performance indexes (6 indexes)';
    RAISE NOTICE '  - Helper functions and views';
    RAISE NOTICE '  - Automatic timestamp updates';
    RAISE NOTICE '  - Bilingual risk level support';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Functions created:';
    RAISE NOTICE '  - get_latest_user_assessment_by_category()';
    RAISE NOTICE '  - get_user_assessment_statistics()';
    RAISE NOTICE '  - update_updated_at_column()';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Views created:';
    RAISE NOTICE '  - assessment_summary';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Ready to use!';
END $$;
