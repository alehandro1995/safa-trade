import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next";
import { Marhey, Oswald, Roboto_Mono  } from "next/font/google";
import "./globals.css";

const marhey = Marhey({
	variable: "--font-marhey",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const oswald = Oswald({
	variable: "--font-oswald",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const roboto = Roboto_Mono({
	variable: "--font-roboto",
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
      <body className={`${roboto.variable} ${marhey.variable} ${oswald.variable} antialiased`}>
        <main>{children}</main>
				<Toaster />
      </body>
    </html>
  );
}
