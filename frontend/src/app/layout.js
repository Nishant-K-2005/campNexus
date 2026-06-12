import { Geist, Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CampNexus – AI-Powered Campus Collaboration Platform",
  description:
    "The all-in-one platform for campus communities, discussions, academic resources, and declarations. Built for universities of the future.",
  keywords: "campus, university, collaboration, communities, discussions, resources",
  openGraph: {
    title: "CampNexus",
    description: "Your campus, connected.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--cn-card)",
                border: "1px solid var(--cn-border)",
                color: "var(--cn-text)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
