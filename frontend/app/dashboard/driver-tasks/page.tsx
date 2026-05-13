"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDriverTasks, updateBookingStatus } from '@/lib/api';
import { useAuth } from '@/components/providers';

const statusLabels: Record<string, string> = {
  assigned: 'Assigned',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const taskStatusLabels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const DriverTasksPage = () => {
  const { user, ready } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready || !user) return;
    const fetchTasks = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getDriverTasks();
        setTasks(data);
      } catch (err) {
        setError('Unable to load driver tasks.');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [ready, user]);

  const handleStatusUpdate = async (taskId: number, status: string) => {
    try {
      await updateBookingStatus(taskId, status);
      setTasks((current) =>
        current.map((item) => (item.id === taskId ? { ...item, status } : item)),
      );
    } catch {
      setError('Unable to update task status.');
    }
  };

  if (user?.type !== 'driver' && user?.type !== 'admin') {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">
          Access denied. This page is only available for drivers and administrators.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Driver Tasks</p>
        <h1 className="text-3xl font-semibold text-slate-950">Manage your assigned tasks</h1>
        <p className="max-w-2xl text-sm text-slate-600">
          View and update the status of your assigned delivery tasks, track progress, and manage cash on delivery payments.
        </p>
      </div>

      {error ? <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}

      <Card>
        <CardHeader>
          <CardTitle>Task Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading tasks…</p>
          ) : tasks.length === 0 ? (
            <p className="text-sm text-slate-600">No tasks assigned yet.</p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">Task #{task.id}</h3>
                        <Badge variant={task.status === 'completed' ? 'default' : task.status === 'in_progress' ? 'secondary' : 'outline'}>
                          {statusLabels[task.status] || task.status}
                        </Badge>
                      </div>

                      {task.booking && (
                        <div className="space-y-2 text-sm text-slate-600">
                          <p><strong>Booking:</strong> #{task.booking.id} - {task.booking.service?.name || 'Service'}</p>
                          <p><strong>Customer:</strong> {task.booking.user?.first_name} {task.booking.user?.last_name}</p>
                          <p><strong>Address:</strong> {task.booking.delivery_address}</p>
                          <p><strong>Amount:</strong> SAR {task.booking.total_amount}</p>
                          <p><strong>Payment Method:</strong> {task.booking.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'Online'}</p>
                          <p><strong>Booking Status:</strong> {taskStatusLabels[task.booking.status] || task.booking.status}</p>
                        </div>
                      )}

                      <div className="mt-4 text-xs text-slate-500">
                        <p>Assigned: {task.created_at ? new Date(task.created_at).toLocaleString() : 'N/A'}</p>
                        {task.updated_at && <p>Last Updated: {new Date(task.updated_at).toLocaleString()}</p>}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {task.status !== 'completed' && task.status !== 'cancelled' && (
                        <>
                          {task.status === 'assigned' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(task.id, 'in_progress')}
                            >
                              Start Task
                            </Button>
                          )}
                          {task.status === 'in_progress' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleStatusUpdate(task.id, 'completed')}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </>
                      )}
                      {task.booking?.payment_method === 'cash_on_delivery' && task.status === 'completed' && (
                        <Badge variant="destructive" className="text-xs">
                          Collect Cash: SAR {task.booking.total_amount}
                        </Badge>
                      )}
                    </div>
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

export default DriverTasksPage;