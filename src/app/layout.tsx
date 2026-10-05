import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const jbMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AryaSetu — National CTMS for Ayurveda Research",
  description:
    "Real-time, cloud-based, GCP-ASU compliant Clinical Trial Management System for AIIA with CDISC/FHIR interoperability, NPvCC pharmacovigilance and CTRI/NDCT 2019 regulatory tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${newsreader.variable} ${jbMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
