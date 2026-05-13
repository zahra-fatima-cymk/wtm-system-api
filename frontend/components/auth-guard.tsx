'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers';
import { Skeleton } from '@/components/ui/skeleton';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) {
      router.replace('/login');
    }
  }, [ready, user, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col gap-4 bg-background p-8">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-[480px] w-full max-w-5xl rounded-2xl" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
