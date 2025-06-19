-- 1. ตรวจสอบสถานะปัจจุบัน
SELECT 'Checking profiles table...' as status;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. ตรวจสอบ trigger
SELECT 'Checking auth trigger...' as status;
SELECT trigger_name, event_manipulation, event_object_table, action_statement 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 3. ตรวจสอบ function
SELECT 'Checking handle_new_user function...' as status;
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 4. ตรวจสอบ RLS policies
SELECT 'Checking RLS policies...' as status;
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'profiles';
