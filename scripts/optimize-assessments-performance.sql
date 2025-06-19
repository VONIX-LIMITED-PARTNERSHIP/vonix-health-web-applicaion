-- เพิ่มประสิทธิภาพการบันทึก assessments
SELECT 'Optimizing assessments table performance...' as status;

-- เพิ่ม indexes สำหรับ performance
CREATE INDEX IF NOT EXISTS idx_assessments_user_category_time ON assessments(user_id, category_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_recent ON assessments(completed_at DESC) WHERE completed_at > NOW() - INTERVAL '1 hour';

-- ปรับปรุง RLS policies ให้เร็วขึ้น
DROP POLICY IF EXISTS "assessments_user_access" ON assessments;

CREATE POLICY "assessments_select_policy" ON assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "assessments_insert_policy" ON assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "assessments_update_policy" ON assessments
    FOR UPDATE USING (auth.uid() = user_id);

-- เพิ่ม constraint เพื่อป้องกัน duplicate ในช่วงเวลาสั้น
-- (ไม่ใส่ unique constraint เพราะอาจจะต้องการ re-assessment)

-- ตรวจสอบ table statistics
ANALYZE assessments;

-- Grant permissions
GRANT ALL ON assessments TO authenticated;
GRANT USAGE ON SEQUENCE assessments_id_seq TO authenticated;

SELECT 'Assessments performance optimized!' as result;
