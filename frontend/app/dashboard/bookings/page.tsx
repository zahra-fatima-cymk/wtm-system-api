'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  assignDriverToBooking,
  createBooking,
  getBookings,
  getDrivers,
  getServices,
  updateBookingStatus,
} from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-errors';
import { useAuth } from '@/components/providers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useApiQuery } from '@/hooks/use-api-query';
import type { Booking, Driver, Service } from '@/lib/types';

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function BookingsPage() {
  const { user, ready } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [assignFor, setAssignFor] = useState<Booking | null>(null);
  const [assignDriverId, setAssignDriverId] = useState<string>('');

  const bookingsQ = useApiQuery(ready && user ? `bookings-page-${user.id}` : null, () => getBookings(), {
    enabled: Boolean(ready && user),
  });
  const servicesQ = useApiQuery(ready && user?.type === 'user' ? 'services-book' : null, () => getServices(), {
    enabled: Boolean(ready && user?.type === 'user'),
  });
  const driversQ = useApiQuery(ready && user?.type === 'admin' ? 'drivers-book' : null, () => getDrivers(), {
    enabled: Boolean(ready && user?.type === 'admin'),
  });

  const [form, setForm] = useState({
    service_id: '',
    booking_date: '',
    scheduled_time: '',
    delivery_address: '',
    special_requests: '',
    quantity: '1',
    payment_method: 'cash_on_delivery' as 'cash_on_delivery' | 'online',
  });

  const services = useMemo(
    () => (servicesQ.data ?? []).filter((s: Service) => s.is_active !== false),
    [servicesQ.data],
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.type !== 'user') return;
    try {
      await createBooking({
        service_id: Number(form.service_id),
        booking_date: form.booking_date,
        scheduled_time: new Date(form.scheduled_time).toISOString(),
        delivery_address: form.delivery_address,
        special_requests: form.special_requests || undefined,
        quantity: Number(form.quantity),
        payment_method: form.payment_method,
      });
      toast.success('Booking created');
      setCreateOpen(false);
      await bookingsQ.refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not create booking'));
    }
  };

  const handleAssign = async () => {
    if (!assignFor || !assignDriverId) return;
    try {
      await assignDriverToBooking(assignFor.id, Number(assignDriverId));
      toast.success('Driver assigned');
      setAssignFor(null);
      setAssignDriverId('');
      await bookingsQ.refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Assign failed'));
    }
  };

  const handleStatus = async (bookingId: number, status: string) => {
    try {
      await updateBookingStatus(bookingId, status);
      toast.success('Status updated');
      await bookingsQ.refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Status update failed'));
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Bookings</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Orders & assignments</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Customers create requests, admins assign drivers, and drivers progress deliveries — all with strict access rules.
          </p>
        </div>
        {user.type === 'user' ? (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-md">New booking</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Create booking</DialogTitle>
                  <DialogDescription>Choose a service, schedule, and delivery location.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Service</Label>
                    <Select value={form.service_id} onValueChange={(v) => setForm((f) => ({ ...f, service_id: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s: Service) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.name} — SAR {s.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        required
                        value={form.booking_date}
                        onChange={(e) => setForm((f) => ({ ...f, booking_date: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Time</Label>
                      <Input
                        type="datetime-local"
                        required
                        value={form.scheduled_time}
                        onChange={(e) => setForm((f) => ({ ...f, scheduled_time: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Delivery address</Label>
                    <Textarea
                      required
                      value={form.delivery_address}
                      onChange={(e) => setForm((f) => ({ ...f, delivery_address: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min={1}
                        value={form.quantity}
                        onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Payment</Label>
                      <Select
                        value={form.payment_method}
                        onValueChange={(v) =>
                          setForm((f) => ({ ...f, payment_method: v as 'cash_on_delivery' | 'online' }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash_on_delivery">Cash on delivery</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Notes (optional)</Label>
                    <Textarea
                      value={form.special_requests}
                      onChange={(e) => setForm((f) => ({ ...f, special_requests: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={servicesQ.loading}>
                    Submit booking
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <Card className="border-border/80 shadow-md">
        <CardHeader>
          <CardTitle>All bookings</CardTitle>
          <CardDescription>Live data from GET /bookings (scoped by role).</CardDescription>
        </CardHeader>
        <CardContent>
          {bookingsQ.loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="min-w-full divide-y divide-border text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Booking</th>
                    <th className="px-4 py-3 font-medium">Schedule</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Driver</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {(bookingsQ.data ?? []).map((booking: Booking) => (
                    <tr key={booking.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium">#{booking.id}</p>
                        <p className="text-xs text-muted-foreground">{booking.service?.name ?? 'Service'}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(booking.booking_date).toLocaleDateString()}
                        <br />
                        <span className="text-xs">{new Date(booking.scheduled_time).toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="capitalize">
                          {statusLabels[booking.status] ?? booking.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">SAR {booking.total_amount}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {booking.driver
                          ? `${booking.driver.user?.first_name ?? ''} ${booking.driver.user?.last_name ?? ''}`.trim() ||
                            `Driver #${booking.driver.id}`
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          {user.type === 'admin' && !booking.driver_id ? (
                            <Button size="sm" variant="secondary" onClick={() => setAssignFor(booking)}>
                              Assign
                            </Button>
                          ) : null}
                          {user.type === 'driver' && booking.driver_id ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={booking.status === 'in_progress'}
                                onClick={() => handleStatus(booking.id, 'in_progress')}
                              >
                                En route
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleStatus(booking.id, 'completed')}
                                disabled={booking.status === 'completed'}
                              >
                                Delivered
                              </Button>
                            </>
                          ) : null}
                          {user.type === 'user' && booking.status === 'pending' ? (
                            <Button size="sm" variant="ghost" onClick={() => handleStatus(booking.id, 'cancelled')}>
                              Cancel
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(bookingsQ.data ?? []).length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">No bookings yet.</p>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(assignFor)} onOpenChange={(o) => !o && setAssignFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign driver</DialogTitle>
            <DialogDescription>Booking #{assignFor?.id}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label>Driver</Label>
            <Select value={assignDriverId} onValueChange={setAssignDriverId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose driver" />
              </SelectTrigger>
              <SelectContent>
                {(driversQ.data ?? []).map((d: Driver) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {(d.user?.first_name ?? d.first_name) + ' ' + (d.user?.last_name ?? d.last_name)} · #{d.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignFor(null)}>
              Close
            </Button>
            <Button onClick={handleAssign} disabled={!assignDriverId}>
              Save assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
