'use client';

import { getBookings } from '@/lib/api';
import { useAuth } from '@/components/providers';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useApiQuery } from '@/hooks/use-api-query';
import type { Booking } from '@/lib/types';
import { CheckCircle2Icon, CircleIcon } from 'lucide-react';

const steps = ['pending', 'confirmed', 'in_progress', 'completed'] as const;

function StepRow({ booking }: { booking: Booking }) {
  const idx = steps.indexOf(booking.status as (typeof steps)[number]);
  const activeIndex = idx === -1 ? 0 : idx;

  return (
    <div className="rounded-2xl border border-border/70 bg-card/90 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">
            Booking #{booking.id} · {booking.service?.name ?? 'Service'}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(booking.scheduled_time).toLocaleString()} · {booking.delivery_address}
          </p>
        </div>
        <Badge variant="outline" className="capitalize">
          {booking.status.replace('_', ' ')}
        </Badge>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {steps.map((step, i) => {
          const done = booking.status === 'cancelled' ? false : i <= activeIndex;
          const current = i === activeIndex && booking.status !== 'cancelled';
          return (
            <div key={step} className="flex items-center gap-2 text-xs sm:flex-col sm:items-start sm:text-sm">
              {done ? (
                <CheckCircle2Icon className="size-4 text-primary sm:mb-1" />
              ) : (
                <CircleIcon className="size-4 text-muted-foreground sm:mb-1" />
              )}
              <div>
                <p className={current ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
                  {step.replace('_', ' ')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {booking.status === 'cancelled' ? (
        <p className="mt-4 text-sm font-medium text-destructive">This booking was cancelled.</p>
      ) : null}
    </div>
  );
}

export default function TrackingPage() {
  const { user, ready } = useAuth();
  const bookingsQ = useApiQuery(ready && user ? `track-${user.id}` : null, () => getBookings(), {
    enabled: Boolean(ready && user),
  });

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Tracking</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Live progress</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Milestones are derived from booking status — your list is filtered server-side by role.
        </p>
      </div>

      <Card className="border-border/80 shadow-md">
        <CardHeader>
          <CardTitle>Active monitors</CardTitle>
          <CardDescription>Customers follow their orders; drivers see assigned routes only.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bookingsQ.loading ? (
            <>
              <Skeleton className="h-36 rounded-2xl" />
              <Skeleton className="h-36 rounded-2xl" />
            </>
          ) : (bookingsQ.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings to track.</p>
          ) : (
            (bookingsQ.data ?? []).map((b) => <StepRow key={b.id} booking={b} />)
          )}
        </CardContent>
      </Card>
    </div>
  );
}
