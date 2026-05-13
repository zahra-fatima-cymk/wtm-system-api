"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { register as registerRequest } from '@/lib/api';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerRequest({
        ...form,
        type: 'user',
      });
      router.push('/login');
    } catch (err) {
      setError('Registration failed. Please verify your values and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 sm:px-10">
        <div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40">
          <div className="mb-8 space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-sky-400/75">Create a WTM profile</p>
            <h1 className="text-3xl font-semibold text-white">Register for water operations</h1>
            <p className="text-sm text-slate-400">Use your account to manage bookings, invoices, ratings, and driver assignments.</p>
          </div>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200">
                <span>First name</span>
                <Input value={form.first_name} onChange={(event) => setForm({ ...form, first_name: event.target.value })} placeholder="Aqsa" />
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span>Last name</span>
                <Input value={form.last_name} onChange={(event) => setForm({ ...form, last_name: event.target.value })} placeholder="Zahra" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200">
                <span>Email</span>
                <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="name@example.com" />
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span>Phone</span>
                <Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="0500 000 000" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200">
                <span>Password</span>
                <Input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="••••••••" />
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span>City</span>
                <Input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="Jeddah" />
              </label>
            </div>

            <label className="space-y-2 text-sm text-slate-200">
              <span>Address</span>
              <Input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Example Street 123" />
            </label>

            <label className="space-y-2 text-sm text-slate-200">
              <span>Postal code</span>
              <Input value={form.postal_code} onChange={(event) => setForm({ ...form, postal_code: event.target.value })} placeholder="21564" />
            </label>

            {error ? <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Already registered? <Link href="/login" className="font-medium text-sky-300 hover:text-sky-200">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
