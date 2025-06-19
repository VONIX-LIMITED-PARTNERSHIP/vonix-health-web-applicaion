-- Fix RLS policies for assessments table
DROP POLICY IF EXISTS "Users can insert their own assessments" ON assessments;
DROP POLICY IF EXISTS "Users can view their own assessments" ON assessments;
DROP POLICY IF EXISTS "Users can update their own assessments" ON assessments;

-- Create new policies with better error handling
CREATE POLICY "Users can insert their own assessments" ON assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own assessments" ON assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" ON assessments
  FOR UPDATE USING (auth.uid() = user_id);

-- Ensure the table has proper indexes
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_category_id ON assessments(category_id);
CREATE INDEX IF NOT EXISTS idx_assessments_completed_at ON assessments(completed_at);

-- Grant necessary permissions
GRANT INSERT, SELECT, UPDATE ON assessments TO authenticated;
GRANT USAGE ON SEQUENCE assessments_id_seq TO authenticated;
