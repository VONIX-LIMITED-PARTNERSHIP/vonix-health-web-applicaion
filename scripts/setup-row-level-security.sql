-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Assessments policies
CREATE POLICY "Users can view own assessments" ON assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments" ON assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments" ON assessments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments" ON assessments
  FOR DELETE USING (auth.uid() = user_id);

-- Audit logs policies
CREATE POLICY "Users can view own audit logs" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own audit logs" ON audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
