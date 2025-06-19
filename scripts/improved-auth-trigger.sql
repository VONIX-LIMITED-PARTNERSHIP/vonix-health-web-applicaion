-- สร้าง Auth Trigger ที่ดีขึ้น
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- สร้าง function ใหม่ที่มี logging ดีกว่า
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_email TEXT;
  user_full_name TEXT;
  user_role TEXT;
  user_pdpa_consent BOOLEAN;
BEGIN
  -- Extract data safely
  user_email := COALESCE(NEW.email, '');
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'patient');
  user_pdpa_consent := COALESCE((NEW.raw_user_meta_data->>'pdpa_consent')::boolean, false);

  -- Log the attempt
  RAISE LOG 'Creating profile for user: % with email: %', NEW.id, user_email;

  -- Insert profile
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role, 
    pdpa_consent,
    pdpa_consent_date,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    user_email,
    user_full_name,
    user_role,
    user_pdpa_consent,
    CASE WHEN user_pdpa_consent THEN NOW() ELSE NULL END,
    NOW(),
    NOW()
  );

  RAISE LOG 'Profile created successfully for user: %', NEW.id;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log detailed error
  RAISE LOG 'Error creating profile for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
  
  -- Don't fail the auth process, but log the error
  RETURN NEW;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated, service_role;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

SELECT 'Improved auth trigger created!' as result;
