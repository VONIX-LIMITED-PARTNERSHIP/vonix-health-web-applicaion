-- ล้าง auth sessions ที่อาจจะค้างอยู่
DELETE FROM auth.sessions WHERE expires_at < NOW();

-- ล้าง refresh tokens ที่หมดอายุ
DELETE FROM auth.refresh_tokens WHERE expires_at < NOW();

-- ตรวจสอบ sessions ที่เหลือ
SELECT 
  id,
  user_id,
  created_at,
  updated_at,
  expires_at,
  CASE 
    WHEN expires_at > NOW() THEN 'Active'
    ELSE 'Expired'
  END as status
FROM auth.sessions 
ORDER BY updated_at DESC 
LIMIT 10;

SELECT 'Auth sessions cleaned!' as result;
