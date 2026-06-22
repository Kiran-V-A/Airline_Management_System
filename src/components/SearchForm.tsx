'use client';
// ============================================
// SearchForm — Flight Search Component
// ============================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, ArrowRightLeft } from 'lucide-react';
import { CITIES } from '@/lib/constants';

interface SearchFormProps {
  onSearch: (source: string, destination: string, date: string) => void;
  loading?: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(source, destination, date);
  };

  const swapCities = () => {
    setSource(destination);
    setDestination(source);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-6 sm:p-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr,1fr,auto] gap-4 items-end">
        {/* Source */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-sky-700 mb-2">
            <MapPin className="w-4 h-4" />
            From
          </label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="select-premium"
          >
            <option value="">All Cities</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <motion.button
          type="button"
          onClick={swapCities}
          className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 transition-colors self-end mb-1"
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowRightLeft className="w-4 h-4" />
        </motion.button>

        {/* Destination */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-sky-700 mb-2">
            <MapPin className="w-4 h-4" />
            To
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="select-premium"
          >
            <option value="">All Cities</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-sky-700 mb-2">
            <Calendar className="w-4 h-4" />
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-premium"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Search Button */}
        <motion.button
          type="submit"
          className="btn-gradient flex items-center justify-center gap-2 h-[52px]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          <Search className="w-5 h-5" />
          {loading ? 'Searching...' : 'Search'}
        </motion.button>
      </div>
    </motion.form>
  );
}
