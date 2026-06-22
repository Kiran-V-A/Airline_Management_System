'use client';
// ============================================
// Login Page
// ============================================
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import AuthForm from '@/components/AuthForm';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/hooks/useAuth';

function LoginContent() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  const redirectTo = searchParams.get('redirect') || '/flights';

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      router.push(redirectTo);
    }
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
      <AuthForm mode="login" onSubmit={handleLogin} error={error} />
    </PageTransition>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
