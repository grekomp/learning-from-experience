import { Navlink } from "$/app/_components/navlink.component";
import Link from "next/link";

export const Header = () => {
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
        </ul>
      </nav>
    </header>
  );
};
