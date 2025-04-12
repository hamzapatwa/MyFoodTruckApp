import { createClient } from '@supabase/supabase-js';
import Config from 'react-native-config';

// Custom storage implementation for web that uses localStorage
const webStorage = {
  getItem: (key: string) => {
    const value = localStorage.getItem(key);
    return Promise.resolve(value);
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
    return Promise.resolve(undefined);
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
    return Promise.resolve(undefined);
  },
};

// Ensure environment variables are loaded and are strings
// For web, we might need to use a different approach to access env variables
// This is a fallback in case Config doesn't work in the web environment
const supabaseUrl = Config.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = Config.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY || '';

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
    storage: webStorage, // Use localStorage for web
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Enable for web
  },
});

// Add type definitions if needed, e.g., for your database schema
// You can generate these using the Supabase CLI: npx supabase gen types typescript --project-id <your-project-id> > src/types/supabase.ts
// Then import them: import { Database } from '../types/supabase';
// export const supabase = createClient<Database>(...)