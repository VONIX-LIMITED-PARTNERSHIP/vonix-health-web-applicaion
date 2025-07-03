-- Insert sample guest assessment data for testing
-- This script creates sample guest assessments to verify the table structure

DO $$
BEGIN
    -- Insert sample guest assessments for each category
    INSERT INTO assessments (
        guest_session_id,
        category_id,
        category_title_en,
        category_title_th,
        answers,
        total_score,
        max_score,
        percentage,
        risk_level,
        risk_factors_en,
        risk_factors_th,
        recommendations_en,
        recommendations_th,
        summary_en,
        summary_th,
        ai_analysis_completed
    ) VALUES 
    (
        'guest_basic_' || extract(epoch from now())::text,
        'basic',
        'Basic Health Assessment',
        'การประเมินสุขภาพพื้นฐาน',
        '{"age": 30, "gender": "male", "weight": 70, "height": 175}',
        75,
        100,
        75,
        'medium',
        ARRAY['Slightly overweight', 'Sedentary lifestyle'],
        ARRAY['น้ำหนักเกินเล็กน้อย', 'ขาดการออกกำลังกาย'],
        ARRAY['Increase physical activity', 'Maintain balanced diet'],
        ARRAY['เพิ่มการออกกำลังกาย', 'รักษาอาหารที่สมดุล'],
        'Your basic health assessment shows moderate risk factors that can be improved with lifestyle changes.',
        'การประเมินสุขภาพพื้นฐานของคุณแสดงปัจจัยเสี่ยงระดับปานกลางที่สามารถปรับปรุงได้ด้วยการเปลี่ยนแปลงวิถีชีวิต',
        true
    ),
    (
        'guest_heart_' || extract(epoch from now())::text,
        'heart',
        'Heart Health Assessment',
        'การประเมินสุขภาพหัวใจ',
        '{"blood_pressure": "120/80", "cholesterol": "normal", "family_history": false}',
        85,
        100,
        85,
        'low',
        ARRAY['Normal blood pressure', 'Good cholesterol levels'],
        ARRAY['ความดันโลหิตปกติ', 'ระดับคอเลสเตอรอลดี'],
        ARRAY['Continue regular exercise', 'Monitor blood pressure monthly'],
        ARRAY['ออกกำลังกายสม่ำเสมอต่อไป', 'ตรวจความดันโลหิตรายเดือน'],
        'Your heart health is in good condition. Continue your current healthy habits.',
        'สุขภาพหัวใจของคุณอยู่ในสภาพดี ควรรักษานิสัยที่ดีต่อสุขภาพต่อไป',
        true
    ),
    (
        'guest_lifestyle_' || extract(epoch from now())::text,
        'lifestyle',
        'Lifestyle Assessment',
        'การประเมินวิถีชีวิต',
        '{"exercise_frequency": 2, "sleep_hours": 6, "stress_level": 7, "smoking": false}',
        60,
        100,
        60,
        'medium',
        ARRAY['Insufficient sleep', 'High stress levels', 'Low exercise frequency'],
        ARRAY['นอนไม่เพียงพอ', 'ความเครียดสูง', 'ออกกำลังกายน้อย'],
        ARRAY['Aim for 7-8 hours of sleep', 'Practice stress management', 'Exercise at least 3 times per week'],
        ARRAY['นอนให้ครบ 7-8 ชั่วโมง', 'ฝึกการจัดการความเครียด', 'ออกกำลังกายอย่างน้อยสัปดาห์ละ 3 ครั้ง'],
        'Your lifestyle assessment indicates areas for improvement in sleep, stress management, and physical activity.',
        'การประเมินวิถีชีวิตของคุณชี้ให้เห็นจุดที่ต้องปรับปรุงในเรื่องการนอน การจัดการความเครียด และการออกกำลังกาย',
        true
    ),
    (
        'guest_mental_' || extract(epoch from now())::text,
        'mental',
        'Mental Health Assessment',
        'การประเมินสุขภาพจิต',
        '{"mood_rating": 6, "anxiety_level": 5, "social_support": 8, "work_satisfaction": 7}',
        70,
        100,
        70,
        'medium',
        ARRAY['Moderate anxiety levels', 'Average mood stability'],
        ARRAY['ความวิตกกังวลระดับปานกลาง', 'อารมณ์ค่อนข้างแปรปรวน'],
        ARRAY['Consider mindfulness practices', 'Maintain social connections', 'Seek professional help if needed'],
        ARRAY['ลองฝึกสติ', 'รักษาความสัมพันธ์ทางสังคม', 'ปรึกษาผู้เชี่ยวชาญหากจำเป็น'],
        'Your mental health shows some areas of concern. Consider implementing stress reduction techniques.',
        'สุขภาพจิตของคุณมีบางจุดที่น่าเป็นห่วง ควรพิจารณาใช้เทคนิคลดความเครียด',
        true
    ),
    (
        'guest_physical_' || extract(epoch from now())::text,
        'physical',
        'Physical Health Assessment',
        'การประเมินสุขภาพกาย',
        '{"strength": 7, "flexibility": 5, "endurance": 6, "balance": 8}',
        65,
        100,
        65,
        'medium',
        ARRAY['Limited flexibility', 'Moderate endurance'],
        ARRAY['ความยืดหยุ่นจำกัด', 'ความอดทนปานกลาง'],
        ARRAY['Include stretching exercises', 'Gradually increase cardio activities', 'Focus on core strength'],
        ARRAY['เพิ่มการยืดเหยียด', 'เพิ่มกิจกรรมคาร์ดิโอค่อยเป็นค่อยไป', 'เน้นความแข็งแรงของกล้ามเนื้อแกนกลาง'],
        'Your physical fitness has room for improvement, particularly in flexibility and endurance.',
        'สมรรถภาพทางกายของคุณยังมีที่ปรับปรุงได้ โดยเฉพาะความยืดหยุ่นและความอดทน',
        true
    ),
    (
        'guest_sleep_' || extract(epoch from now())::text,
        'sleep',
        'Sleep Quality Assessment',
        'การประเมินคุณภาพการนอน',
        '{"sleep_duration": 6, "sleep_quality": 5, "bedtime_consistency": 4, "wake_refreshed": 3}',
        45,
        100,
        45,
        'high',
        ARRAY['Insufficient sleep duration', 'Poor sleep quality', 'Inconsistent bedtime', 'Not waking refreshed'],
        ARRAY['นอนไม่เพียงพอ', 'คุณภาพการนอนแย่', 'เวลานอนไม่สม่ำเสมอ', 'ตื่นมาไม่สดชื่น'],
        ARRAY['Establish consistent sleep schedule', 'Create relaxing bedtime routine', 'Limit screen time before bed', 'Consider sleep hygiene practices'],
        ARRAY['กำหนดเวลานอนให้สม่ำเสมอ', 'สร้างกิจวัตรผ่อนคลายก่อนนอน', 'จำกัดการใช้หน้าจอก่อนนอน', 'ปฏิบัติตามหลักสุขอนามัยการนอน'],
        'Your sleep assessment indicates significant issues that may be affecting your overall health and well-being.',
        'การประเมินการนอนของคุณชี้ให้เห็นปัญหาสำคัญที่อาจส่งผลต่อสุขภาพและความเป็นอยู่โดยรวม',
        true
    )
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Sample guest assessments inserted successfully!';
    
