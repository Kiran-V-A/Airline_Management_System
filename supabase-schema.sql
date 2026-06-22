-- ============================================
-- Airline Management System — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create flights table
CREATE TABLE IF NOT EXISTS public.flights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flight_number TEXT NOT NULL UNIQUE,
  airline TEXT NOT NULL,
  source TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  arrival_time TIMESTAMPTZ NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  total_seats INTEGER NOT NULL CHECK (total_seats > 0),
  available_seats INTEGER NOT NULL CHECK (available_seats >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  flight_id UUID REFERENCES public.flights(id) ON DELETE CASCADE NOT NULL,
  seats_booked INTEGER NOT NULL CHECK (seats_booked > 0),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 5. Profiles RLS Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow insert for the trigger function
CREATE POLICY "Enable insert for service role"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 6. Flights RLS Policies (everyone can read, admins can write)
CREATE POLICY "Anyone can view flights"
  ON public.flights FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert flights"
  ON public.flights FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update flights"
  ON public.flights FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete flights"
  ON public.flights FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 7. Bookings RLS Policies
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 8. Auto-create profile on signup (trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Enable Realtime on flights table
ALTER PUBLICATION supabase_realtime ADD TABLE public.flights;

-- 10. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_flights_source ON public.flights(source);
CREATE INDEX IF NOT EXISTS idx_flights_destination ON public.flights(destination);
CREATE INDEX IF NOT EXISTS idx_flights_departure ON public.flights(departure_time);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_flight_id ON public.bookings(flight_id);

-- 11. Insert sample flights for demo
INSERT INTO public.flights (flight_number, airline, source, destination, departure_time, arrival_time, price, total_seats, available_seats) VALUES
  ('6E-2045', 'IndiGo', 'Mumbai', 'Delhi', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 2 hours', 4500.00, 180, 180),
  ('AI-302', 'Air India', 'Delhi', 'Bangalore', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 2 hours 30 minutes', 5800.00, 200, 200),
  ('SG-8169', 'SpiceJet', 'Chennai', 'Kolkata', NOW() + INTERVAL '1 day 4 hours', NOW() + INTERVAL '1 day 6 hours 30 minutes', 3900.00, 150, 150),
  ('UK-835', 'Vistara', 'Hyderabad', 'Mumbai', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 1 hour 45 minutes', 6200.00, 170, 170),
  ('6E-5012', 'IndiGo', 'Bangalore', 'Goa', NOW() + INTERVAL '2 days 6 hours', NOW() + INTERVAL '2 days 7 hours 15 minutes', 3200.00, 180, 180),
  ('AI-680', 'Air India', 'Kolkata', 'Jaipur', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days 2 hours 20 minutes', 5100.00, 200, 200),
  ('QP-1372', 'Akasa Air', 'Pune', 'Delhi', NOW() + INTERVAL '1 day 8 hours', NOW() + INTERVAL '1 day 10 hours', 4100.00, 189, 189),
  ('SG-723', 'SpiceJet', 'Goa', 'Chennai', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days 2 hours', 3700.00, 150, 150)
ON CONFLICT (flight_number) DO NOTHING;
