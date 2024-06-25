import Link from "next/link";

export interface NavlinkProps {
  href: string;
  children: React.ReactNode;
}

export const Navlink: React.FC<NavlinkProps> = ({ href, children }) => {
  return (
    <Link
      href={href}
      className="block p-3 font-semibold text-muted-foreground transition-colors hover:text-foreground focus:text-foreground"
    >
      {children}
    </Link>
  );
};
