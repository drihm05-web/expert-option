-- Run this script in your Supabase SQL Editor to create the new tables for Live Chat and EFT Settings

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.export_requests(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- Insert default EFT details
INSERT INTO public.settings (key, value) 
VALUES ('eft_details', '{"bank": "Standard Bank", "accountName": "Exertion Exports", "accountNumber": "000000000", "branchCode": "000000"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Enable Realtime for messages
alter publication supabase_realtime add table public.messages;
