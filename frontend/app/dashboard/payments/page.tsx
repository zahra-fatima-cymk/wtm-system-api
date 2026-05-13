"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPayments } from '@/lib/api';
import { useAuth } from '@/components/providers';

const PaymentsPage = () => {
  const { ready } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    const fetchPayments = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getPayments();
        setPayments(data);
      } catch {
        setError('Unable to load payments.');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [ready]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Payments</p>
        <h1 className="text-3xl font-semibold text-slate-950">Billing and collection</h1>
        <p className="max-w-2xl text-sm text-slate-600">Track all payment records and view the current status for online and cash payments.</p>
      </div>

      {error ? <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div> : null}

      <Card>
        <CardHeader>
          <CardTitle>Payment history</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading payment history…</p>
          ) : payments.length === 0 ? (
            <p className="text-sm text-slate-600">No payment records are available yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Transaction</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-900">{payment.transaction_id}</td>
                      <td className="px-4 py-4">SAR {payment.amount}</td>
                      <td className="px-4 py-4">{payment.payment_method}</td>
                      <td className="px-4 py-4">{payment.payment_status}</td>
                      <td className="px-4 py-4">{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;
