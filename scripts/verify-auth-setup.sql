-- Verify everything is working
SELECT 'Testing auth setup...' as status;

-- Check if trigger exists
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN 'TRIGGER EXISTS ✓'
    ELSE 'TRIGGER MISSING ✗'
  END as trigger_status
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if function exists
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN 'FUNCTION EXISTS ✓'
    ELSE 'FUNCTION MISSING ✗'
  END as function_status
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Check RLS status
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN 'RLS POLICIES EXIST ✓'
    ELSE 'RLS POLICIES MISSING ✗'
  END as rls_status
FROM pg_policies 
WHERE tablename = 'profiles';

-- Check table structure
SELECT 'PROFILES TABLE COLUMNS:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
