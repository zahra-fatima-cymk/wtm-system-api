'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { ThemeToggle } from '@/components/theme-toggle';
import { WtmSidebar } from '@/components/wtm-sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/components/providers';
import { cn } from '@/lib/utils';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/bookings': 'Bookings',
  '/dashboard/tracking': 'Live tracking',
  '/dashboard/payments': 'Payments',
  '/dashboard/invoices': 'Invoices',
  '/dashboard/history': 'History',
  '/dashboard/notifications': 'Notifications',
  '/dashboard/driver-tasks': 'Driver tasks',
  '/dashboard/ratings': 'Ratings',
  '/dashboard/users': 'Users',
  '/dashboard/drivers': 'Drivers',
  '/dashboard/services': 'Services',
};

function resolveTitle(pathname: string) {
  if (routeTitles[pathname]) return routeTitles[pathname];
  const match = Object.keys(routeTitles)
    .filter((k) => k !== '/dashboard')
    .find((k) => pathname.startsWith(k));
  return match ? routeTitles[match] : 'Dashboard';
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const title = resolveTitle(pathname);

  return (
    <AuthGuard>
      {user ? (
        <SidebarProvider>
          <WtmSidebar user={user} />
          <SidebarInset
            className={cn(
              'min-h-screen bg-gradient-to-b from-muted/40 via-background to-background',
              'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
            )}
          >
            <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-6" />
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">WTM</p>
                <h1 className="text-base font-semibold leading-none tracking-tight md:text-lg">{title}</h1>
              </div>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/">View site</Link>
              </Button>
              <ThemeToggle />
            </header>
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
              <div className="mx-auto w-full max-w-6xl flex-1">{children}</div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      ) : null}
    </AuthGuard>
  );
}
