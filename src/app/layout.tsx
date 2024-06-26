import "$/app/_components/_suppress-ref-warning";
import { Footer } from "$/app/_components/footer.component";
import { Header } from "$/app/_components/header.component";
import "$/styles/globals.css";

export const metadata = {
  title: "Learning from Experience",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="flex h-full flex-col items-stretch">
          <Header />

          <main className="grow">{children}</main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
