"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/providers';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError('Unable to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 sm:px-10">
        <div className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40">
          <div className="mb-8 space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-sky-400/75">Water Tank Management</p>
            <h1 className="text-3xl font-semibold text-white">Sign in to your WTM account</h1>
            <p className="text-sm text-slate-400">Access bookings, tracking, invoices, driver tasks, and notifications.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-200">Email</label>
              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@company.com" type="email" />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-200">Password</label>
              <Input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" type="password" />
            </div>

            {error ? <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            New to WTM? <Link href="/register" className="font-medium text-sky-300 hover:text-sky-200">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
