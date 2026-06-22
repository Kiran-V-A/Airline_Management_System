'use client';
// ============================================
// Admin Flight Management Page
// ============================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Plane, Loader2, ShieldAlert, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import FlightForm from '@/components/FlightForm';
import { FlightCardSkeleton } from '@/components/LoadingSkeleton';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/hooks/useAuth';
import { useFlights } from '@/hooks/useFlights';
import type { Flight } from '@/lib/types';

export default function AdminFlightsPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { flights, loading, addFlight, updateFlight, deleteFlight } = useFlights();
  const [showForm, setShowForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Auth guard
  if (authLoading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <PageTransition className="min-h-screen pt-28 px-4">
        <div className="max-w-md mx-auto text-center glass-card rounded-3xl p-12">
          <ShieldAlert className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-sky-900 font-display">Access Denied</h2>
          <p className="text-sky-600/70 mt-2">You need admin privileges to access this page.</p>
          <button onClick={() => router.push('/')} className="btn-gradient mt-6">Go Home</button>
        </div>
      </PageTransition>
    );
  }

  const handleAdd = async (flightData: Omit<Flight, 'id' | 'created_at'>) => {
    setFormLoading(true);
    try {
      await addFlight(flightData);
      setShowForm(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (flightData: Omit<Flight, 'id' | 'created_at'>) => {
    if (!editingFlight) return;
    setFormLoading(true);
    try {
      await updateFlight(editingFlight.id, flightData);
      setEditingFlight(null);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flight? This action cannot be undone.')) return;
    setDeleteLoading(id);
    try {
      await deleteFlight(id);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete flight. It may have existing bookings.');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <PageTransition className="min-h-screen pt-24 sm:pt-28 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <motion.div
                className="p-2 rounded-xl hover:bg-white/30 text-sky-600 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.div>
            </Link>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-gradient">
                Flight Management
              </h1>
              <p className="text-sky-600/70 mt-1">Add, edit, and manage all flights</p>
            </div>
          </div>
          <motion.button
            onClick={() => { setEditingFlight(null); setShowForm(true); }}
            className="btn-gradient flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Add Flight
          </motion.button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(4)].map((_, i) => (
              <FlightCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Flights Table (Desktop) / Cards (Mobile) */}
        {!loading && flights.length > 0 && (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-sky-50/50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-sky-600 uppercase tracking-wider">Flight</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-sky-600 uppercase tracking-wider">Route</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-sky-600 uppercase tracking-wider">Departure</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-sky-600 uppercase tracking-wider">Price</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-sky-600 uppercase tracking-wider">Seats</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-sky-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100/50">
                    {flights.map((flight, i) => (
                      <motion.tr
                        key={flight.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-sky-50/30 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                              <Plane className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-sky-800">{flight.flight_number}</p>
                              <p className="text-xs text-sky-500">{flight.airline}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-sky-700">
                          {flight.source} → {flight.destination}
                        </td>
                        <td className="px-5 py-4 text-sm text-sky-700">
                          {format(new Date(flight.departure_time), 'dd MMM yyyy, HH:mm')}
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-sky-800">
                          ₹{flight.price.toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-sky-700">{flight.available_seats}/{flight.total_seats}</span>
                            <div className="w-16 h-1.5 rounded-full bg-sky-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-600"
                                style={{ width: `${((flight.total_seats - flight.available_seats) / flight.total_seats) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <motion.button
                              onClick={() => { setEditingFlight(flight); setShowForm(true); }}
                              className="p-2 rounded-xl hover:bg-sky-100 text-sky-600 transition-colors"
                              whileTap={{ scale: 0.9 }}
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDelete(flight.id)}
                              className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition-colors"
                              whileTap={{ scale: 0.9 }}
                              disabled={deleteLoading === flight.id}
                              title="Delete"
                            >
                              {deleteLoading === flight.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {flights.map((flight, i) => (
                <motion.div
                  key={flight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                        <Plane className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sky-800">{flight.flight_number}</p>
                        <p className="text-xs text-sky-500">{flight.airline}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setEditingFlight(flight); setShowForm(true); }}
                        className="p-2 rounded-xl hover:bg-sky-100 text-sky-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(flight.id)}
                        className="p-2 rounded-xl hover:bg-red-50 text-red-500"
                        disabled={deleteLoading === flight.id}
                      >
                        {deleteLoading === flight.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-sky-700">{flight.source} → {flight.destination}</p>
                  <p className="text-xs text-sky-500 mt-1">{format(new Date(flight.departure_time), 'dd MMM yyyy, HH:mm')}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-sky-100/50">
                    <span className="text-sm font-semibold text-sky-800">₹{flight.price.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-sky-600">{flight.available_seats}/{flight.total_seats} seats</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && flights.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto"
          >
            <Plane className="w-16 h-16 text-sky-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-sky-900 font-display">No Flights Yet</h3>
            <p className="text-sky-600/70 mt-2 text-sm">Add your first flight to get started.</p>
            <button onClick={() => setShowForm(true)} className="btn-gradient mt-6">
              <Plus className="w-4 h-4 inline mr-2" />
              Add Flight
            </button>
          </motion.div>
        )}

        {/* Flight Form Modal */}
        <AnimatePresence>
          {showForm && (
            <FlightForm
              flight={editingFlight}
              onSubmit={editingFlight ? handleEdit : handleAdd}
              onClose={() => { setShowForm(false); setEditingFlight(null); }}
              loading={formLoading}
            />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
