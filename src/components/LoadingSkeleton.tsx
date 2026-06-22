'use client';
// ============================================
// LoadingSkeleton — Premium Loading States
// ============================================
import { motion } from 'framer-motion';

export function FlightCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card rounded-2xl p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="skeleton w-24 h-5" />
        <div className="skeleton w-16 h-5" />
      </div>
      <div className="flex items-center gap-4">
        <div className="skeleton w-20 h-8" />
        <div className="flex-1 skeleton h-1" />
        <div className="skeleton w-20 h-8" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="skeleton w-28 h-4" />
        <div className="skeleton w-24 h-10 rounded-xl" />
      </div>
    </motion.div>
  );
}

export function BookingCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-3">
      <div className="flex justify-between">
        <div className="skeleton w-32 h-6" />
        <div className="skeleton w-20 h-6 rounded-full" />
      </div>
      <div className="skeleton w-48 h-4" />
      <div className="skeleton w-36 h-4" />
      <div className="skeleton w-24 h-10 rounded-xl mt-2" />
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-3">
      <div className="skeleton w-10 h-10 rounded-xl" />
      <div className="skeleton w-20 h-8" />
      <div className="skeleton w-28 h-4" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen pt-28 px-4 max-w-7xl mx-auto space-y-6">
      <div className="skeleton w-64 h-10 mx-auto" />
      <div className="skeleton w-96 h-5 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[...Array(6)].map((_, i) => (
          <FlightCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
