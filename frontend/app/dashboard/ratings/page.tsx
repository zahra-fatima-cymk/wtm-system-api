"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { getUserRatings, getDriverRatings, getAllRatings, submitRating } from '@/lib/api';
import { useAuth } from '@/components/providers';

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

const RatingsPage = () => {
  const { user, ready } = useAuth();
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [ratingForm, setRatingForm] = useState({
    rating_score: 5,
    review_text: '',
  });

  useEffect(() => {
    if (!ready || !user) return;
    const fetchRatings = async () => {
      setLoading(true);
      setError('');
      try {
        let data: any[] = [];
        if (user.type === 'admin') {
          data = await getAllRatings();
        } else if (user.type === 'driver') {
          data = await getDriverRatings();
        } else {
          data = await getUserRatings();
        }
        setRatings(data);
      } catch (err) {
        setError('Unable to load ratings.');
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, [ready, user]);

  const handleSubmitRating = async () => {
    if (!selectedBooking) return;

    try {
      await submitRating({
        booking_id: selectedBooking.id,
        driver_id: selectedBooking.driver_id,
        rating_score: ratingForm.rating_score,
        review_text: ratingForm.review_text,
      });

      // Refresh ratings
      const updatedRatings = await getUserRatings();
      setRatings(updatedRatings);

      setShowSubmitDialog(false);
      setSelectedBooking(null);
      setRatingForm({ rating_score: 5, review_text: '' });
    } catch {
      setError('Unable to submit rating.');
    }
  };

  const openRatingDialog = (booking: any) => {
    setSelectedBooking(booking);
    setShowSubmitDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Ratings & Reviews</p>
        <h1 className="text-3xl font-semibold text-slate-950">
          {user?.type === 'driver' ? 'Your Performance Ratings' : 'Service Ratings'}
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          {user?.type === 'driver'
            ? 'View ratings and feedback from customers about your service performance.'
            : 'Rate your service experience and view your submitted ratings.'
          }
        </p>
      </div>

      {error ? <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}

      {/* Submit Rating Dialog for Users */}
      {user?.type === 'user' && (
        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rate Your Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatingForm(prev => ({ ...prev, rating_score: star }))}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${star <= ratingForm.rating_score ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="review">Review (Optional)</Label>
                <Textarea
                  id="review"
                  placeholder="Share your experience..."
                  value={ratingForm.review_text}
                  onChange={(e) => setRatingForm(prev => ({ ...prev, review_text: e.target.value }))}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitRating}>
                  Submit Rating
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {user?.type === 'driver' ? 'Customer Reviews' : user?.type === 'admin' ? 'All Ratings' : 'Your Ratings'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading ratings…</p>
          ) : ratings.length === 0 ? (
            <p className="text-sm text-slate-600">
              {user?.type === 'driver' ? 'No ratings received yet.' : 'No ratings submitted yet.'}
            </p>
          ) : (
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div key={rating.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <RatingStars rating={rating.rating_score} />
                        <Badge variant="outline">{rating.rating_score}/5</Badge>
                      </div>

                      {rating.review_text && (
                        <p className="text-sm text-slate-600 mb-3">"{rating.review_text}"</p>
                      )}

                      <div className="text-xs text-slate-500 space-y-1">
                        {user?.type === 'admin' && (
                          <>
                            <p><strong>Customer:</strong> {rating.user?.first_name} {rating.user?.last_name}</p>
                            <p><strong>Driver:</strong> {rating.driver?.first_name} {rating.driver?.last_name}</p>
                          </>
                        )}
                        {user?.type === 'driver' && (
                          <p><strong>Customer:</strong> {rating.user?.first_name} {rating.user?.last_name}</p>
                        )}
                        {user?.type === 'user' && (
                          <p><strong>Driver:</strong> {rating.driver?.first_name} {rating.driver?.last_name}</p>
                        )}
                        <p><strong>Booking:</strong> #{rating.booking_id}</p>
                        <p><strong>Date:</strong> {new Date(rating.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Rate Service Button for Users */}
                    {user?.type === 'user' && rating.booking && !rating.review_text && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openRatingDialog(rating.booking)}
                      >
                        Rate Service
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RatingsPage;