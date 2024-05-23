"use client";
import { createClient } from "$/lib/utils/supabase/supabase-client";

export const SignoutButton = () => {
  const client = createClient();

  return <button onClick={() => client.auth.signOut()}>Sign out</button>;
};
