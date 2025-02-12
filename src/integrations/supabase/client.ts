
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ouffjbaptaxdxxttzrtz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91ZmZqYmFwdGF4ZHh4dHR6cnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxNzQ3MjQsImV4cCI6MjA1NDc1MDcyNH0.RJzifXWon8gFjGMlQfynMY4gg8hq63goKUQT_1H0B3U";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      storageKey: 'supabase-auth',
      storage: window.localStorage,
      autoRefreshToken: true,
    }
  }
);
