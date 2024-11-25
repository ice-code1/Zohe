'use client';  // Required for client-side components

import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import "../globals.css";
import { SWRConfig } from 'swr';
import { metadata } from './layout.server';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});



export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) { 
  return (
    <ClerkProvider>
      <SWRConfig value={{ provider: () => new Map() }}>
        <html lang="en">
          <body className={`${geistSans.className} bg-dark-1`}>
            <div className="w-full flex justify-center items-center
            min-h-screen">
              {children}
            </div>
          </body>
        </html>
      </SWRConfig>
    </ClerkProvider>
  )
}
