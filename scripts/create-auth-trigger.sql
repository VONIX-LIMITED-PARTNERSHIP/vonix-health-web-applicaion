-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, pdpa_consent, pdpa_consent_date)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    -- Explicitly cast the role to the public.user_role enum type
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')::public.user_role,
    COALESCE((NEW.raw_user_meta_data->>'pdpa_consent')::boolean, false),
    CASE 
      WHEN COALESCE((NEW.raw_user_meta_data->>'pdpa_consent')::boolean, false) 
      THEN NOW() 
      ELSE NULL 
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
