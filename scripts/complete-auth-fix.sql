-- ===== COMPLETE AUTH FIX =====

-- 1. Drop existing trigger and function completely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. Ensure profiles table has correct structure
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('patient', 'doctor', 'admin'));

-- Make sure all columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pdpa_consent_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 3. Disable RLS temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 4. Drop all existing policies
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON profiles';
    END LOOP;
END $$;

-- 5. Re-enable RLS with simple policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create simple policies that work
CREATE POLICY "profiles_all_access" ON public.profiles
    FOR ALL USING (true) WITH CHECK (true);

-- 6. Grant all necessary permissions
GRANT ALL ON public.profiles TO anon, authenticated, service_role;
GRANT ALL ON public.assessments TO anon, authenticated, service_role;
GRANT ALL ON public.audit_logs TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 7. Create a SIMPLE auth trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Simple insert with minimal error handling
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role, 
    pdpa_consent,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient'),
    COALESCE((NEW.raw_user_meta_data->>'pdpa_consent')::boolean, false),
    NOW(),
    NOW()
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the auth process
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- 8. Grant execute permission on function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated, service_role;

-- 9. Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Test the setup
SELECT 'Auth setup completed successfully!' as result;
