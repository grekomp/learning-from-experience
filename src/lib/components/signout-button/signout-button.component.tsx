"use client";
import { createClient } from "@/utils/supabase/supabase-client";

export const SignoutButton = () => {
  const client = createClient();

  return <button onClick={() => client.auth.signOut()}>Sign out</button>;
};
