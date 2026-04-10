/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// 1. Try to get from environment variables (Vercel)
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Fallback directly to the exact keys you provided so it NEVER fails on Vercel
export const supabaseUrl = envUrl || 'https://vxsqcswlifikhezwevki.supabase.co';
export const supabaseAnonKey = envKey || 'sb_publishable_0bKAIw17bpGhL6oyhSGPEw_zjeFcXio';

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
