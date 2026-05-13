"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getHistory, getInvoices } from '@/lib/api';
import { useAuth } from '@/components/providers';

const HistoryPage = () => {
  const { user, ready } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        if (user?.type === 'admin') {
          const invoices = await getInvoices();
          setHistory(invoices);
        } else {
          const userHistory = await getHistory();
          setHistory(userHistory);
        }
      } catch {
        setError('Unable to load history.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [ready, user]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-500">History</p>
        <h1 className="text-3xl font-semibold text-slate-950">Track past orders and invoices</h1>
        <p className="max-w-2xl text-sm text-slate-600">Review your historical records, completed jobs, billing statements, and performance history.</p>
      </div>

      {error ? <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}

      <Card>
        <CardHeader>
          <CardTitle>{user?.type === 'admin' ? 'Invoices' : 'User history'}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading history…</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-slate-600">No history records found.</p>
          ) : (
            <div className="space-y-4">
              {history.map((record) => (
                <div key={record.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{record.title ?? `Record #${record.id}`}</p>
                      <p className="mt-1 text-sm text-slate-600">{record.description ?? record.status ?? 'Completed order history'}</p>
                    </div>
                    <span className="text-sm text-slate-500">{record.created_at ? new Date(record.created_at).toLocaleDateString() : ''}</span>
                  </div>
                  {record.amount ? <p className="mt-3 text-sm font-medium text-slate-700">Amount: SAR {record.amount}</p> : null}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryPage;
