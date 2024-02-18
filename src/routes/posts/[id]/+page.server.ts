import { supabase } from '$lib/database/supabaseClient';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { data } = await supabase.from('posts').select().eq('id', params.id);

	if (!data?.[0]) error(404, 'Not found');

	return {
		post: data?.[0] || null,
	};
}
