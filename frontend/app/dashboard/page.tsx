"use client";

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/providers';
import { getBookings, getDriverTasks, getNotifications, getPayments, getInvoices, getUserRatings, getDriverRatings } from '@/lib/api';

const DashboardPage = () => {
  const { user, ready } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);

  useEffect(() => {
    if (!ready || !user) return;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [bookingsData, notificationData] = await Promise.all([getBookings(), getNotifications()]);
        setBookings(bookingsData);
        setNotifications(notificationData);

        if (user.type === 'driver') {
          const [tasksData, driverRatings] = await Promise.all([getDriverTasks(), getDriverRatings()]);
          setTasks(tasksData);
          setRatings(driverRatings);
        } else {
          const [paymentsData, invoiceData, userRatings] = await Promise.all([getPayments(), getInvoices(), getUserRatings()]);
          setPayments(paymentsData);
          setInvoices(invoiceData);
          setRatings(userRatings);
        }
      } catch (err) {
        setError('Unable to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [ready, user]);

  const summary = useMemo(() => {
    return {
      bookings: bookings.length,
      payments: payments.length,
      notifications: notifications.length,
      tasks: tasks.length,
      invoices: invoices.length,
      ratings: ratings.length,
    };
  }, [bookings, payments, notifications, tasks, invoices, ratings]);

  if (!ready) {
    return <div className="min-h-[70vh] flex items-center justify-center">Preparing dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Dashboard</p>
          <h1 className="text-3xl font-semibold text-slate-950">Welcome back, {user?.first_name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Your role is <span className="font-semibold text-slate-900">{user?.type}</span>. Review the latest booking, payment, and task activity across the system.</p>
        </div>
      </div>

      {error ? <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total bookings</CardTitle>
            <CardDescription>{loading ? 'Loading…' : `${summary.bookings} bookings`}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">{loading ? '—' : summary.bookings}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active notifications</CardTitle>
            <CardDescription>{loading ? 'Loading…' : `${summary.notifications} unread items`}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">{loading ? '—' : summary.notifications}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{user?.type === 'driver' ? 'Assigned tasks' : 'Payments'}</CardTitle>
            <CardDescription>{loading ? 'Loading…' : `${user?.type === 'driver' ? summary.tasks : summary.payments} records`}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">{loading ? '—' : user?.type === 'driver' ? summary.tasks : summary.payments}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest records from your account</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading recent activity…</p>
            ) : (
              <ul className="space-y-3">
                <li className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">Bookings: {summary.bookings}</li>
                <li className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">Notifications: {summary.notifications}</li>
                {user?.type === 'driver' ? (
                  <li className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">Driver tasks: {summary.tasks}</li>
                ) : (
                  <>
                    <li className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">Payments: {summary.payments}</li>
                    <li className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">Invoices: {summary.invoices}</li>
                  </>
                )}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review status</CardTitle>
            <CardDescription>Ratings and performance summary</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <p>Loading ratings…</p> : <p className="text-4xl font-semibold text-slate-900">{summary.ratings}</p>}
            <p className="mt-2 text-sm text-slate-600">{user?.type === 'driver' ? 'Ratings received' : 'Ratings submitted'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
