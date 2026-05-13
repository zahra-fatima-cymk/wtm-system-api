'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowUpRightIcon,
  CalendarIcon,
  CreditCardIcon,
  DropletsIcon,
  InboxIcon,
  TruckIcon,
  UsersIcon,
} from 'lucide-react';
import { useAuth } from '@/components/providers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useApiQuery } from '@/hooks/use-api-query';
import {
  getAdminHistory,
  getAllDriverTasks,
  getBookings,
  getDrivers,
  getDriverTasks,
  getNotifications,
  getPayments,
  getUsers,
} from '@/lib/api';
import type { Booking, DriverTask, NotificationItem, Payment } from '@/lib/types';

export default function DashboardPage() {
  const { user, ready } = useAuth();

  const bookingsQ = useApiQuery(ready && user ? `bookings-${user.id}` : null, () => getBookings(), {
    enabled: Boolean(ready && user),
  });
  const notificationsQ = useApiQuery(ready && user ? `notif-${user.id}` : null, () => getNotifications(), {
    enabled: Boolean(ready && user),
  });
  const paymentsQ = useApiQuery(
    ready && user && (user.type === 'user' || user.type === 'admin') ? `pay-${user.id}` : null,
    () => getPayments(),
    { enabled: Boolean(ready && user && (user.type === 'user' || user.type === 'admin')) },
  );
  const tasksQ = useApiQuery(
    ready && user && (user.type === 'driver' || user.type === 'admin') ? `tasks-${user.type}` : null,
    async () => {
      if (user?.type === 'admin') return getAllDriverTasks();
      return getDriverTasks();
    },
    { enabled: Boolean(ready && user && (user.type === 'driver' || user.type === 'admin')) },
  );
  const usersQ = useApiQuery(ready && user?.type === 'admin' ? 'users' : null, () => getUsers(), {
    enabled: Boolean(ready && user?.type === 'admin'),
  });
  const driversQ = useApiQuery(ready && user?.type === 'admin' ? 'drivers' : null, () => getDrivers(), {
    enabled: Boolean(ready && user?.type === 'admin'),
  });
  const historyQ = useApiQuery(ready && user?.type === 'admin' ? 'hist' : null, () => getAdminHistory(), {
    enabled: Boolean(ready && user?.type === 'admin'),
  });

  const loading =
    bookingsQ.loading ||
    notificationsQ.loading ||
    (user?.type === 'user' || user?.type === 'admin' ? paymentsQ.loading : false) ||
    (user?.type === 'driver' || user?.type === 'admin' ? tasksQ.loading : false) ||
    (user?.type === 'admin' ? usersQ.loading || driversQ.loading || historyQ.loading : false);

  const stats = useMemo(() => {
    const bookings = (bookingsQ.data ?? []) as Booking[];
    const notifications = (notificationsQ.data ?? []) as NotificationItem[];
    const payments = (paymentsQ.data ?? []) as Payment[];
    const tasks = (tasksQ.data ?? []) as DriverTask[];

    const unread = notifications.filter((n) => !n.is_read).length;
    const pendingBookings = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length;
    const activeTasks = tasks.filter((t) => t.status === 'assigned' || t.status === 'in_progress').length;
    const pendingPay = payments.filter((p) => p.payment_status === 'pending').length;

    return { unread, pendingBookings, activeTasks, pendingPay, totalBookings: bookings.length };
  }, [bookingsQ.data, notificationsQ.data, paymentsQ.data, tasksQ.data]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Dashboard</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
            Welcome back, {user.first_name}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Signed in as <Badge variant="secondary" className="align-middle capitalize">{user.type}</Badge>
            {' '}— here&apos;s what needs attention today.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/bookings">Bookings</Link>
          </Button>
          {user.type === 'user' || user.type === 'admin' ? (
            <Button asChild>
              <Link href="/dashboard/payments">Payments</Link>
            </Button>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/80 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Bookings</CardDescription>
              <CalendarIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">{stats.totalBookings}</p>
              <p className="text-xs text-muted-foreground">{stats.pendingBookings} active in pipeline</p>
            </CardContent>
          </Card>
          <Card className="border-border/80 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Notifications</CardDescription>
              <InboxIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">{stats.unread}</p>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
          {user.type === 'user' || user.type === 'admin' ? (
            <Card className="border-border/80 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Payments</CardDescription>
                <CreditCardIcon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tabular-nums">{stats.pendingPay}</p>
                <p className="text-xs text-muted-foreground">Pending verification</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/80 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Driver tasks</CardDescription>
                <TruckIcon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tabular-nums">{stats.activeTasks}</p>
                <p className="text-xs text-muted-foreground">In progress / assigned</p>
              </CardContent>
            </Card>
          )}
          {user.type === 'admin' ? (
            <Card className="border-border/80 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Network</CardDescription>
                <UsersIcon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tabular-nums">
                  {(usersQ.data?.length ?? 0) + (driversQ.data?.length ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">Users + drivers</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/80 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Quick link</CardDescription>
                <DropletsIcon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button asChild variant="secondary" size="sm" className="justify-between">
                  <Link href="/dashboard/tracking">
                    Open tracking <ArrowUpRightIcon className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/80 shadow-md lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Latest bookings</CardTitle>
              <CardDescription>Scoped to your role — only your data loads from the API.</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/bookings">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {(bookingsQ.data ?? []).slice(0, 5).map((b) => (
              <div
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">
                    #{b.id} · {b.service?.name ?? 'Service'}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(b.booking_date).toLocaleDateString()}</p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {b.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
            {(bookingsQ.data ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings to display yet.</p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-md">
          <CardHeader>
            <CardTitle>Shortcuts</CardTitle>
            <CardDescription>Jump into the workflows you use most.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/notifications">Notifications</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/history">History</Link>
            </Button>
            {user.type === 'driver' || user.type === 'admin' ? (
              <Button asChild variant="outline" className="justify-start">
                <Link href="/dashboard/driver-tasks">Driver tasks</Link>
              </Button>
            ) : null}
            {user.type === 'admin' ? (
              <>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/dashboard/users">User management</Link>
                </Button>
                <Button asChild variant="secondary" className="justify-start">
                  <Link href="/dashboard/services">Service catalog</Link>
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {user.type === 'admin' && historyQ.data && historyQ.data.length > 0 ? (
        <Card className="border-border/80 shadow-md">
          <CardHeader>
            <CardTitle>Recent audit trail</CardTitle>
            <CardDescription>Latest events recorded across the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {historyQ.data.slice(0, 6).map((h) => (
              <div key={h.id} className="flex flex-wrap justify-between gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm">
                <span className="font-medium">{h.action_type}</span>
                <span className="text-muted-foreground">{h.description}</span>
                <span className="text-xs text-muted-foreground">
                  {h.created_at ? new Date(h.created_at).toLocaleString() : ''}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
