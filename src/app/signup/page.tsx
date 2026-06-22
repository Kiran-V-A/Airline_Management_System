'use client';
// ============================================
// Signup Page
// ============================================
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSignup = async (email: string, password: string, fullName?: string) => {
    setError(null);
    const { error } = await signUp(email, password, fullName || '');
    if (error) {
      setError(error.message);
    } else {
      router.push('/flights');
    }
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
      <AuthForm mode="signup" onSubmit={handleSignup} error={error} />
    </PageTransition>
  );
}
