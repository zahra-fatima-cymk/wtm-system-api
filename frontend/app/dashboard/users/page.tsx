'use client';

import { getUsers } from '@/lib/api';
import { useAuth } from '@/components/providers';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useApiQuery } from '@/hooks/use-api-query';
import type { AuthUserProfile } from '@/lib/types';

export default function UsersAdminPage() {
  const { user, ready } = useAuth();
  const usersQ = useApiQuery(ready && user?.type === 'admin' ? 'admin-users' : null, () => getUsers(), {
    enabled: Boolean(ready && user?.type === 'admin'),
  });

  if (!user) return null;

  if (user.type !== 'admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Restricted</CardTitle>
          <CardDescription>Only administrators can browse the user directory.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Administration</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Users</h2>
        <p className="mt-1 text-sm text-muted-foreground">Full directory with roles and contact details (passwords excluded).</p>
      </div>

      <Card className="border-border/80 shadow-md">
        <CardHeader>
          <CardTitle>Directory</CardTitle>
          <CardDescription>GET /users</CardDescription>
        </CardHeader>
        <CardContent>
          {usersQ.loading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="min-w-full divide-y divide-border text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(usersQ.data ?? []).map((u: AuthUserProfile) => (
                    <tr key={u.id}>
                      <td className="px-4 py-3">#{u.id}</td>
                      <td className="px-4 py-3 font-medium">
                        {u.first_name} {u.last_name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.phone ?? '—'}</td>
                      <td className="px-4 py-3 capitalize">
                        <Badge variant="secondary">{u.type}</Badge>
                      </td>
                      <td className="px-4 py-3 capitalize">{u.status ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(usersQ.data ?? []).length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">No users returned.</p>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