END $$;

-- Create assessment categories reference table
CREATE TABLE IF NOT EXISTS assessment_categories (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_th TEXT NOT NULL,
  description_en TEXT,
  description_th TEXT,
  icon TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert assessment categories
INSERT INTO assessment_categories (id, title_en, title_th, description_en, description_th, icon, color, order_index) VALUES
('basic', 'Basic Health', 'สุขภาพพื้นฐาน', 'General health assessment covering basic health indicators', 'การประเมินสุขภาพทั่วไปครอบคลุมตัวชี้วัดสุขภาพพื้นฐาน', 'Heart', 'blue', 1),
('heart', 'Heart Health', 'สุขภาพหัวใจ', 'Cardiovascular health assessment focusing on heart-related risks', 'การประเมินสุขภาพหัวใจและหลอดเลือด เน้นความเสี่ยงที่เกี่ยวข้องกับหัวใจ', 'Heart', 'red', 2),
('lifestyle', 'Lifestyle', 'วิถีชีวิต', 'Assessment of daily habits and lifestyle choices affecting health', 'การประเมินนิสัยประจำวันและการเลือกวิถีชีวิตที่ส่งผลต่อสุขภาพ', 'Activity', 'green', 3),
('mental', 'Mental Health', 'สุขภาพจิต', 'Mental health and psychological wellbeing assessment', 'การประเมินสุขภาพจิตและความเป็นอยู่ทางจิตใจ', 'Brain', 'purple', 4),
('physical', 'Physical Health', 'สุขภาพกาย', 'Physical fitness and body health assessment', 'การประเมินสมรรถภาพทางกายและสุขภาพร่างกาย', 'Dumbbell', 'orange', 5),
('sleep', 'Sleep Quality', 'คุณภาพการนอน', 'Sleep patterns and quality assessment', 'การประเมินรูปแบบการนอนและคุณภาพการนอน', 'Moon', 'indigo', 6)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_th = EXCLUDED.title_th,
  description_en = EXCLUDED.description_en,
  description_th = EXCLUDED.description_th,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  order_index = EXCLUDED.order_index;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assessment_categories_active ON assessment_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_assessment_categories_order ON assessment_categories(order_index);

-- Enable RLS
ALTER TABLE assessment_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assessment_categories
CREATE POLICY "Assessment categories are viewable by everyone" ON assessment_categories
  FOR SELECT USING (is_active = true);

-- Grant permissions
GRANT SELECT ON assessment_categories TO authenticated;
GRANT SELECT ON assessment_categories TO anon;

-- Add comment
COMMENT ON TABLE assessment_categories IS 'Reference table for assessment categories with bilingual support';

-- Verify the data was inserted
SELECT 
    category_id,
    category_title_en,
    category_title_th,
    risk_level,
    percentage,
    CASE WHEN user_id IS NOT NULL THEN 'registered' ELSE 'guest' END as user_type,
    LEFT(guest_session_id, 20) || '...' as session_preview
FROM assessments 
ORDER BY category_id, completed_at DESC;

-- Show assessment categories
SELECT 
    id,
    title_en,
    title_th,
    icon,
    color,
    order_index
FROM assessment_categories 
ORDER BY order_index;
