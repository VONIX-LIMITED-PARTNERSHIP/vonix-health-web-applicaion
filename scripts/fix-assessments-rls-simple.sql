-- แก้ไข RLS policies สำหรับ assessments ให้ง่ายขึ้น
ALTER TABLE assessments DISABLE ROW LEVEL SECURITY;

-- ลบ policies เก่าทั้งหมด
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'assessments') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON assessments';
    END LOOP;
END $$;

-- เปิด RLS อีกครั้ง
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- สร้าง policies ใหม่ที่ง่ายกว่า
CREATE POLICY "assessments_user_access" ON assessments
    FOR ALL USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    ) WITH CHECK (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

-- Grant permissions
GRANT ALL ON assessments TO anon, authenticated, service_role;

SELECT 'Assessments RLS policies simplified!' as result;
