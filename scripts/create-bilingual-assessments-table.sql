-- Drop existing assessments table if exists (be careful in production!)
DROP TABLE IF EXISTS assessments CASCADE;

-- Create assessments table with bilingual support
CREATE TABLE assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  guest_session_id TEXT, -- For guest assessments
  category_id TEXT NOT NULL,
  
  -- Bilingual category titles
  category_title_en TEXT NOT NULL,
  category_title_th TEXT NOT NULL,
  
  -- Assessment data
  answers JSONB NOT NULL,
  total_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  
  -- Risk assessment
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'very-high')),
  
  -- Bilingual risk factors
  risk_factors_en TEXT[] DEFAULT '{}',
  risk_factors_th TEXT[] DEFAULT '{}',
  
  -- Bilingual recommendations
  recommendations_en TEXT[] DEFAULT '{}',
  recommendations_th TEXT[] DEFAULT '{}',
  
  -- Bilingual summaries
  summary_en TEXT,
  summary_th TEXT,
  
  -- Additional metadata
  assessment_version TEXT DEFAULT '1.0',
  ai_analysis_completed BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_user_or_guest CHECK (
    (user_id IS NOT NULL AND guest_session_id IS NULL) OR 
    (user_id IS NULL AND guest_session_id IS NOT NULL)
  )
);

-- Create indexes for better performance
CREATE INDEX idx_assessments_user_id ON assessments(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_assessments_guest_session ON assessments(guest_session_id) WHERE guest_session_id IS NOT NULL;
CREATE INDEX idx_assessments_category_id ON assessments(category_id);
CREATE INDEX idx_assessments_completed_at ON assessments(completed_at DESC);
CREATE INDEX idx_assessments_risk_level ON assessments(risk_level);
CREATE INDEX idx_assessments_user_category_completed ON assessments(user_id, category_id, completed_at DESC) WHERE user_id IS NOT NULL;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_assessments_updated_at ON assessments;
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_assessments_updated_at();

-- Enable Row Level Security
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own assessments
CREATE POLICY "Users can view own assessments" ON assessments
  FOR SELECT USING (
    auth.uid() = user_id OR 
    user_id IS NULL -- Allow viewing guest assessments
  );

-- Users can insert their own assessments
CREATE POLICY "Users can insert own assessments" ON assessments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    user_id IS NULL -- Allow guest assessments
  );

-- Users can update their own assessments
CREATE POLICY "Users can update own assessments" ON assessments
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own assessments
CREATE POLICY "Users can delete own assessments" ON assessments
  FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON assessments TO authenticated;
GRANT SELECT ON assessments TO anon; -- For guest assessments

-- Create function to get latest assessment by category
CREATE OR REPLACE FUNCTION get_latest_assessment_by_category(
  p_user_id UUID,
  p_category_id TEXT
)
RETURNS TABLE (
  id UUID,
  category_id TEXT,
  category_title_en TEXT,
  category_title_th TEXT,
  total_score INTEGER,
  max_score INTEGER,
  percentage INTEGER,
  risk_level TEXT,
  risk_factors_en TEXT[],
  risk_factors_th TEXT[],
  recommendations_en TEXT[],
  recommendations_th TEXT[],
  summary_en TEXT,
  summary_th TEXT,
  completed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.category_id,
    a.category_title_en,
    a.category_title_th,
    a.total_score,
    a.max_score,
    a.percentage,
    a.risk_level,
    a.risk_factors_en,
    a.risk_factors_th,
    a.recommendations_en,
    a.recommendations_th,
    a.summary_en,
    a.summary_th,
    a.completed_at
  FROM assessments a
  WHERE a.user_id = p_user_id 
    AND a.category_id = p_category_id
  ORDER BY a.completed_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get assessment statistics
CREATE OR REPLACE FUNCTION get_assessment_stats(p_user_id UUID)
RETURNS TABLE (
  total_assessments BIGINT,
  categories_completed BIGINT,
  avg_score NUMERIC,
  latest_assessment_date TIMESTAMP WITH TIME ZONE,
  risk_distribution JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_assessments,
    COUNT(DISTINCT category_id) as categories_completed,
    ROUND(AVG(percentage), 2) as avg_score,
    MAX(completed_at) as latest_assessment_date,
    jsonb_object_agg(risk_level, risk_count) as risk_distribution
  FROM (
    SELECT 
      category_id,
      percentage,
      completed_at,
      risk_level,
      COUNT(*) OVER (PARTITION BY risk_level) as risk_count
    FROM assessments 
    WHERE user_id = p_user_id
  ) stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_latest_assessment_by_category(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_assessment_stats(UUID) TO authenticated;

-- Create view for assessment summary
CREATE OR REPLACE VIEW assessment_summary AS
SELECT 
  a.id,
  a.user_id,
  a.guest_session_id,
  a.category_id,
  a.category_title_en,
  a.category_title_th,
  a.total_score,
  a.max_score,
  a.percentage,
  a.risk_level,
  a.completed_at,
  p.full_name as user_name,
  p.email as user_email,
  CASE 
    WHEN a.user_id IS NOT NULL THEN 'registered'
    ELSE 'guest'
  END as user_type
FROM assessments a
LEFT JOIN profiles p ON a.user_id = p.id;

-- Grant permissions on view
GRANT SELECT ON assessment_summary TO authenticated;
GRANT SELECT ON assessment_summary TO anon;

-- Add comment to table
COMMENT ON TABLE assessments IS 'Bilingual health assessments with support for both registered users and guests';
COMMENT ON COLUMN assessments.user_id IS 'Reference to registered user (NULL for guest assessments)';
COMMENT ON COLUMN assessments.guest_session_id IS 'Session ID for guest assessments (NULL for registered users)';
COMMENT ON COLUMN assessments.category_title_en IS 'Assessment category title in English';
COMMENT ON COLUMN assessments.category_title_th IS 'Assessment category title in Thai';
COMMENT ON COLUMN assessments.risk_factors_en IS 'Risk factors in English';
COMMENT ON COLUMN assessments.risk_factors_th IS 'Risk factors in Thai';
COMMENT ON COLUMN assessments.recommendations_en IS 'Recommendations in English';
COMMENT ON COLUMN assessments.recommendations_th IS 'Recommendations in Thai';
COMMENT ON COLUMN assessments.summary_en IS 'AI-generated summary in English';
COMMENT ON COLUMN assessments.summary_th IS 'AI-generated summary in Thai';
