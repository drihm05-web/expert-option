/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if the URL is actually a valid HTTP/HTTPS URL
const isValidUrl = supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://');
export const isSupabaseConfigured = isValidUrl && supabaseAnonKey !== '';

if (!isSupabaseConfigured) {
  console.warn('⚠️ Missing or invalid Supabase environment variables! The app will not be able to connect to the database.');
}

// Fallback to placeholders to prevent the app from crashing with a white screen
const finalUrl = isValidUrl ? supabaseUrl : 'https://placeholder.supabase.co';
const finalKey = supabaseAnonKey ? supabaseAnonKey : 'placeholder';

export const supabase = createClient(finalUrl, finalKey);
