-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT := 'patient';
  user_full_name TEXT := '';
  user_pdpa_consent BOOLEAN := false;
BEGIN
  -- Extract metadata safely
  IF NEW.raw_user_meta_data IS NOT NULL THEN
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'patient');
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
    user_pdpa_consent := COALESCE((NEW.raw_user_meta_data->>'pdpa_consent')::boolean, false);
  END IF;

  -- Insert profile with error handling
  BEGIN
    INSERT INTO public.profiles (
      id, 
      email, 
      full_name, 
      role, 
      pdpa_consent, 
      pdpa_consent_date,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      user_full_name,
      user_role,
      user_pdpa_consent,
      CASE 
        WHEN user_pdpa_consent THEN NOW() 
        ELSE NULL 
      END,
      NOW(),
      NOW()
    );
    
    -- Log successful profile creation
    RAISE LOG 'Profile created successfully for user: %', NEW.id;
    
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the auth process
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    -- Re-raise the exception to fail the signup if profile creation fails
    RAISE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated, service_role;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
