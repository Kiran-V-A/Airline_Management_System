'use client';
// ============================================
// BookingCard — User Booking Display Card
// ============================================
import { motion } from 'framer-motion';
import { Plane, Calendar, Users, X } from 'lucide-react';
import { format } from 'date-fns';
import type { Booking } from '@/lib/types';

interface BookingCardProps {
  booking: Booking;
  index: number;
  onCancel?: (bookingId: string, flightId: string, seatsBooked: number) => void;
  cancelLoading?: boolean;
}

export default function BookingCard({ booking, index, onCancel, cancelLoading }: BookingCardProps) {
  const flight = booking.flight;
  if (!flight) return null;

  const departureTime = new Date(flight.departure_time);
  const arrivalTime = new Date(flight.arrival_time);
  const isConfirmed = booking.status === 'confirmed';
  const isPast = departureTime < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`glass-card rounded-2xl overflow-hidden ${!isConfirmed ? 'opacity-70' : ''}`}
    >
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-sky-500/10 to-blue-500/10 flex items-center justify-between border-b border-white/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
            <Plane className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sky-800">{flight.airline}</p>
            <p className="text-xs text-sky-600/70">{flight.flight_number}</p>
          </div>
        </div>
        <span className={isConfirmed ? 'badge-confirmed' : 'badge-cancelled'}>
          {booking.status}
        </span>
      </div>

      {/* Route & Details */}
      <div className="px-6 py-5 space-y-4">
        {/* Route */}
        <div className="flex items-center justify-between gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-sky-900">{format(departureTime, 'HH:mm')}</p>
            <p className="text-sm text-sky-700">{flight.source}</p>
          </div>
          <div className="flex-1 flex items-center gap-1 px-2">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <div className="flex-1 flight-path" />
            <Plane className="w-3.5 h-3.5 text-sky-500 -rotate-12" />
            <div className="flex-1 flight-path" />
            <div className="w-1.5 h-1.5 rounded-full bg-sky-600" />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-sky-900">{format(arrivalTime, 'HH:mm')}</p>
            <p className="text-sm text-sky-700">{flight.destination}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-sky-50/50 rounded-xl py-2.5 px-3">
            <div className="flex items-center justify-center gap-1 text-sky-500 mb-1">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-medium text-sky-800">{format(departureTime, 'dd MMM yyyy')}</p>
          </div>
          <div className="bg-sky-50/50 rounded-xl py-2.5 px-3">
            <div className="flex items-center justify-center gap-1 text-sky-500 mb-1">
              <Users className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-medium text-sky-800">{booking.seats_booked} Seat(s)</p>
          </div>
          <div className="bg-sky-50/50 rounded-xl py-2.5 px-3">
            <p className="text-sky-500 text-xs mb-1">Total</p>
            <p className="text-xs font-bold text-sky-800">
              ₹{(flight.price * booking.seats_booked).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {isConfirmed && !isPast && onCancel && (
        <div className="px-6 py-3 border-t border-white/20">
          <motion.button
            onClick={() => onCancel(booking.id, booking.flight_id, booking.seats_booked)}
            className="btn-danger text-sm flex items-center gap-1.5 !py-2"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={cancelLoading}
          >
            <X className="w-4 h-4" />
            {cancelLoading ? 'Cancelling...' : 'Cancel Booking'}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
