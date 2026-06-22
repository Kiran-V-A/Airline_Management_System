'use client';
// ============================================
// FlightCard — Animated Flight Result Card
// ============================================
import { motion } from 'framer-motion';
import { Plane, Clock, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import type { Flight } from '@/lib/types';

interface FlightCardProps {
  flight: Flight;
  index: number;
}

export default function FlightCard({ flight, index }: FlightCardProps) {
  const departureTime = new Date(flight.departure_time);
  const arrivalTime = new Date(flight.arrival_time);

  // Calculate duration
  const durationMs = arrivalTime.getTime() - departureTime.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(14, 165, 233, 0.2)' }}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* Airline Header */}
      <div className="bg-gradient-to-r from-sky-500/10 to-blue-500/10 px-6 py-3 flex items-center justify-between border-b border-white/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
            <Plane className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-sky-800">{flight.airline}</p>
            <p className="text-xs text-sky-600/70">{flight.flight_number}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-sky-600/70">
          <Clock className="w-3 h-3" />
          {hours}h {minutes}m
        </div>
      </div>

      {/* Route Info */}
      <div className="px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Source */}
          <div className="text-center flex-shrink-0">
            <p className="text-2xl font-bold text-sky-900 heading-font">
              {format(departureTime, 'HH:mm')}
            </p>
            <p className="text-sm font-medium text-sky-700 mt-1">{flight.source}</p>
            <p className="text-xs text-sky-500">{format(departureTime, 'dd MMM')}</p>
          </div>

          {/* Flight Path */}
          <div className="flex-1 flex flex-col items-center gap-1 px-2">
            <div className="w-full flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-sky-400" />
              <div className="flex-1 flight-path" />
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Plane className="w-4 h-4 text-sky-500 -rotate-12" />
              </motion.div>
              <div className="flex-1 flight-path" />
              <div className="w-2 h-2 rounded-full bg-sky-600" />
            </div>
            <p className="text-[10px] text-sky-500 font-medium">
              {hours}h {minutes}m • Direct
            </p>
          </div>

          {/* Destination */}
          <div className="text-center flex-shrink-0">
            <p className="text-2xl font-bold text-sky-900 heading-font">
              {format(arrivalTime, 'HH:mm')}
            </p>
            <p className="text-sm font-medium text-sky-700 mt-1">{flight.destination}</p>
            <p className="text-xs text-sky-500">{format(arrivalTime, 'dd MMM')}</p>
          </div>
        </div>
      </div>

      {/* Footer — Price & CTA */}
      <div className="px-6 py-4 bg-gradient-to-r from-sky-50/50 to-blue-50/50 border-t border-white/30 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-0.5">
            <IndianRupee className="w-5 h-5 text-sky-800" />
            <span className="text-2xl font-bold text-sky-800 heading-font">
              {flight.price.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-sky-600 mt-0.5">
            {flight.available_seats} seat{flight.available_seats !== 1 ? 's' : ''} left
          </p>
        </div>
        <Link href={`/booking/${flight.id}`}>
          <motion.button
            className="btn-gradient text-sm !py-2.5 !px-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={flight.available_seats === 0}
          >
            {flight.available_seats === 0 ? 'Sold Out' : 'Book Now'}
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
