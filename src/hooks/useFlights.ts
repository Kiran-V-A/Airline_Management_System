'use client';
// ============================================
// useFlights Hook — Flight Data + Realtime
// ============================================
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Flight, FlightSearchParams } from '@/lib/types';

export function useFlights(searchParams?: FlightSearchParams) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchFlights = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('flights')
      .select('*')
      .order('departure_time', { ascending: true });

    if (searchParams?.source) {
      query = query.eq('source', searchParams.source);
    }
    if (searchParams?.destination) {
      query = query.eq('destination', searchParams.destination);
    }
    if (searchParams?.date) {
      // Filter flights on the specified date
      const startOfDay = new Date(searchParams.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(searchParams.date);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .gte('departure_time', startOfDay.toISOString())
        .lte('departure_time', endOfDay.toISOString());
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setFlights((data as Flight[]) || []);
    }
    setLoading(false);
  }, [supabase, searchParams?.source, searchParams?.destination, searchParams?.date]);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  // Subscribe to realtime updates on the flights table
  useEffect(() => {
    const channel = supabase
      .channel('flights-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'flights' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setFlights((prev) =>
              prev.map((f) =>
                f.id === (payload.new as Flight).id
                  ? (payload.new as Flight)
                  : f
              )
            );
          } else if (payload.eventType === 'INSERT') {
            setFlights((prev) => [...prev, payload.new as Flight]);
          } else if (payload.eventType === 'DELETE') {
            setFlights((prev) =>
              prev.filter((f) => f.id !== (payload.old as Flight).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Admin: Add flight
  const addFlight = async (flight: Omit<Flight, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('flights')
      .insert([flight])
      .select()
      .single();

    if (error) throw error;
    return data as Flight;
  };

  // Admin: Update flight
  const updateFlight = async (id: string, updates: Partial<Flight>) => {
    const { data, error } = await supabase
      .from('flights')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Flight;
  };

  // Admin: Delete flight
  const deleteFlight = async (id: string) => {
    const { error } = await supabase.from('flights').delete().eq('id', id);
    if (error) throw error;
  };

  return {
    flights,
    loading,
    error,
    refetch: fetchFlights,
    addFlight,
    updateFlight,
    deleteFlight,
  };
}
