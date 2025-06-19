-- Enable realtime for profiles table (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.assessments TO anon, authenticated;
GRANT ALL ON public.audit_logs TO anon, authenticated;
