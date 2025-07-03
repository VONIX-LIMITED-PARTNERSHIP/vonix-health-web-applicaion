-- Script to verify the assessments table structure and data

-- Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'assessments' 
ORDER BY ordinal_position;

-- Check indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'assessments';

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'assessments';

-- Check functions
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name LIKE '%assessment%';

-- Count assessments by type
SELECT 
    CASE 
        WHEN user_id IS NOT NULL THEN 'registered'
        ELSE 'guest'
    END as user_type,
    category_id,
    COUNT(*) as count
FROM assessments 
GROUP BY 
    CASE 
        WHEN user_id IS NOT NULL THEN 'registered'
        ELSE 'guest'
    END,
    category_id
ORDER BY user_type, category_id;

-- Show sample data
SELECT 
    id,
    category_id,
    category_title_en,
    category_title_th,
    risk_level,
    percentage,
    ai_analysis_completed,
    completed_at
FROM assessments 
ORDER BY completed_at DESC 
LIMIT 10;
