'use client';
// ============================================
// Navbar — Glassmorphism Navigation Bar
// ============================================
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Menu, X, LogOut, User, LayoutDashboard, Ticket, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { APP_NAME, ROUTES } from '@/lib/constants';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAdmin, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { href: ROUTES.FLIGHTS, label: 'Search Flights', icon: Search },
    ...(user ? [{ href: ROUTES.MY_BOOKINGS, label: 'My Bookings', icon: Ticket }] : []),
    ...(isAdmin ? [{ href: ROUTES.ADMIN, label: 'Dashboard', icon: LayoutDashboard }] : []),
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: -15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Plane className="w-7 h-7 sm:w-8 sm:h-8 text-sky-600" />
              </motion.div>
              <span className="heading-font text-xl sm:text-2xl font-bold sky-text-gradient">
                {APP_NAME}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-sky-500/20 text-sky-700'
                        : 'text-sky-800/70 hover:text-sky-700 hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Auth Buttons (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {loading ? (
                <div className="w-24 h-10 skeleton rounded-xl" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/30">
                    <User className="w-4 h-4 text-sky-600" />
                    <span className="text-sm font-medium text-sky-800 max-w-[120px] truncate">
                      {profile?.full_name || user.email?.split('@')[0]}
                    </span>
                    {isAdmin && (
                      <span className="text-[10px] font-bold bg-sky-500 text-white px-2 py-0.5 rounded-full">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <motion.button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href={ROUTES.LOGIN}>
                    <motion.div
                      className="btn-outline text-sm !py-2 !px-5"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Login
                    </motion.div>
                  </Link>
                  <Link href={ROUTES.SIGNUP}>
                    <motion.div
                      className="btn-gradient text-sm !py-2 !px-5"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign Up
                    </motion.div>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden text-sky-700 p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                >
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-sky-500/20 text-sky-700'
                        : 'text-sky-800/70 hover:bg-white/20'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </div>
                </Link>
              ))}

              <div className="border-t border-white/20 pt-3 mt-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-4 py-2 text-sky-800">
                      <User className="w-5 h-5" />
                      <span className="font-medium">
                        {profile?.full_name || user.email?.split('@')[0]}
                      </span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50/30 w-full transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href={ROUTES.LOGIN}
                      onClick={() => setMobileOpen(false)}
                      className="block"
                    >
                      <div className="btn-outline text-center text-sm">Login</div>
                    </Link>
                    <Link
                      href={ROUTES.SIGNUP}
                      onClick={() => setMobileOpen(false)}
                      className="block"
                    >
                      <div className="btn-gradient text-center text-sm">Sign Up</div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
