-- Run this entirely in your Supabase SQL Editor

-- 1. Create Tables
CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC NOT NULL,
  images TEXT[] DEFAULT '{}',
  condition TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Available',
  specs JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE export_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id),
  destination TEXT NOT NULL,
  budget NUMERIC,
  preferences TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Disable RLS for prototyping (or enable with simple policies)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE export_requests DISABLE ROW LEVEL SECURITY;

-- 3. Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email,
    CASE WHEN new.email = 'drihm05@gmail.com' THEN 'admin' ELSE 'client' END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
