'use client';
// ============================================
// My Bookings Page
// ============================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import BookingCard from '@/components/BookingCard';
import { BookingCardSkeleton } from '@/components/LoadingSkeleton';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const { bookings, loading, cancelBooking } = useBookings(user?.id);
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);

  const handleCancel = async (bookingId: string, flightId: string, seatsBooked: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    setCancelLoading(bookingId);
    try {
      await cancelBooking(bookingId, flightId, seatsBooked);
    } catch (err) {
      console.error('Cancel failed:', err);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancelLoading(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');

  return (
    <PageTransition className="min-h-screen pt-24 sm:pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold heading-font sky-text-gradient">
            My Bookings
          </h1>
          <p className="text-sky-600/70 mt-2">
            Manage your flight reservations
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Confirmed Bookings */}
        {!loading && confirmedBookings.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-sky-800 heading-font mb-4 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-sky-600" />
              Active Bookings ({confirmedBookings.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {confirmedBookings.map((booking, i) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  index={i}
                  onCancel={handleCancel}
                  cancelLoading={cancelLoading === booking.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Cancelled Bookings */}
        {!loading && cancelledBookings.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-sky-800/60 heading-font mb-4">
              Cancelled ({cancelledBookings.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cancelledBookings.map((booking, i) => (
                <BookingCard key={booking.id} booking={booking} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && bookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-10 h-10 text-sky-400" />
            </div>
            <h3 className="text-xl font-bold text-sky-900 heading-font">No Bookings Yet</h3>
            <p className="text-sky-600/70 mt-2 text-sm">
              Start your journey by searching for flights.
            </p>
            <Link href="/flights">
              <motion.div
                className="btn-gradient mt-6 inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Search className="w-4 h-4" />
                Search Flights
              </motion.div>
            </Link>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
