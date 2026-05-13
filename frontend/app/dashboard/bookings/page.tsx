"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBookings, updateBookingStatus } from '@/lib/api';
import { useAuth } from '@/components/providers';

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const BookingPage = () => {
  const { ready } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (err) {
        setError('Unable to load bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [ready]);

  const handleStatus = async (bookingId: number, status: string) => {
    try {
      await updateBookingStatus(bookingId, status);
      setBookings((current) =>
        current.map((item) => (item.id === bookingId ? { ...item, status } : item)),
      );
    } catch {
      setError('Unable to update booking status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Bookings</p>
        <h1 className="text-3xl font-semibold text-slate-950">Manage your current bookings</h1>
        <p className="max-w-2xl text-sm text-slate-600">View booking details, delivery address, assigned driver, and quick status actions.</p>
      </div>

      {error ? <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}

      <Card>
        <CardHeader>
          <CardTitle>Bookings table</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading bookings…</p>
          ) : bookings.length === 0 ? (
            <p className="text-sm text-slate-600">No bookings found yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Booking</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-900">#{booking.id} · {booking.service?.name ?? 'Service'}</td>
                      <td className="px-4 py-4">{new Date(booking.booking_date).toLocaleDateString()}</td>
                      <td className="px-4 py-4 text-slate-600">{statusLabels[booking.status] ?? booking.status}</td>
                      <td className="px-4 py-4">SAR {booking.total_amount}</td>
                      <td className="px-4 py-4">{booking.payment_status ?? 'Pending'}</td>
                      <td className="px-4 py-4 space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => handleStatus(booking.id, 'in_progress')}>
                          In progress
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => handleStatus(booking.id, 'completed')}>
                          Complete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingPage;
