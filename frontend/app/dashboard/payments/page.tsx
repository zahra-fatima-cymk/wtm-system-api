'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { createPayment, getBookings, getPayments, verifyPayment } from '@/lib/api';
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
import { useApiQuery } from '@/hooks/use-api-query';
import type { Booking, Payment } from '@/lib/types';

export default function PaymentsPage() {
  const { user, ready } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    booking_id: '',
    amount: '',
    payment_method: 'online' as 'online' | 'cash_on_delivery',
    transaction_id: '',
  });

  const paymentsQ = useApiQuery(
    ready && user && (user.type === 'user' || user.type === 'admin') ? `payments-${user.id}` : null,
    () => getPayments(),
    { enabled: Boolean(ready && user && (user.type === 'user' || user.type === 'admin')) },
  );

  const bookingsQ = useApiQuery(ready && user?.type === 'user' ? `pay-bookings` : null, () => getBookings(), {
    enabled: Boolean(ready && user?.type === 'user'),
  });

  const eligibleBookings = (bookingsQ.data ?? []).filter(
    (b: Booking) => b.payment_status === 'pending' && ['confirmed', 'in_progress', 'completed'].includes(b.status),
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPayment({
        booking_id: Number(form.booking_id),
        amount: Number(form.amount),
        payment_method: form.payment_method,
        transaction_id: form.transaction_id || undefined,
      });
      toast.success('Payment recorded');
      setOpen(false);
      setForm({ booking_id: '', amount: '', payment_method: 'online', transaction_id: '' });
      await paymentsQ.refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Payment failed'));
    }
  };

  const handleVerify = async (payment: Payment, status: 'completed' | 'failed') => {
    try {
      await verifyPayment(payment.id, status);
      toast.success(`Payment ${status}`);
      await paymentsQ.refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Verify failed'));
    }
  };

  if (!user) return null;

  if (user.type !== 'user' && user.type !== 'admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
          <CardDescription>This area is for customers and billing administrators.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Payments</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Online & cash on delivery</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Users log payments against bookings; administrators mark gateway or COD collections as verified.
          </p>
        </div>
        {user.type === 'user' ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-md">Record payment</Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Record a payment</DialogTitle>
                  <DialogDescription>Attach an amount to an active booking.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Booking</Label>
                    <Select value={form.booking_id} onValueChange={(v) => setForm((f) => ({ ...f, booking_id: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select booking" />
                      </SelectTrigger>
                      <SelectContent>
                        {eligibleBookings.map((b: Booking) => (
                          <SelectItem key={b.id} value={String(b.id)}>
                            #{b.id} · SAR {b.total_amount}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      required
                      value={form.amount}
                      onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Method</Label>
                    <Select
                      value={form.payment_method}
                      onValueChange={(v) => setForm((f) => ({ ...f, payment_method: v as 'online' | 'cash_on_delivery' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="cash_on_delivery">Cash on delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Reference / transaction id</Label>
                    <Input
                      value={form.transaction_id}
                      onChange={(e) => setForm((f) => ({ ...f, transaction_id: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Submit payment</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <Card className="border-border/80 shadow-md">
        <CardHeader>
          <CardTitle>Ledger</CardTitle>
          <CardDescription>Rows respect your role — only your bookings appear for customers.</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentsQ.loading ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="min-w-full divide-y divide-border text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Booking</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Method</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(paymentsQ.data ?? []).map((p: Payment) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3 font-medium">#{p.id}</td>
                      <td className="px-4 py-3 text-muted-foreground">#{p.booking_id}</td>
                      <td className="px-4 py-3">SAR {p.amount}</td>
                      <td className="px-4 py-3 capitalize">{p.payment_method?.replace('_', ' ')}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="capitalize">
                          {p.payment_status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {user.type === 'admin' && p.payment_status === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="secondary" onClick={() => handleVerify(p, 'completed')}>
                              Verify
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleVerify(p, 'failed')}>
                              Reject
                            </Button>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(paymentsQ.data ?? []).length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">No payment records.</p>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
