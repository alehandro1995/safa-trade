import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next";
import {El_Messiri, Marhey, Oswald } from "next/font/google";
import "./globals.css";

const marhey = Marhey({
	variable: "--font-marhey",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const elMessiri = El_Messiri({
	variable: "--font-messiri",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const oswald = Oswald({
	variable: "--font-oswald",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SafaTrade | Dashboard",
  description: "SafaTrade Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${elMessiri.variable} ${marhey.variable} ${oswald.variable} antialiased`}
      >
        {children}
				<Toaster />
      </body>
    </html>
  );
}
