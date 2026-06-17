import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iwksteucdgvyiwbjokaz.supabase.co';

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) throw new Error('SUPABASE_SERVICE_KEY not set');
    _supabase = createClient(supabaseUrl, key);
  }
  return _supabase;
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `NY-${timestamp}-${random}`;
}
