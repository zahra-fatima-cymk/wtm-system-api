'use client';

import { toast } from 'sonner';
import { getAllDriverTasks, getDriverTasks, updateBookingStatus, updateDriverTask } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-errors';
import { useAuth } from '@/components/providers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useApiQuery } from '@/hooks/use-api-query';
import type { DriverTask } from '@/lib/types';

const taskStatusLabels: Record<string, string> = {
  assigned: 'Assigned',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function DriverTasksPage() {
  const { user, ready } = useAuth();

  const tasksQ = useApiQuery(
    ready && user && (user.type === 'driver' || user.type === 'admin') ? `driver-tasks-${user.type}` : null,
    async () => {
      if (user?.type === 'admin') return getAllDriverTasks();
      return getDriverTasks();
    },
    { enabled: Boolean(ready && user && (user.type === 'driver' || user.type === 'admin')) },
  );

  const syncBooking = async (bookingId: number | undefined, status: string) => {
    if (!bookingId) return;
    try {
      await updateBookingStatus(bookingId, status);
    } catch {
      /* booking status is best-effort alongside task */
    }
  };

  const handleTaskTransition = async (task: DriverTask, next: 'in_progress' | 'completed') => {
    try {
      const now = new Date().toISOString();
      if (next === 'in_progress') {
        await updateDriverTask(task.id, { status: 'in_progress', started_at: now });
        await syncBooking(task.booking_id, 'in_progress');
      } else {
        await updateDriverTask(task.id, { status: 'completed', completed_at: now });
        await syncBooking(task.booking_id, 'completed');
      }
      toast.success('Task updated');
      await tasksQ.refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Unable to update task'));
    }
  };

  if (!user) return null;

  if (user.type !== 'driver' && user.type !== 'admin') {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle>Access restricted</CardTitle>
          <CardDescription>Driver tasks are visible to drivers and administrators only.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Driver tasks</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Field execution</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Move tasks through assigned → in progress → completed. Cash on delivery totals appear when a job is finished.
        </p>
      </div>

      <Card className="border-border/80 shadow-md">
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
          <CardDescription>Data from /driver-tasks/me or /driver-tasks (admin).</CardDescription>
        </CardHeader>
        <CardContent>
          {tasksQ.loading ? (
            <div className="space-y-3">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
          ) : (tasksQ.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks assigned yet.</p>
          ) : (
            <div className="space-y-4">
              {(tasksQ.data ?? []).map((task) => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">Task #{task.id}</h3>
                        <Badge variant="outline" className="capitalize">
                          {taskStatusLabels[task.status] ?? task.status}
                        </Badge>
                      </div>
                      {task.booking ? (
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>
                            <span className="font-medium text-foreground">Booking #{task.booking.id}</span> ·{' '}
                            {task.booking.service?.name ?? 'Service'}
                          </p>
                          <p>
                            Customer:{' '}
                            {task.booking.user
                              ? `${task.booking.user.first_name} ${task.booking.user.last_name}`
                              : '—'}
                          </p>
                          <p>Address: {task.booking.delivery_address}</p>
                          <p>Amount: PKR {task.booking.total_amount}</p>
                          <p className="capitalize">
                            Payment: {task.booking.payment_method?.replace('_', ' ') ?? '—'}
                          </p>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2 md:items-end">
                      {task.status === 'assigned' ? (
                        <Button size="sm" variant="secondary" onClick={() => handleTaskTransition(task, 'in_progress')}>
                          Start task
                        </Button>
                      ) : null}
                      {task.status === 'in_progress' ? (
                        <Button size="sm" onClick={() => handleTaskTransition(task, 'completed')}>
                          Mark complete
                        </Button>
                      ) : null}
                      {task.booking?.payment_method === 'cash_on_delivery' && task.status === 'completed' ? (
                        <Badge variant="destructive" className="w-fit">
                          Collect COD: PKR {task.booking.total_amount}
                        </Badge>
                      ) : null}
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
}
