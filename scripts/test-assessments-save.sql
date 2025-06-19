-- ทดสอบการบันทึก assessments
SELECT 'Testing assessments table...' as status;

-- ตรวจสอบ structure
\d assessments;

-- ตรวจสอบ permissions
SELECT 
  grantee, 
  privilege_type, 
  is_grantable 
FROM information_schema.table_privileges 
WHERE table_name = 'assessments' 
AND grantee IN ('authenticated', 'anon', 'service_role');

-- ตรวจสอบ RLS policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd 
FROM pg_policies 
WHERE tablename = 'assessments';

-- ทดสอบ insert (ถ้ามี user)
-- INSERT INTO assessments (user_id, category_id, category_title, answers, total_score, max_score, percentage, risk_level) 
-- VALUES ('test-user-id', 'test', 'Test Category', '[]'::jsonb, 0, 100, 0, 'low');

SELECT 'Assessments table test completed!' as result;
