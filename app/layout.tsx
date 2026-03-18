import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const endgraphSans = localFont({
  src: [
    {
      path: "../public/fonts/tbj-endgraph-font-family/TBJEndgraphMini-Thin-BF66b31b988c3dc.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/tbj-endgraph-font-family/TBJEndgraphMini-Light-BF66b31b9838d67.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/tbj-endgraph-font-family/TBJEndgraphMini-Regular-BF66b31b9867893.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/tbj-endgraph-font-family/TBJEndgraphMini-Medium-BF66b31b9825275.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/tbj-endgraph-font-family/TBJEndgraphMini-Bold-BF66b31b98302f9.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduTrack Workspace",
  description: "Modern education operations workspace for courses and enrollments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${endgraphSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
