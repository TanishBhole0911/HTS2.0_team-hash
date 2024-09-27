import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Floating } from "./components/FloatingComponent";
import StoreProvider from "./StoreProvider";
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
  title: "Notify",
  description: "Notify is a platform for Students to Save their Notes and create Flashcards of specific topics to help them study better.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jacquarda+Bastarda+9&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Jacquarda+Bastarda+9&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Jacquarda+Bastarda+9&family=Protest+Guerrilla&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Suez+One&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Bangers&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          {children}
          <Floating />
        </StoreProvider>
      </body>
    </html>
  );
}
