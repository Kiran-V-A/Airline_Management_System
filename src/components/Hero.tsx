'use client';
// ============================================
// Hero Section — Landing Page Hero Component
// ============================================
import { motion } from 'framer-motion';
import { Plane, Search, Shield, Clock } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

const features = [
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find the best flights instantly with our intelligent search engine',
  },
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'Book with confidence — your data is always protected',
  },
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'Live seat availability and instant booking confirmations',
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20">
      {/* Main Hero Content */}
      <div className="text-center max-w-4xl mx-auto z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <Plane className="w-4 h-4 text-sky-600" />
          <span className="text-sm font-medium text-sky-700">
            India&apos;s Premium Airline Booking Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-tight"
        >
          <span className="text-sky-900">Fly </span>
          <span className="text-gradient">Beyond</span>
          <br />
          <span className="text-sky-900">Limits</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg sm:text-xl text-sky-700/70 mt-6 max-w-2xl mx-auto leading-relaxed"
        >
          Discover seamless flight bookings, real-time availability, and premium travel
          experiences. Your journey begins here.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Link href={ROUTES.FLIGHTS}>
            <motion.div
              className="btn-gradient text-lg !py-4 !px-10 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-5 h-5" />
              Search Flights
            </motion.div>
          </Link>
          <Link href={ROUTES.SIGNUP}>
            <motion.div
              className="btn-outline text-lg !py-4 !px-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-8 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-sky-400/50 flex items-start justify-center pt-2">
          <motion.div
            className="w-1.5 h-3 rounded-full bg-sky-400"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="w-full max-w-6xl mx-auto mt-16 mb-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 + i * 0.15 }}
              whileHover={{ y: -6 }}
              className="glass-card rounded-2xl p-6 text-center cursor-default"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-sky-900 font-display">
                {feature.title}
              </h3>
              <p className="text-sm text-sky-600/70 mt-2">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
