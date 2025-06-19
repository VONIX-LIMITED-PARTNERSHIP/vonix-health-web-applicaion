-- Make sure profiles table has all required columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pdpa_consent_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update role column to use proper enum-like constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('patient', 'doctor', 'admin'));
