import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
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
      <body className={`${inter.variable} ${jbMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
