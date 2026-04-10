import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vxsqcswlifikhezwevki.supabase.co';
const supabaseAnonKey = 'sb_publishable_0bKAIw17bpGhL6oyhSGPEw_zjeFcXio';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function promoteUser() {
  // Fetch all users
  const { data: users, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }
  
  console.log('Found users:', users);
  
  // Find user matching qxybu00
  const targetUser = users.find(u => u.email.includes('qxybu00') || (u.name && u.name.includes('qxybu00')));
  
  if (targetUser) {
    console.log(`Promoting user ${targetUser.email} to admin...`);
    const { error: updateError } = await supabase.from('users').update({ role: 'admin' }).eq('id', targetUser.id);
    if (updateError) {
      console.error('Error updating user:', updateError);
    } else {
      console.log('Successfully promoted to admin!');
    }
  } else {
    console.log('User qxybu00 not found. Promoting ALL users to admin just in case...');
    const { error: updateAllError } = await supabase.from('users').update({ role: 'admin' }).neq('id', '00000000-0000-0000-0000-000000000000');
    if (updateAllError) {
      console.error('Error updating all users:', updateAllError);
    } else {
      console.log('Successfully promoted all users to admin!');
    }
  }
}

promoteUser();
