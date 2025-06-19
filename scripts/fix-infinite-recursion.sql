-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Enable read access for users based on user_id" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable delete for users based on user_id" ON profiles
    FOR DELETE USING (auth.uid() = id);

-- Separate policy for service role without recursion
CREATE POLICY "Service role full access" ON profiles
    FOR ALL TO service_role USING (true);
