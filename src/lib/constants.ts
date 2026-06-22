// ============================================
// App Constants
// ============================================

export const APP_NAME = 'SkyVoyage';
export const APP_TAGLINE = 'Fly Beyond Limits';
export const APP_DESCRIPTION = 'Your premium airline booking experience. Discover flights, book seats, and manage your journeys — all in one place.';

// Major Indian cities for source/destination dropdowns
export const CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Goa',
  'Kochi',
  'Chandigarh',
  'Indore',
  'Bhopal',
  'Patna',
  'Varanasi',
  'Amritsar',
  'Srinagar',
  'Thiruvananthapuram',
  'Coimbatore',
  'Nagpur',
  'Visakhapatnam',
  'Guwahati',
  'Ranchi',
];

export const AIRLINES = [
  'IndiGo',
  'Air India',
  'SpiceJet',
  'Vistara',
  'GoAir',
  'AirAsia India',
  'Alliance Air',
  'Star Air',
  'Akasa Air',
];

// Gradient color tokens
export const GRADIENTS = {
  sky: 'from-sky-400 to-blue-600',
  sunset: 'from-orange-400 to-pink-500',
  ocean: 'from-cyan-400 to-blue-500',
};

// Route constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FLIGHTS: '/flights',
  BOOKING: '/booking',
  MY_BOOKINGS: '/my-bookings',
  ADMIN: '/admin',
  ADMIN_FLIGHTS: '/admin/flights',
} as const;

// Protected routes that require authentication
export const PROTECTED_ROUTES = ['/my-bookings', '/booking'];
export const ADMIN_ROUTES = ['/admin'];
