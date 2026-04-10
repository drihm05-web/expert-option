import { createClient } from '@supabase/supabase-js';

try {
  const supabase = createClient('', 'placeholder');
  console.log('Success');
} catch (e) {
  console.error('Error:', e);
}
