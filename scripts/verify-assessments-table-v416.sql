-- Verify assessments table structure and functionality
DO $$
DECLARE
    table_exists BOOLEAN;
    index_count INTEGER;
    policy_count INTEGER;
    function_count INTEGER;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'assessments'
    ) INTO table_exists;
    
    IF table_exists THEN
        RAISE NOTICE '✅ Assessments table exists';
    ELSE
        RAISE NOTICE '❌ Assessments table does not exist';
        RETURN;
    END IF;
    
    -- Check indexes
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes 
    WHERE tablename = 'assessments';
    
    RAISE NOTICE '📊 Found % indexes on assessments table', index_count;
    
    -- Check RLS policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename = 'assessments';
    
    RAISE NOTICE '🔒 Found % RLS policies on assessments table', policy_count;
    
    -- Check functions
    SELECT COUNT(*) INTO function_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' 
    AND p.proname LIKE '%assessment%';
    
    RAISE NOTICE '⚙️ Found % assessment-related functions', function_count;
    
    -- Show table structure
    RAISE NOTICE '📋 Table structure:';
    FOR rec IN 
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'assessments' 
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE '  - %: % (nullable: %, default: %)', 
            rec.column_name, rec.data_type, rec.is_nullable, 
            COALESCE(rec.column_default, 'none');
    END LOOP;
    
    -- Show indexes
    RAISE NOTICE '📊 Indexes:';
    FOR rec IN 
        SELECT indexname, indexdef
        FROM pg_indexes 
        WHERE tablename = 'assessments'
        ORDER BY indexname
    LOOP
        RAISE NOTICE '  - %', rec.indexname;
    END LOOP;
    
    -- Show RLS policies
    RAISE NOTICE '🔒 RLS Policies:';
    FOR rec IN 
        SELECT policyname, cmd, qual
        FROM pg_policies 
        WHERE tablename = 'assessments'
        ORDER BY policyname
    LOOP
        RAISE NOTICE '  - % (%)', rec.policyname, rec.cmd;
    END LOOP;
    
    RAISE NOTICE '✅ Assessment table verification completed!';
END $$;

-- Test basic functionality
DO $$
DECLARE
    test_result RECORD;
BEGIN
    RAISE NOTICE '🧪 Testing assessment functions...';
    
    -- Test get_assessment_stats function (will return zeros for new table)
    SELECT * INTO test_result 
    FROM get_assessment_stats('00000000-0000-0000-0000-000000000000'::UUID);
    
    RAISE NOTICE '📈 Assessment stats test: % total assessments', 
        COALESCE(test_result.total_assessments, 0);
    
    -- Test assessment_summary view
    SELECT COUNT(*) INTO test_result 
    FROM assessment_summary;
    
    RAISE NOTICE '📋 Assessment summary view: % records', 
        COALESCE(test_result.count, 0);
    
    RAISE NOTICE '✅ Function tests completed!';
END $$;

-- Show sample data structure
SELECT 
    'Sample assessment data structure:' as info,
    jsonb_pretty('{
        "questionId": "basic-1",
        "answer": 30,
        "score": 2,
        "isValid": true
    }'::jsonb) as sample_answer_format;

SELECT 
    'Risk levels:' as info,
    ARRAY['low', 'medium', 'high', 'very-high'] as valid_risk_levels;

SELECT 
    'Category IDs:' as info,
    ARRAY['basic', 'heart', 'nutrition', 'mental', 'physical', 'sleep', 'guest-assessment'] as valid_categories;
