'use client';
// ============================================
// FlightForm — Admin Add/Edit Flight Form
// ============================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plane, Loader2 } from 'lucide-react';
import { CITIES, AIRLINES } from '@/lib/constants';
import type { Flight } from '@/lib/types';

interface FlightFormProps {
  flight?: Flight | null;
  onSubmit: (flightData: Omit<Flight, 'id' | 'created_at'>) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export default function FlightForm({ flight, onSubmit, onClose, loading }: FlightFormProps) {
  const [formData, setFormData] = useState({
    flight_number: '',
    airline: AIRLINES[0],
    source: CITIES[0],
    destination: CITIES[1],
    departure_time: '',
    arrival_time: '',
    price: '',
    total_seats: '',
    available_seats: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (flight) {
      setFormData({
        flight_number: flight.flight_number,
        airline: flight.airline,
        source: flight.source,
        destination: flight.destination,
        departure_time: new Date(flight.departure_time).toISOString().slice(0, 16),
        arrival_time: new Date(flight.arrival_time).toISOString().slice(0, 16),
        price: flight.price.toString(),
        total_seats: flight.total_seats.toString(),
        available_seats: flight.available_seats.toString(),
      });
    }
  }, [flight]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (formData.source === formData.destination) {
      setFormError('Source and destination cannot be the same');
      return;
    }
    if (new Date(formData.arrival_time) <= new Date(formData.departure_time)) {
      setFormError('Arrival time must be after departure time');
      return;
    }
    if (Number(formData.available_seats) > Number(formData.total_seats)) {
      setFormError('Available seats cannot exceed total seats');
      return;
    }

    try {
      await onSubmit({
        flight_number: formData.flight_number,
        airline: formData.airline,
        source: formData.source,
        destination: formData.destination,
        departure_time: new Date(formData.departure_time).toISOString(),
        arrival_time: new Date(formData.arrival_time).toISOString(),
        price: parseFloat(formData.price),
        total_seats: parseInt(formData.total_seats),
        available_seats: parseInt(formData.available_seats || formData.total_seats),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save flight';
      setFormError(message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card rounded-3xl p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold font-display text-sky-900">
              {flight ? 'Edit Flight' : 'Add New Flight'}
            </h2>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-sky-100/50 text-sky-600 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Error */}
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Flight Number */}
          <div>
            <label className="text-sm font-medium text-sky-700 mb-1 block">Flight Number</label>
            <input
              type="text"
              name="flight_number"
              value={formData.flight_number}
              onChange={handleChange}
              placeholder="e.g., 6E-2045"
              className="input-premium"
              required
            />
          </div>

          {/* Airline */}
          <div>
            <label className="text-sm font-medium text-sky-700 mb-1 block">Airline</label>
            <select
              name="airline"
              value={formData.airline}
              onChange={handleChange}
              className="select-premium"
              required
            >
              {AIRLINES.map((airline) => (
                <option key={airline} value={airline}>{airline}</option>
              ))}
            </select>
          </div>

          {/* Source & Destination */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-sky-700 mb-1 block">Source</label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="select-premium"
                required
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-sky-700 mb-1 block">Destination</label>
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="select-premium"
                required
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-sky-700 mb-1 block">Departure</label>
              <input
                type="datetime-local"
                name="departure_time"
                value={formData.departure_time}
                onChange={handleChange}
                className="input-premium"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-sky-700 mb-1 block">Arrival</label>
              <input
                type="datetime-local"
                name="arrival_time"
                value={formData.arrival_time}
                onChange={handleChange}
                className="input-premium"
                required
              />
            </div>
          </div>

          {/* Price, Total Seats, Available Seats */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-sky-700 mb-1 block">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="4500"
                className="input-premium"
                min="1"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-sky-700 mb-1 block">Total Seats</label>
              <input
                type="number"
                name="total_seats"
                value={formData.total_seats}
                onChange={handleChange}
                placeholder="180"
                className="input-premium"
                min="1"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-sky-700 mb-1 block">Available</label>
              <input
                type="number"
                name="available_seats"
                value={formData.available_seats}
                onChange={handleChange}
                placeholder="180"
                className="input-premium"
                min="0"
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="btn-gradient w-full flex items-center justify-center gap-2 !py-3.5 mt-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plane className="w-5 h-5" />
                {flight ? 'Update Flight' : 'Add Flight'}
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
