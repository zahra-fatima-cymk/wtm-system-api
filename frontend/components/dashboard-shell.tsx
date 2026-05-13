"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers';

const navItems = [
  { label: 'Overview', href: '/dashboard', roles: ['user', 'driver', 'admin'] },
  { label: 'Bookings', href: '/dashboard/bookings', roles: ['user', 'driver', 'admin'] },
  { label: 'Payments', href: '/dashboard/payments', roles: ['user', 'admin'] },
  { label: 'Invoices', href: '/dashboard/history', roles: ['user', 'admin'] },
  { label: 'Notifications', href: '/dashboard/notifications', roles: ['user', 'driver', 'admin'] },
  { label: 'Driver Tasks', href: '/dashboard/driver-tasks', roles: ['driver', 'admin'] },
  { label: 'Ratings', href: '/dashboard/ratings', roles: ['user', 'driver', 'admin'] },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout, ready } = useAuth();
  const pathname = usePathname();

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-80 shrink-0 flex-col gap-6 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-950/5 lg:flex">
          <div>
            <div className="mb-4 rounded-3xl bg-slate-950/5 px-4 py-4 text-slate-950">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">WTM dashboard</p>
              <h2 className="mt-2 text-xl font-semibold">Control center</h2>
            </div>
            <div className="space-y-1">
              {user ? (
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Welcome back</p>
                  <p className="mt-1 font-semibold text-slate-900">{user.first_name} {user.last_name}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{user.type}</p>
                </div>
              ) : (
                <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-500">Not signed in</div>
              )}
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems
              .filter((item) => user && item.roles.includes(user.type))
              .map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-3xl px-4 py-3 text-sm font-medium transition ${
                      active ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Use your role to control the sections and work with all tasks safely.
            </div>
            <Button variant="outline" className="w-full" onClick={logout}>
              Sign out
            </Button>
          </div>
        </aside>

        <main className="flex-1 rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-950/5">
          {children}
        </main>
      </div>
    </div>
  );
}
