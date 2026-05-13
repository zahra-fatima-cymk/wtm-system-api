"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getNotifications, markNotificationRead } from '@/lib/api';
import { useAuth } from '@/components/providers';

const NotificationsPage = () => {
  const { ready } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    const loadNotifications = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch {
        setError('Unable to load notifications.');
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, [ready]);

  const handleRead = async (id: number) => {
    try {
      await markNotificationRead(id);
      setNotifications((items) => items.map((item) => (item.id === id ? { ...item, is_read: true, read_at: new Date().toISOString() } : item)));
    } catch {
      setError('Unable to update notification status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Notifications</p>
        <h1 className="text-3xl font-semibold text-slate-950">Your system alerts</h1>
        <p className="max-w-2xl text-sm text-slate-600">Read and manage task, booking, and payment notifications in one place.</p>
      </div>

      {error ? <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}

      <Card>
        <CardHeader>
          <CardTitle>System alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading notifications…</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-slate-600">No notifications available yet.</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((notice) => (
                <div key={notice.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{notice.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{notice.message}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${notice.is_read ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}>
                      {notice.is_read ? 'Read' : 'New'}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span>{notice.type}</span>
                    <span>{notice.booking_id ? `Booking #${notice.booking_id}` : 'General'}</span>
                    <span>{notice.created_at ? new Date(notice.created_at).toLocaleString() : ''}</span>
                  </div>
                  {!notice.is_read ? (
                    <Button variant="secondary" size="sm" className="mt-4" onClick={() => handleRead(notice.id)}>
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
};

export default NotificationsPage;
