import { Footer } from "$/app/_components/footer.component";
import { Header } from "$/app/_components/header.component";
import "$/styles/globals.css";

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
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
