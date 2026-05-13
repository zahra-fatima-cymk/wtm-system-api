'use client';

import { getDrivers } from '@/lib/api';
import { useAuth } from '@/components/providers';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useApiQuery } from '@/hooks/use-api-query';
import type { Driver } from '@/lib/types';

export default function DriversAdminPage() {
  const { user, ready } = useAuth();
  const driversQ = useApiQuery(ready && user?.type === 'admin' ? 'admin-drivers' : null, () => getDrivers(), {
    enabled: Boolean(ready && user?.type === 'admin'),
  });

  if (!user) return null;

  if (user.type !== 'admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Restricted</CardTitle>
          <CardDescription>Driver roster is visible to admins only.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Administration</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Drivers</h2>
        <p className="mt-1 text-sm text-muted-foreground">Fleet profiles with verification and performance signals.</p>
      </div>

      <Card className="border-border/80 shadow-md">
        <CardHeader>
          <CardTitle>Roster</CardTitle>
          <CardDescription>GET /drivers</CardDescription>
        </CardHeader>
        <CardContent>
          {driversQ.loading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="min-w-full divide-y divide-border text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Driver</th>
                    <th className="px-4 py-3 font-medium">Vehicle</th>
                    <th className="px-4 py-3 font-medium">Plate</th>
                    <th className="px-4 py-3 font-medium">Rating</th>
                    <th className="px-4 py-3 font-medium">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(driversQ.data ?? []).map((d: Driver) => (
                    <tr key={d.id}>
                      <td className="px-4 py-3">#{d.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium">
                          {d.user ? `${d.user.first_name} ${d.user.last_name}` : `User #${d.user_id}`}
                        </p>
                        <p className="text-xs text-muted-foreground">{d.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{d.vehicle_type}</td>
                      <td className="px-4 py-3 font-mono text-xs">{d.vehicle_plate}</td>
                      <td className="px-4 py-3">{d.rating ?? '—'}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="capitalize">
                          {d.verification_status ?? '—'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(driversQ.data ?? []).length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">No drivers found.</p>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
