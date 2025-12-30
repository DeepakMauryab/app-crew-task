import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iqbuggnwpaedkjqacwoa.supabase.co';

const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxYnVnZ253cGFlZGtqcWFjd29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODg3OTMsImV4cCI6MjA4MjU2NDc5M30.Wvnfsw1nsmiAdU8ozbgMFa_T-U6iVn3RFtZnyQbLGB0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
