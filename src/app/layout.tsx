import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

// Force dynamic rendering — the Navbar uses Supabase auth which requires runtime env vars
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "SkyVoyage — Premium Airline Booking",
  description:
    "Discover seamless flight bookings, real-time availability, and premium travel experiences. Your journey begins here with SkyVoyage.",
  keywords: ["airline", "flights", "booking", "travel", "India", "SkyVoyage"],
  openGraph: {
    title: "SkyVoyage — Fly Beyond Limits",
    description:
      "India's premium airline booking platform. Search flights, book seats, and manage your journeys.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
