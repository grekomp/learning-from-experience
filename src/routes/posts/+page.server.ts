import { supabase } from '$lib/database/supabaseClient';

export async function load() {
	const { data, error } = await supabase.from('posts').select();

	return {
		posts: data || [],
		error,
	};
}
