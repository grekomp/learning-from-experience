import { SignoutButton } from "$/lib/components/signout-button/signout-button.component";
import { db } from "$/server/db";
import { createClient } from "$/utils/supabase/supabase-server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  const posts = await db.query.posts.findMany({
    orderBy: (model, { desc }) => desc(model.created_at),
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          T3 Tutorial
        </h1>
        {posts.map((post) => {
          return (
            <div key={post.id} className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold">{post.title}</h2>
              <p>{post.summary}</p>
            </div>
          );
        })}
        <div>
          {data?.user ? <SignoutButton /> : <a href="/login">Sign in</a>}
        </div>
      </div>
    </main>
  );
}
