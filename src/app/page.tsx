'use client';
// ============================================
// Landing Page
// ============================================
import Hero from '@/components/Hero';
import CloudsBackground from '@/components/CloudsBackground';
import AirplaneAnimation from '@/components/AirplaneAnimation';

export default function HomePage() {
  return (
    <main className="relative">
      <CloudsBackground />
      <AirplaneAnimation />
      <Hero />
    </main>
  );
}
