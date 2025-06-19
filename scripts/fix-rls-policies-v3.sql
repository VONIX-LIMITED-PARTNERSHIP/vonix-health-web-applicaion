-- Disable RLS temporarily to clean up
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Service role full access" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_service_role_policy" ON profiles;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies
CREATE POLICY "profiles_select_policy" ON profiles
    FOR SELECT USING (
        auth.uid() = id OR 
        auth.role() = 'service_role'
    );

CREATE POLICY "profiles_insert_policy" ON profiles
    FOR INSERT WITH CHECK (
        auth.uid() = id OR 
        auth.role() = 'service_role'
    );

CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE USING (
        auth.uid() = id OR 
        auth.role() = 'service_role'
    );

CREATE POLICY "profiles_delete_policy" ON profiles
    FOR DELETE USING (
        auth.uid() = id OR 
        auth.role() = 'service_role'
    );

-- Grant necessary permissions
GRANT ALL ON profiles TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
