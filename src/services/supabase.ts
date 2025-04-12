import 'react-native-url-polyfill/auto'; // Required for Supabase to work in React Native
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Config from 'react-native-config';

// Ensure environment variables are loaded and are strings
const supabaseUrl = Config.SUPABASE_URL ?? '';
const supabaseAnonKey = Config.SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl) {
  console.error('Supabase URL is not defined in environment variables.');
  // Optionally throw an error or handle this case appropriately
}

if (!supabaseAnonKey) {
  console.error('Supabase Anon Key is not defined in environment variables.');
  // Optionally throw an error or handle this case appropriately
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Use AsyncStorage for session persistence
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for React Native
  },
});

// Add type definitions if needed, e.g., for your database schema
// You can generate these using the Supabase CLI: npx supabase gen types typescript --project-id <your-project-id> > src/types/supabase.ts
// Then import them: import { Database } from '../types/supabase';
// export const supabase = createClient<Database>(...)