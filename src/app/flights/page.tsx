'use client';
// ============================================
// Flight Search Page
// ============================================
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plane, SearchX } from 'lucide-react';
import SearchForm from '@/components/SearchForm';
import FlightCard from '@/components/FlightCard';
import { FlightCardSkeleton } from '@/components/LoadingSkeleton';
import PageTransition from '@/components/PageTransition';
import { useFlights } from '@/hooks/useFlights';
import type { FlightSearchParams } from '@/lib/types';

export default function FlightsPage() {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({});
  const { flights, loading } = useFlights(searchParams);

  const handleSearch = useCallback((source: string, destination: string, date: string) => {
    setSearchParams({
      source: source || undefined,
      destination: destination || undefined,
      date: date || undefined,
    });
  }, []);

  return (
    <PageTransition className="min-h-screen pt-24 sm:pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-gradient">
            Find Your Perfect Flight
          </h1>
          <p className="text-sky-600/70 mt-2">
            Search across airlines for the best deals
          </p>
        </motion.div>

        {/* Search Form */}
        <div className="mb-10">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Results */}
        <div className="space-y-1 mb-6">
          {!loading && flights.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-sky-600/70"
            >
              {flights.length} flight{flights.length !== 1 ? 's' : ''} found
            </motion.p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <FlightCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Flight Cards */}
        {!loading && flights.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {flights.map((flight, i) => (
              <FlightCard key={flight.id} flight={flight} index={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && flights.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto mt-8"
          >
            <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-6">
              <SearchX className="w-10 h-10 text-sky-400" />
            </div>
            <h3 className="text-xl font-bold text-sky-900 font-display">No Flights Found</h3>
            <p className="text-sky-600/70 mt-2 text-sm">
              Try adjusting your search filters or check a different date.
            </p>
            <motion.button
              onClick={() => setSearchParams({})}
              className="btn-outline mt-6 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plane className="w-4 h-4 inline mr-2" />
              View All Flights
            </motion.button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
