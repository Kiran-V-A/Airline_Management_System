# ✈️ SkyVoyage — Airline Management System

A **premium, full-stack Airline Management System** with a stunning animated UI inspired by modern airline websites like IndiGo, Emirates, and Air India.

Built with **Next.js 15**, **Tailwind CSS**, **Framer Motion**, **Supabase**, and **TypeScript**.

---

## ✨ Features

### 🌤️ Premium UI
- Blue sky gradient background with animated parallax clouds
- Airplane flying animation across the hero section
- Glassmorphism navbar and cards
- Smooth Framer Motion page transitions and micro-interactions
- Loading skeletons and responsive mobile design

### ✈️ Core Functionality
- **Flight Search** — Filter by source, destination, and date
- **Booking System** — Book seats with real-time availability validation
- **My Bookings** — View and cancel your reservations
- **Admin Dashboard** — Stats, charts (Recharts), and revenue analytics
- **Flight Management** — Admin CRUD for flights

### 🔐 Authentication
- Supabase Auth (email + password)
- Role-based access: **User** and **Admin**
- Protected routes with middleware

### ⚡ Advanced
- Real-time seat updates via Supabase Realtime
- Booking status tracking (confirmed/cancelled)
- Input validation and error handling
- Responsive across all devices

---

## 🛠️ Tech Stack

| Layer       | Technology                            |
|-------------|---------------------------------------|
| Frontend    | Next.js 15 (App Router), TypeScript   |
| Styling     | Tailwind CSS, Framer Motion           |
| Backend     | Supabase (PostgreSQL + Auth + Realtime)|
| Charts      | Recharts                              |
| Icons       | Lucide React                          |
| Deployment  | Vercel-ready                          |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/airline-management-system.git
cd airline-management-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API** and copy your **Project URL** and **Anon Key**
3. Create `.env.local` from the template:

```bash
cp .env.local.example .env.local
```

4. Fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up the Database

1. Go to your Supabase project → **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL script
4. This creates all tables, RLS policies, triggers, and sample flights

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 👤 Admin Setup

Admin roles are assigned manually for security:

1. Sign up as a regular user through the app
2. Go to your Supabase dashboard → **Table Editor → profiles**
3. Find your user and change the `role` column from `user` to `admin`
4. Refresh the app — you'll now see the Admin Dashboard link

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with navbar
│   ├── page.tsx                # Landing page (hero animation)
│   ├── globals.css             # Design system + animations
│   ├── login/page.tsx          # Login page
│   ├── signup/page.tsx         # Signup page
│   ├── flights/page.tsx        # Flight search
│   ├── booking/[id]/page.tsx   # Booking page
│   ├── my-bookings/page.tsx    # User's bookings
│   ├── admin/
│   │   ├── page.tsx            # Admin dashboard
│   │   └── flights/page.tsx    # Flight CRUD
│   └── auth/callback/route.ts  # Auth callback
├── components/
│   ├── Navbar.tsx              # Glassmorphism navbar
│   ├── Hero.tsx                # Hero section
│   ├── CloudsBackground.tsx    # Animated clouds
│   ├── AirplaneAnimation.tsx   # Flying airplane
│   ├── FlightCard.tsx          # Flight result card
│   ├── BookingCard.tsx         # Booking display card
│   ├── SearchForm.tsx          # Flight search form
│   ├── AuthForm.tsx            # Login/signup form
│   ├── FlightForm.tsx          # Admin flight form
│   ├── StatsCard.tsx           # Dashboard stat card
│   ├── LoadingSkeleton.tsx     # Loading states
│   └── PageTransition.tsx      # Page animations
├── hooks/
│   ├── useAuth.ts              # Auth state management
│   ├── useFlights.ts           # Flight data + realtime
│   └── useBookings.ts          # Booking operations
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   └── server.ts           # Server client
│   ├── types.ts                # TypeScript types
│   └── constants.ts            # App constants
└── middleware.ts               # Auth middleware
```

---

## 🗃️ Database Schema

### flights
| Column           | Type        | Description             |
|------------------|-------------|-------------------------|
| id               | UUID (PK)   | Auto-generated          |
| flight_number    | TEXT         | Unique flight code      |
| airline          | TEXT         | Airline name            |
| source           | TEXT         | Departure city          |
| destination      | TEXT         | Arrival city            |
| departure_time   | TIMESTAMPTZ | Departure datetime      |
| arrival_time     | TIMESTAMPTZ | Arrival datetime        |
| price            | NUMERIC     | Ticket price (INR)      |
| total_seats      | INTEGER     | Total capacity          |
| available_seats  | INTEGER     | Currently available     |

### bookings
| Column       | Type        | Description             |
|--------------|-------------|-------------------------|
| id           | UUID (PK)   | Auto-generated          |
| user_id      | UUID (FK)   | References profiles     |
| flight_id    | UUID (FK)   | References flights      |
| seats_booked | INTEGER     | Number of seats         |
| status       | TEXT        | confirmed / cancelled   |

### profiles
| Column     | Type        | Description             |
|------------|-------------|-------------------------|
| id         | UUID (PK)   | References auth.users   |
| email      | TEXT        | User email              |
| full_name  | TEXT        | Display name            |
| role       | TEXT        | user / admin            |

---

## 🚢 Deployment

This app is **Vercel-ready**:

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy!

---

## 📄 License

MIT License — feel free to use and modify.
