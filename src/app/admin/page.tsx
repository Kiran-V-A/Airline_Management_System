'use client';
// ============================================
// Admin Dashboard Page
// ============================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Plane, Ticket, IndianRupee, Users, BarChart3, Loader2, ShieldAlert } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { format } from 'date-fns';
import Link from 'next/link';
import StatsCard from '@/components/StatsCard';
import { StatsCardSkeleton } from '@/components/LoadingSkeleton';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/hooks/useAuth';
import { useFlights } from '@/hooks/useFlights';
import { createClient } from '@/lib/supabase/client';
import type { Booking, DashboardStats } from '@/lib/types';

const PIE_COLORS = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#0284c7', '#0369a1', '#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc'];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, profile, isAdmin, loading: authLoading } = useAuth();
  const { flights, loading: flightsLoading } = useFlights();
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ totalFlights: 0, totalBookings: 0, totalRevenue: 0, activeUsers: 0 });
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch all bookings (admin)
  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      const supabase = createClient();

      // Fetch all bookings with flight data
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*, flight:flights(*)')
        .order('created_at', { ascending: false });

      // Fetch unique users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const bookings = (bookingsData as Booking[]) || [];
      setAllBookings(bookings);

      // Calculate stats
      const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
      const revenue = confirmedBookings.reduce((sum, b) => {
        const price = b.flight?.price || 0;
        return sum + price * b.seats_booked;
      }, 0);

      setStats({
        totalFlights: flights.length,
        totalBookings: confirmedBookings.length,
        totalRevenue: revenue,
        activeUsers: usersCount || 0,
      });

      setDataLoading(false);
    };

    fetchData();
  }, [isAdmin, flights]);

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

  // Prepare chart data
  const bookingsByAirline = flights.map((f) => ({
    name: f.airline,
    bookings: allBookings.filter((b) => b.flight_id === f.id && b.status === 'confirmed').length,
  }));

  // Aggregate by airline
  const airlineMap = new Map<string, number>();
  bookingsByAirline.forEach(({ name, bookings }) => {
    airlineMap.set(name, (airlineMap.get(name) || 0) + bookings);
  });
  const barData = Array.from(airlineMap.entries()).map(([name, bookings]) => ({ name, bookings }));

  // Seat utilization pie chart
  const seatData = flights.map((f) => ({
    name: f.flight_number,
    booked: f.total_seats - f.available_seats,
    available: f.available_seats,
  }));

  // Revenue over time (group by date)
  const revByDate = new Map<string, number>();
  allBookings
    .filter((b) => b.status === 'confirmed')
    .forEach((b) => {
      const date = format(new Date(b.created_at), 'dd MMM');
      const rev = (b.flight?.price || 0) * b.seats_booked;
      revByDate.set(date, (revByDate.get(date) || 0) + rev);
    });
  const revenueData = Array.from(revByDate.entries()).map(([date, revenue]) => ({ date, revenue }));

  const statsCards = [
    { title: 'Total Flights', value: stats.totalFlights, icon: Plane, color: 'from-sky-400 to-blue-600' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: Ticket, color: 'from-emerald-400 to-teal-600' },
    { title: 'Total Revenue', value: stats.totalRevenue, icon: IndianRupee, prefix: '₹', color: 'from-amber-400 to-orange-600' },
    { title: 'Registered Users', value: stats.activeUsers, icon: Users, color: 'from-violet-400 to-purple-600' },
  ];

  return (
    <PageTransition className="min-h-screen pt-24 sm:pt-28 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-gradient">
              Admin Dashboard
            </h1>
            <p className="text-sky-600/70 mt-1">Overview of your airline operations</p>
          </div>
          <Link href="/admin/flights">
            <motion.div
              className="btn-gradient flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plane className="w-5 h-5" />
              Manage Flights
            </motion.div>
          </Link>
        </div>

        {/* Stats Grid */}
        {dataLoading || flightsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[...Array(4)].map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statsCards.map((card, i) => (
              <StatsCard key={card.title} {...card} index={i} />
            ))}
          </div>
        )}

        {/* Charts Grid */}
        {!dataLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-sky-900 font-display mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-sky-600" />
                Revenue Trend
              </h3>
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                    <XAxis dataKey="date" stroke="#7dd3fc" fontSize={12} />
                    <YAxis stroke="#7dd3fc" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(255,255,255,0.9)',
                        border: '1px solid #bae6fd',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(14,165,233,0.1)',
                      }}
                      formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sky-500 text-sm text-center py-16">No revenue data yet</p>
              )}
            </motion.div>

            {/* Bookings by Airline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-sky-900 font-display mb-4">
                Bookings by Airline
              </h3>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                    <XAxis dataKey="name" stroke="#7dd3fc" fontSize={11} angle={-20} textAnchor="end" height={60} />
                    <YAxis stroke="#7dd3fc" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(255,255,255,0.9)',
                        border: '1px solid #bae6fd',
                        borderRadius: '12px',
                      }}
                    />
                    <Bar dataKey="bookings" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sky-500 text-sm text-center py-16">No booking data yet</p>
              )}
            </motion.div>

            {/* Seat Utilization Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-2xl p-6 lg:col-span-2"
            >
              <h3 className="text-lg font-bold text-sky-900 font-display mb-4">
                Seat Utilization by Flight
              </h3>
              {seatData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={seatData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      dataKey="booked"
                      nameKey="name"
                      paddingAngle={3}
                      label={(props: { name?: string; value?: number }) => `${props.name || ''}: ${props.value || 0}`}
                    >
                      {seatData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(255,255,255,0.9)',
                        border: '1px solid #bae6fd',
                        borderRadius: '12px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sky-500 text-sm text-center py-16">No flight data yet</p>
              )}
            </motion.div>
          </div>
        )}

        {/* Recent Bookings Table */}
        {!dataLoading && allBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/30">
              <h3 className="text-lg font-bold text-sky-900 font-display">Recent Bookings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-sky-50/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-sky-600 uppercase tracking-wider">Flight</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-sky-600 uppercase tracking-wider">Route</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-sky-600 uppercase tracking-wider">Seats</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-sky-600 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-sky-600 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100/50">
                  {allBookings.slice(0, 10).map((booking) => (
                    <tr key={booking.id} className="hover:bg-sky-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-sky-800">{booking.flight?.flight_number}</p>
                        <p className="text-xs text-sky-500">{booking.flight?.airline}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-sky-700">
                        {booking.flight?.source} → {booking.flight?.destination}
                      </td>
                      <td className="px-6 py-4 text-sm text-sky-800 font-medium">{booking.seats_booked}</td>
                      <td className="px-6 py-4">
                        <span className={booking.status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled'}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-sky-600">
                        {format(new Date(booking.created_at), 'dd MMM yyyy, HH:mm')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
