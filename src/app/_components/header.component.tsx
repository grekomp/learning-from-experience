import { Navlink } from "$/app/_components/navlink.component";
import { SignoutButton } from "$/lib/components/signout-button/signout-button.component";
import { createClient } from "$/lib/utils/supabase/supabase-server";
import Link from "next/link";

export const Header = async () => {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  return (
    <header className="mb-5 border-b">
      <nav className="mx-auto max-w-5xl">
        <ul className="flex items-center gap-5">
          <li>
            <Link
              href="/"
              className="block p-3 text-xl font-black text-primary transition-colors hover:text-foreground focus:text-foreground"
            >
              Learning from Experience
            </Link>
          </li>
          <li>
            <Navlink href="/posts">Posts</Navlink>
          </li>
          <li>
            <Navlink href="/editable-grid">Editable Grid</Navlink>
          </li>
          <li>
            <Navlink href="https://www.npmjs.com/package/@grekomp/wonder-event-emitter">
              Wonder Event Emitter
            </Navlink>
          </li>
          <li>
            {data?.user ? (
              <SignoutButton />
            ) : (
              <a
                className={
                  "block p-3 font-semibold text-muted-foreground transition-colors hover:text-foreground focus:text-foreground"
                }
                href="/login"
              >
                Sign in
              </a>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};
