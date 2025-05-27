import type { Metadata } from "next";
import { Lato, Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import Provider from "../components/Provider";
import { SearchParamWrapper } from "@/components/SearchParamWrapper";

const poppins = Poppins({
  weight: ["100", "200", "300", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  weight: ["100", "200", "300", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const lato = Lato({
  weight: ["100", "300", "400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "",
  description: "",
  keywords: [],
  authors: [],
  creator: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-screen overflow-x-hidden">
      <body
        className={`${montserrat.variable} ${lato.variable} ${poppins.variable} antialiased min-h-screen flex flex-col overflow-x-hidden`}
      >
        <SearchParamWrapper>
          <Provider>{children}</Provider>
        </SearchParamWrapper>
      </body>
    </html>
  );
}
