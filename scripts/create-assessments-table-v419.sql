-- Drop existing table and related objects
DROP TABLE IF EXISTS assessments CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;

-- Create assessments table with proper JSONB support
CREATE TABLE assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    guest_session_id TEXT, -- For guest assessments
    category_id TEXT NOT NULL,
    category_title TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_score INTEGER NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 0,
    percentage INTEGER NOT NULL DEFAULT 0,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'very-high')),
    risk_factors JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
    ai_analysis JSONB DEFAULT NULL, -- Store full bilingual AI analysis
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_user_or_guest CHECK (
        (user_id IS NOT NULL AND guest_session_id IS NULL) OR 
        (user_id IS NULL AND guest_session_id IS NOT NULL)
    ),
    CONSTRAINT valid_scores CHECK (
        total_score >= 0 AND 
        max_score > 0 AND 
        percentage >= 0 AND 
        percentage <= 100
    ),
    CONSTRAINT valid_risk_factors CHECK (jsonb_typeof(risk_factors) = 'array'),
    CONSTRAINT valid_recommendations CHECK (jsonb_typeof(recommendations) = 'array'),
    CONSTRAINT valid_answers CHECK (jsonb_typeof(answers) = 'array')
);

-- Create indexes for better performance
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_guest_session_id ON assessments(guest_session_id);
CREATE INDEX idx_assessments_category_id ON assessments(category_id);
CREATE INDEX idx_assessments_completed_at ON assessments(completed_at DESC);
CREATE INDEX idx_assessments_risk_level ON assessments(risk_level);

-- Create composite indexes for common queries
CREATE INDEX idx_assessments_user_category ON assessments(user_id, category_id, completed_at DESC);
CREATE INDEX idx_assessments_guest_category ON assessments(guest_session_id, category_id, completed_at DESC);

-- Enable Row Level Security
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated users
CREATE POLICY "Users can view their own assessments" ON assessments
    FOR SELECT USING (
        auth.uid() = user_id OR 
        (user_id IS NULL AND guest_session_id IS NOT NULL)
    );

CREATE POLICY "Users can insert their own assessments" ON assessments
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        (user_id IS NULL AND guest_session_id IS NOT NULL)
    );

CREATE POLICY "Users can update their own assessments" ON assessments
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        (user_id IS NULL AND guest_session_id IS NOT NULL)
    );

CREATE POLICY "Users can delete their own assessments" ON assessments
    FOR DELETE USING (
        auth.uid() = user_id OR 
        (user_id IS NULL AND guest_session_id IS NOT NULL)
    );

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
    BEFORE UPDATE ON assessments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON assessments TO authenticated;
GRANT ALL ON assessments TO anon;

-- Create helper function to get latest assessment by category
CREATE OR REPLACE FUNCTION get_latest_assessment_by_category(
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
    risk_factors JSONB,
    recommendations JSONB,
    ai_analysis JSONB,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
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

-- Create view for assessment statistics
CREATE OR REPLACE VIEW assessment_stats AS
SELECT 
    category_id,
    category_title,
    COUNT(*) as total_assessments,
    AVG(percentage) as avg_percentage,
    COUNT(CASE WHEN risk_level = 'low' THEN 1 END) as low_risk_count,
    COUNT(CASE WHEN risk_level = 'medium' THEN 1 END) as medium_risk_count,
    COUNT(CASE WHEN risk_level = 'high' THEN 1 END) as high_risk_count,
    COUNT(CASE WHEN risk_level = 'very-high' THEN 1 END) as very_high_risk_count,
    MIN(completed_at) as first_assessment,
    MAX(completed_at) as latest_assessment
FROM assessments
GROUP BY category_id, category_title;

-- Grant access to the view
GRANT SELECT ON assessment_stats TO authenticated;
GRANT SELECT ON assessment_stats TO anon;

COMMENT ON TABLE assessments IS 'Stores health assessment results with bilingual AI analysis support';
COMMENT ON COLUMN assessments.ai_analysis IS 'Full bilingual AI analysis result in JSONB format';
COMMENT ON COLUMN assessments.risk_factors IS 'Array of risk factors (legacy format for backward compatibility)';
COMMENT ON COLUMN assessments.recommendations IS 'Array of recommendations (legacy format for backward compatibility)';
