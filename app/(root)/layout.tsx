import Topbar from "@/components/sheared/Topbar";
import "../globals.css";
import type { Metadata } from "next";

import localFont from "next/font/local";
import LeftSidebar from "@/components/sheared/LeftSidebar";
import RightSidebar from "@/components/sheared/RightSidebar";
import Bottombar from "@/components/sheared/Bottombar";
import { ClerkProvider } from "@clerk/nextjs";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: 'Zohe',
  description: 'A safe space for everyone to relate',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ClerkProvider dynamic>  
          <Topbar />

            <main className="flex flex-row">
              <LeftSidebar />

                <section className="main-container">
                  <div className="w-full max-w-4xl">
                    {children}
                  </div>
                </section>

              <RightSidebar />
            </main>

          <Bottombar />
        </ClerkProvider>
      </body>
    </html>
  );
}
