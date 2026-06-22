// ============================================
// Airline Management System — TypeScript Types
// ============================================

export interface Flight {
  id: string;
  flight_number: string;
  airline: string;
  source: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  total_seats: number;
  available_seats: number;
  created_at?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  flight_id: string;
  seats_booked: number;
  status: 'confirmed' | 'cancelled';
  created_at: string;
  flight?: Flight; // joined relation
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'admin';
  created_at?: string;
}

export interface FlightSearchParams {
  source?: string;
  destination?: string;
  date?: string;
}

export interface DashboardStats {
  totalFlights: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
}

export type BookingStatus = 'confirmed' | 'cancelled';
export type UserRole = 'user' | 'admin';
