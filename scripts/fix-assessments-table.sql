-- ตรวจสอบและแก้ไข assessments table
SELECT 'Checking assessments table structure...' as status;

-- ตรวจสอบ columns
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'assessments' 
ORDER BY ordinal_position;

-- แก้ไข answers column ให้เป็น JSONB
ALTER TABLE assessments ALTER COLUMN answers TYPE JSONB USING answers::JSONB;

-- ตรวจสอบ RLS policies สำหรับ assessments
SELECT 'Checking assessments RLS policies...' as status;
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'assessments';

-- สร้าง index สำหรับ performance
CREATE INDEX IF NOT EXISTS idx_assessments_user_category ON assessments(user_id, category_id);
CREATE INDEX IF NOT EXISTS idx_assessments_completed_at_desc ON assessments(completed_at DESC);

-- Grant permissions
GRANT INSERT, SELECT, UPDATE, DELETE ON assessments TO authenticated;
GRANT USAGE ON SEQUENCE assessments_id_seq TO authenticated;

SELECT 'Assessments table fixed!' as result;
