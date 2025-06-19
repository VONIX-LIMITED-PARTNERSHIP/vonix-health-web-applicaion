-- Grant necessary permissions for auth trigger
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.assessments TO anon, authenticated;
GRANT ALL ON public.audit_logs TO anon, authenticated;

-- Grant permissions for the trigger function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated;

-- Make sure the trigger function can access auth schema
GRANT USAGE ON SCHEMA auth TO postgres;
