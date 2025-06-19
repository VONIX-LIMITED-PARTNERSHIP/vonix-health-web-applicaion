-- 1. ตรวจสอบ users ที่ไม่มี profile
SELECT 'Users without profiles:' as status;
SELECT 
  au.id,
  au.email,
  au.created_at as user_created,
  p.id as profile_id
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 2. สร้าง profiles สำหรับ users ที่ไม่มี
INSERT INTO public.profiles (
  id, 
  email, 
  full_name, 
  role, 
  pdpa_consent,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  COALESCE(au.raw_user_meta_data->>'role', 'patient'),
  COALESCE((au.raw_user_meta_data->>'pdpa_consent')::boolean, false),
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 3. ตรวจสอบผลลัพธ์
SELECT 'Profiles created successfully!' as result;
SELECT COUNT(*) as total_profiles FROM public.profiles;
SELECT COUNT(*) as total_users FROM auth.users;
