-- ทดสอบว่า Auth Trigger ทำงานหรือไม่
SELECT 'Testing auth trigger...' as status;

-- ตรวจสอบ trigger
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- ตรวจสอบ function
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- ตรวจสอบ permissions
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.routine_privileges 
WHERE routine_name = 'handle_new_user';
