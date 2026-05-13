'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { getAllRatings, getBookings, getDriverRatings, getUserRatings, submitRating } from '@/lib/api';
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useApiQuery } from '@/hooks/use-api-query';
import type { Booking, RatingReview } from '@/lib/types';
import { StarIcon } from 'lucide-react';

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon key={s} className={`size-4 ${s <= value ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40'}`} />
      ))}
    </div>
  );
}

export default function RatingsPage() {
  const { user, ready } = useAuth();
  const [open, setOpen] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [score, setScore] = useState(5);
  const [review, setReview] = useState('');

  const ratingsQ = useApiQuery(
    ready && user ? `ratings-${user.type}-${user.id}` : null,
    async () => {
      if (user?.type === 'admin') return getAllRatings();
      if (user?.type === 'driver') return getDriverRatings();
      return getUserRatings();
    },
    { enabled: Boolean(ready && user) },
  );

  const bookingsQ = useApiQuery(ready && user?.type === 'user' ? 'ratings-bookings' : null, () => getBookings(), {
    enabled: Boolean(ready && user?.type === 'user'),
  });

  const ratedBookingIds = useMemo(() => new Set((ratingsQ.data ?? []).map((r: RatingReview) => r.booking_id)), [ratingsQ.data]);

  const rateable = useMemo(() => {
    return (bookingsQ.data ?? []).filter(
      (b: Booking) =>
        b.status === 'completed' &&
        b.driver_id &&
        !ratedBookingIds.has(b.id),
    );
  }, [bookingsQ.data, ratedBookingIds]);

  const handleSubmit = async () => {
    const booking = (bookingsQ.data ?? []).find((b: Booking) => String(b.id) === bookingId);
    if (!booking?.driver_id) {
      toast.error('Select a completed booking with a driver');
      return;
    }
    try {
      await submitRating({
        booking_id: booking.id,
        driver_id: booking.driver_id,
        rating_score: score,
        review_text: review || undefined,
      });
      toast.success('Thanks for your feedback');
      setOpen(false);
      setBookingId('');
      setReview('');
      await ratingsQ.refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not submit rating'));
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Ratings</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            {user.type === 'driver' ? 'Your customer feedback' : user.type === 'admin' ? 'Quality oversight' : 'Your reviews'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Drivers see incoming scores, customers submit after delivery, admins audit the entire feed.
          </p>
        </div>
        {user.type === 'user' ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-md" disabled={rateable.length === 0}>
                Rate a delivery
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit a rating</DialogTitle>
                <DialogDescription>Only completed bookings with an assigned driver are listed.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label>Booking</Label>
                  <Select value={bookingId} onValueChange={setBookingId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose booking" />
                    </SelectTrigger>
                    <SelectContent>
                      {rateable.map((b: Booking) => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          #{b.id} · {b.service?.name ?? 'Service'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Score</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="rounded-md border border-border p-2 transition hover:bg-muted"
                        onClick={() => setScore(s)}
                      >
                        <StarIcon className={`size-6 ${s <= score ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Comments</Label>
                  <Textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Optional feedback" rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSubmit} disabled={!bookingId}>
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <Card className="border-border/80 shadow-md">
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>Live dataset from /ratings scoped to your permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          {ratingsQ.loading ? (
            <Skeleton className="h-48 rounded-xl" />
          ) : (ratingsQ.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No ratings to show yet.</p>
          ) : (
            <div className="space-y-4">
              {(ratingsQ.data ?? []).map((rating: RatingReview) => (
                <div key={rating.id} className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <Stars value={rating.rating_score} />
                    <Badge variant="outline">{rating.rating_score}/5</Badge>
                  </div>
                  {rating.review_text ? <p className="mt-3 text-sm text-muted-foreground">&ldquo;{rating.review_text}&rdquo;</p> : null}
                  <div className="mt-4 grid gap-1 text-xs text-muted-foreground">
                    {user.type === 'admin' ? (
                      <>
                        <p>
                          Customer: {rating.user ? `${rating.user.first_name} ${rating.user.last_name}` : `#${rating.user_id}`}
                        </p>
                        <p>
                          Driver:{' '}
                          {rating.driver
                            ? `${(rating.driver as { first_name?: string }).first_name ?? ''} ${(rating.driver as { last_name?: string }).last_name ?? ''}`.trim() ||
                              `#${rating.driver_id}`
                            : `#${rating.driver_id}`}
                        </p>
                      </>
                    ) : null}
                    {user.type === 'driver' ? (
                      <p>
                        Customer: {rating.user ? `${rating.user.first_name} ${rating.user.last_name}` : 'Customer'}
                      </p>
                    ) : null}
                    <p>Booking #{rating.booking_id}</p>
                    <p>{rating.created_at ? new Date(rating.created_at).toLocaleDateString() : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
