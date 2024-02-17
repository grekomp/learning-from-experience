import { SUPABASE_ANON_KEY, SUPABASE_PROJECT_ID } from '$env/static/private';
import type { Database } from '$lib/database/database.model';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient<Database>(
	`https://${SUPABASE_PROJECT_ID}.supabase.co`,
	SUPABASE_ANON_KEY,
);
