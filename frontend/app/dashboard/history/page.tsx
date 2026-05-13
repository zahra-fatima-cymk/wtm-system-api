'use client';

import {
  getAdminHistory,
  getAdminInvoices,
  getDriverHistory,
  getMyInvoices,
  getUserHistory,
} from '@/lib/api';
import { useAuth } from '@/components/providers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApiQuery } from '@/hooks/use-api-query';
import type { HistoryRecord, Invoice } from '@/lib/types';

export default function HistoryPage() {
  const { user, ready } = useAuth();

  const userHistQ = useApiQuery(
    ready && user && user.type === 'user' ? 'hist-user' : null,
    () => getUserHistory(),
    { enabled: Boolean(ready && user?.type === 'user') },
  );

  const driverHistQ = useApiQuery(
    ready && user && user.type === 'driver' ? 'hist-driver' : null,
    () => getDriverHistory(),
    { enabled: Boolean(ready && user?.type === 'driver') },
  );

  const adminHistQ = useApiQuery(
    ready && user && user.type === 'admin' ? 'hist-admin' : null,
    () => getAdminHistory(),
    { enabled: Boolean(ready && user?.type === 'admin') },
  );

  const invoicesUserQ = useApiQuery(ready && user?.type === 'user' ? 'inv-user' : null, () => getMyInvoices(), {
    enabled: Boolean(ready && user?.type === 'user'),
  });

  const invoicesAdminQ = useApiQuery(ready && user?.type === 'admin' ? 'inv-admin' : null, () => getAdminInvoices(), {
    enabled: Boolean(ready && user?.type === 'admin'),
  });

  if (!user) return null;

  const loading =
    (user.type === 'user' && userHistQ.loading) ||
    (user.type === 'driver' && driverHistQ.loading) ||
    (user.type === 'admin' && adminHistQ.loading) ||
    (user.type === 'user' && invoicesUserQ.loading) ||
    (user.type === 'admin' && invoicesAdminQ.loading);

  const invoiceRows: Invoice[] =
    user.type === 'admin' ? (invoicesAdminQ.data ?? []) : (invoicesUserQ.data ?? []);

  const activity: HistoryRecord[] =
    user.type === 'user'
      ? (userHistQ.data ?? [])
      : user.type === 'driver'
        ? (driverHistQ.data ?? [])
        : (adminHistQ.data ?? []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">History</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Audit & invoices</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Every role sees only their own timeline; administrators can open the global event stream.
        </p>
      </div>

      {user.type === 'user' || user.type === 'admin' ? (
        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
          <TabsContent value="activity">
            <Card className="border-border/80 shadow-md">
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>Structured actions with booking references when available.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-48 rounded-xl" />
                ) : activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No history entries yet.</p>
                ) : (
                  <div className="space-y-3">
                    {activity.map((record) => (
                      <div
                        key={record.id}
                        className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm shadow-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-semibold">{record.action_type}</span>
                          <span className="text-xs text-muted-foreground">
                            {record.created_at ? new Date(record.created_at).toLocaleString() : ''}
                          </span>
                        </div>
                        <p className="mt-1 text-muted-foreground">{record.description}</p>
                        {record.booking_id ? (
                          <p className="mt-2 text-xs text-muted-foreground">Booking #{record.booking_id}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="invoices">
            <Card className="border-border/80 shadow-md">
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Issued documents linked to your bookings.</CardDescription>
              </CardHeader>
              <CardContent>
                {(user.type === 'user' ? invoicesUserQ.loading : invoicesAdminQ.loading) ? (
                  <Skeleton className="h-40 rounded-xl" />
                ) : invoiceRows.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No invoices on file.</p>
                ) : (
                  <div className="space-y-3">
                    {invoiceRows.map((inv: Invoice) => (
                      <div
                        key={inv.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 px-4 py-3"
                      >
                        <div>
                          <p className="font-medium">{inv.invoice_number ?? `Invoice #${inv.id}`}</p>
                          <p className="text-xs text-muted-foreground capitalize">Status: {inv.status}</p>
                        </div>
                        <p className="text-lg font-semibold">PKR {inv.total_amount}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="border-border/80 shadow-md">
          <CardHeader>
            <CardTitle>Driver history</CardTitle>
            <CardDescription>Entries associated with your driver profile.</CardDescription>
          </CardHeader>
          <CardContent>
            {driverHistQ.loading ? (
              <Skeleton className="h-48 rounded-xl" />
            ) : activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No driver-scoped history yet.</p>
            ) : (
              <div className="space-y-3">
                {activity.map((record) => (
                  <div key={record.id} className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm">
                    <p className="font-semibold">{record.action_type}</p>
                    <p className="text-muted-foreground">{record.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {record.created_at ? new Date(record.created_at).toLocaleString() : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
