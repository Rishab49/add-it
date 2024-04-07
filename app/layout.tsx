import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quickSand = Quicksand({
  weight:["700"],
  subsets:['latin']
})

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
    <html lang="en" className={quickSand.className}>
      <body>{children}
      </body>
    </html>
  );
}
