'use client';

import { useRouter } from 'next/navigation';
import LoginForm from "@/components/login-form"
import CyberGrid from "@/components/cyber-grid"

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      <CyberGrid />
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </main>
  )
}

