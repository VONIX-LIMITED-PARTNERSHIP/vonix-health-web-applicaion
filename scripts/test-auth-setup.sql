-- Test if the auth trigger is working
SELECT 
  schemaname, 
  tablename, 
  attname, 
  n_distinct, 
  correlation 
FROM pg_stats 
WHERE tablename = 'profiles';

-- Check if the trigger exists
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table, 
  action_statement 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if the function exists
SELECT 
  routine_name, 
  routine_type, 
  routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Test RLS policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename = 'profiles';
