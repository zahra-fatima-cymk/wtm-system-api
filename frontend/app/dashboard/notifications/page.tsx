'use client';

import { toast } from 'sonner';
import { getNotifications, markNotificationRead } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-errors';
import { useAuth } from '@/components/providers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useApiQuery } from '@/hooks/use-api-query';

export default function NotificationsPage() {
  const { user, ready } = useAuth();
  const notifQ = useApiQuery(ready && user ? `notif-page-${user.id}` : null, () => getNotifications(), {
    enabled: Boolean(ready && user),
  });

  const handleRead = async (id: number) => {
    try {
      await markNotificationRead(id);
      toast.success('Marked as read');
      await notifQ.refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Update failed'));
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Notifications</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Alerts & messages</h2>
        <p className="mt-1 text-sm text-muted-foreground">Only notifications addressed to your account are returned.</p>
      </div>

      <Card className="border-border/80 shadow-md">
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Booking, payment, and system events surface here.</CardDescription>
        </CardHeader>
        <CardContent>
          {notifQ.loading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
          ) : (notifQ.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">You&apos;re all caught up.</p>
          ) : (
            <div className="space-y-3">
              {(notifQ.data ?? []).map((notice) => (
                <div
                  key={notice.id}
                  className="rounded-2xl border border-border/70 bg-muted/20 p-4 shadow-sm transition hover:bg-muted/35"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{notice.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{notice.message}</p>
                    </div>
                    <Badge variant={notice.is_read ? 'secondary' : 'default'}>{notice.is_read ? 'Read' : 'New'}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="capitalize">{notice.type}</span>
                    {notice.booking_id ? <span>Booking #{notice.booking_id}</span> : null}
                    <span>{notice.created_at ? new Date(notice.created_at).toLocaleString() : ''}</span>
                  </div>
                  {!notice.is_read ? (
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => handleRead(notice.id)}>
                      Mark as read
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
