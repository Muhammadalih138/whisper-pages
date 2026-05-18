import type { Metadata } from "next";
import { Navbar } from "@/src/components/Navbar";
import { Providers } from "@/src/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Whisper Pages",
  description: "A quiet place to write and read stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="site-main">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
