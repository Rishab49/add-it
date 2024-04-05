import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import "./globals.css";


const chakra = Chakra_Petch({ weight: ["500"], subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Add It",
  description: "Trivial Addition game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={chakra.className}>{children}
      </body>
    </html>
  );
}
