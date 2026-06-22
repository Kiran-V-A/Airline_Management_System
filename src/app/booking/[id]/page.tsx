'use client';
// ============================================
// Booking Page — Book a specific flight
// ============================================
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Users, IndianRupee, Minus, Plus, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import PageTransition from '@/components/PageTransition';
import type { Flight } from '@/lib/types';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const flightId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const { createBooking } = useBookings(user?.id);

  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch flight details
  useEffect(() => {
    const fetchFlight = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('flights')
        .select('*')
        .eq('id', flightId)
        .single();

      if (error || !data) {
        setError('Flight not found');
      } else {
        setFlight(data as Flight);
      }
      setLoading(false);
    };

    fetchFlight();
  }, [flightId]);

  // Subscribe to realtime seat updates
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`flight-${flightId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'flights', filter: `id=eq.${flightId}` },
        (payload) => {
          setFlight(payload.new as Flight);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [flightId]);

  const handleBooking = async () => {
    if (!user) {
      router.push(`/login?redirect=/booking/${flightId}`);
      return;
    }

    setBookingLoading(true);
    setError(null);

    try {
      await createBooking(flightId, seats);
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Booking failed. Please try again.';
      setError(message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (!flight) {
    return (
      <PageTransition className="min-h-screen pt-28 px-4">
        <div className="max-w-lg mx-auto text-center glass-card rounded-3xl p-12">
          <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-sky-900 font-display">Flight Not Found</h2>
          <p className="text-sky-600/70 mt-2">This flight may no longer be available.</p>
          <button onClick={() => router.push('/flights')} className="btn-gradient mt-6">
            Back to Flights
          </button>
        </div>
      </PageTransition>
    );
  }

  const departureTime = new Date(flight.departure_time);
  const arrivalTime = new Date(flight.arrival_time);
  const durationMs = arrivalTime.getTime() - departureTime.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const totalPrice = flight.price * seats;
  const maxSeats = Math.min(flight.available_seats, 9);

  return (
    <PageTransition className="min-h-screen pt-24 sm:pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {success ? (
            /* ─── Success State ─── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-3xl p-10 sm:p-14 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                <CheckCircle2 className="w-24 h-24 text-emerald-500 mx-auto" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold font-display text-sky-900 mt-6"
              >
                Booking Confirmed!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sky-600/70 mt-3 text-lg"
              >
                {seats} seat{seats > 1 ? 's' : ''} booked on {flight.airline} {flight.flight_number}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-sky-600/70 text-sm mt-1"
              >
                {flight.source} → {flight.destination} • {format(departureTime, 'dd MMM yyyy, HH:mm')}
              </motion.p>

              {/* Animated dots */}
              <motion.div
                className="flex justify-center gap-2 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-emerald-400"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, delay: 1 + i * 0.15, repeat: 2 }}
                  />
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
              >
                <button
                  onClick={() => router.push('/my-bookings')}
                  className="btn-gradient"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => router.push('/flights')}
                  className="btn-outline"
                >
                  Search More Flights
                </button>
              </motion.div>
            </motion.div>
          ) : (
            /* ─── Booking Form ─── */
            <motion.div key="form" className="space-y-6">
              {/* Page Header */}
              <div className="text-center mb-4">
                <h1 className="text-3xl sm:text-4xl font-bold font-display text-gradient">
                  Complete Your Booking
                </h1>
                <p className="text-sky-600/70 mt-2">
                  Review flight details and confirm your seats
                </p>
              </div>

              {/* Flight Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                {/* Airline Header */}
                <div className="bg-gradient-to-r from-sky-500/10 to-blue-500/10 px-6 py-4 flex items-center justify-between border-b border-white/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                      <Plane className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sky-800">{flight.airline}</p>
                      <p className="text-xs text-sky-600/70">{flight.flight_number}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
                    {hours}h {minutes}m
                  </span>
                </div>

                {/* Route */}
                <div className="px-6 py-6">
                  <div className="flex items-center justify-between gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-sky-900 font-display">
                        {format(departureTime, 'HH:mm')}
                      </p>
                      <p className="text-base font-medium text-sky-700 mt-1">{flight.source}</p>
                      <p className="text-sm text-sky-500">{format(departureTime, 'dd MMM yyyy')}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-sky-400" />
                        <div className="flex-1 flight-path" />
                        <Plane className="w-5 h-5 text-sky-500 -rotate-12" />
                        <div className="flex-1 flight-path" />
                        <div className="w-3 h-3 rounded-full bg-sky-600" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-sky-900 font-display">
                        {format(arrivalTime, 'HH:mm')}
                      </p>
                      <p className="text-base font-medium text-sky-700 mt-1">{flight.destination}</p>
                      <p className="text-sm text-sky-500">{format(arrivalTime, 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Seat Selection Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-sky-900 font-display mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-600" />
                  Select Seats
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-sky-600/70">
                      {flight.available_seats} seat{flight.available_seats !== 1 ? 's' : ''} available
                    </p>
                    <p className="text-xs text-sky-500 mt-0.5">Max 9 per booking</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <motion.button
                      type="button"
                      onClick={() => setSeats(Math.max(1, seats - 1))}
                      className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center hover:bg-sky-200 transition-colors disabled:opacity-40"
                      disabled={seats <= 1}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <span className="text-2xl font-bold text-sky-900 font-display w-8 text-center">
                      {seats}
                    </span>
                    <motion.button
                      type="button"
                      onClick={() => setSeats(Math.min(maxSeats, seats + 1))}
                      className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center hover:bg-sky-200 transition-colors disabled:opacity-40"
                      disabled={seats >= maxSeats}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Price Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-sky-900 font-display mb-4 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-sky-600" />
                  Price Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-sky-600/70">Base fare × {seats}</span>
                    <span className="text-sky-800">₹{(flight.price * seats).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-sky-600/70">Taxes & fees</span>
                    <span className="text-emerald-600">Included</span>
                  </div>
                  <div className="border-t border-sky-200/50 pt-3 flex justify-between">
                    <span className="font-semibold text-sky-800">Total</span>
                    <span className="text-2xl font-bold text-sky-900 font-display">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm flex items-center gap-2"
                >
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Confirm Button */}
              <motion.button
                onClick={handleBooking}
                className="btn-gradient w-full !py-4 !text-lg flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={bookingLoading || flight.available_seats === 0}
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <Plane className="w-5 h-5" />
                    {user ? 'Confirm Booking' : 'Login to Book'}
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
