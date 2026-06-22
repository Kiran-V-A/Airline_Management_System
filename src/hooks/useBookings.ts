'use client';
// ============================================
// useBookings Hook — Booking Management
// ============================================
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Booking } from '@/lib/types';

export function useBookings(userId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchBookings = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('bookings')
      .select(`
        *,
        flight:flights(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setBookings((data as Booking[]) || []);
    }
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Create a new booking
  const createBooking = async (flightId: string, seatsBooked: number) => {
    // First, check available seats
    const { data: flight, error: flightError } = await supabase
      .from('flights')
      .select('available_seats')
      .eq('id', flightId)
      .single();

    if (flightError) throw new Error('Could not fetch flight details');
    if (!flight || flight.available_seats < seatsBooked) {
      throw new Error(`Only ${flight?.available_seats || 0} seats available`);
    }

    // Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: userId,
          flight_id: flightId,
          seats_booked: seatsBooked,
          status: 'confirmed',
        },
      ])
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Update available seats
    const { error: updateError } = await supabase
      .from('flights')
      .update({ available_seats: flight.available_seats - seatsBooked })
      .eq('id', flightId);

    if (updateError) {
      // Rollback: delete the booking if seat update fails
      await supabase.from('bookings').delete().eq('id', booking.id);
      throw new Error('Failed to update seat availability');
    }

    // Refresh bookings list
    await fetchBookings();
    return booking as Booking;
  };

  // Cancel a booking
  const cancelBooking = async (bookingId: string, flightId: string, seatsBooked: number) => {
    // Update booking status
    const { error: cancelError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (cancelError) throw cancelError;

    // Restore seats
    const { data: flight } = await supabase
      .from('flights')
      .select('available_seats')
      .eq('id', flightId)
      .single();

    if (flight) {
      await supabase
        .from('flights')
        .update({ available_seats: flight.available_seats + seatsBooked })
        .eq('id', flightId);
    }

    // Refresh bookings
    await fetchBookings();
  };

  // Fetch all bookings (admin)
  const fetchAllBookings = async () => {
    const { data, error: fetchError } = await supabase
      .from('bookings')
      .select(`
        *,
        flight:flights(*)
      `)
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;
    return (data as Booking[]) || [];
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    cancelBooking,
    fetchAllBookings,
    refetch: fetchBookings,
  };
}
