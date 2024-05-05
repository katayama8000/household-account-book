import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nvldqfptrmwokpagptwh.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52bGRxZnB0cm13b2twYWdwdHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM2MjIwNDQsImV4cCI6MjAyOTE5ODA0NH0.Qe0umnN1qGN9_dSTFbLZG_O2pKTSQK1lguqUljoe9Ls';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
