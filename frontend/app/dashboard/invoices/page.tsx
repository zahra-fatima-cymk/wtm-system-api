'use client';

import Link from 'next/link';
import { getAdminInvoices, getMyInvoices } from '@/lib/api';
import { useAuth } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useApiQuery } from '@/hooks/use-api-query';
import type { Invoice } from '@/lib/types';

export default function InvoicesPage() {
  const { user, ready } = useAuth();

  const mineQ = useApiQuery(ready && user?.type === 'user' ? 'inv-page-user' : null, () => getMyInvoices(), {
    enabled: Boolean(ready && user?.type === 'user'),
  });

  const allQ = useApiQuery(ready && user?.type === 'admin' ? 'inv-page-admin' : null, () => getAdminInvoices(), {
    enabled: Boolean(ready && user?.type === 'admin'),
  });

  if (!user) return null;

  if (user.type !== 'user' && user.type !== 'admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Switch to a customer or admin account to view billing documents.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/dashboard/history">Open history</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const loading = user.type === 'user' ? mineQ.loading : allQ.loading;
  const rows: Invoice[] = user.type === 'user' ? (mineQ.data ?? []) : (allQ.data ?? []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Invoices</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Billing documents</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {user.type === 'admin' ? 'Organization-wide invoice register.' : 'Invoices issued for your bookings.'}
        </p>
      </div>

      <Card className="border-border/80 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Register</CardTitle>
            <CardDescription>Statuses mirror the backend invoice lifecycle.</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/history">Combined history</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-56 w-full rounded-xl" />
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invoices found.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="min-w-full divide-y divide-border text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Invoice</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((inv) => (
                    <tr key={inv.id}>
                      <td className="px-4 py-3 font-medium">{inv.invoice_number ?? `#${inv.id}`}</td>
                      <td className="px-4 py-3 text-muted-foreground">#{inv.user_id}</td>
                      <td className="px-4 py-3 capitalize">{inv.status}</td>
                      <td className="px-4 py-3 text-right">PKR {inv.total_amount}</td>
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
}
