'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  DropletsIcon,
  MapPinIcon,
  ShieldCheckIcon,
  TruckIcon,
} from 'lucide-react';
import { PublicSiteHeader } from '@/components/public-site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { getApiErrorMessage } from '@/lib/api-errors';
import { getServices } from '@/lib/api';
import type { Service } from '@/lib/types';
import { toast } from 'sonner';

export function LandingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getServices();
        if (!cancelled) setServices(data.filter((s) => s.is_active !== false));
      } catch (e) {
        if (!cancelled) toast.error(getApiErrorMessage(e, 'Unable to load services.'));
      } finally {
        if (!cancelled) setLoadingServices(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success('Thanks — our team will reach out shortly.', {
      description: 'This demo form does not send email; wire it to your API when ready.',
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <PublicSiteHeader />

      <main>
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-24">
            <div className="relative z-10 flex flex-col justify-center gap-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Water tank management</p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                Reliable deliveries, transparent billing, and live order tracking.
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                WTM connects customers, drivers, and administrators on one professional platform — from booking to cash on
                delivery, ratings, and invoicing.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2 shadow-lg">
                  <Link href="/register">
                    Create account <ArrowRightIcon className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: TruckIcon, label: 'Driver workflows', text: 'Tasks, COD, and status updates' },
                  { icon: ShieldCheckIcon, label: 'Role-based access', text: 'Your data stays private' },
                  { icon: MapPinIcon, label: 'Order tracking', text: 'Monitor every milestone' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex gap-3 rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur-sm"
                  >
                    <item.icon className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card className="relative z-10 border-border/80 shadow-xl shadow-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <DropletsIcon className="size-5 text-primary" />
                  Operations snapshot
                </CardTitle>
                <CardDescription>Material-style surface: elevated card, crisp grid, confident spacing.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {[
                  { k: 'Avg. fulfilment', v: 'Same day / scheduled' },
                  { k: 'Payments', v: 'Online & cash on delivery' },
                  { k: 'Visibility', v: 'Notifications & history' },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm"
                  >
                    <span className="text-muted-foreground">{row.k}</span>
                    <span className="font-medium">{row.v}</span>
                  </div>
                ))}
                <div className="rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">
                  Dashboard experience is tuned for dark & light themes with shadcn primitives.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="services" className="border-b border-border/60 bg-muted/20 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight">Services</h2>
              <p className="mt-2 text-muted-foreground">
                Browse what your operations team can offer — pricing comes live from the WTM API.
              </p>
            </div>
            {loadingServices ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-2xl" />
                ))}
              </div>
            ) : services.length === 0 ? (
              <p className="text-sm text-muted-foreground">No services published yet. Add them from the admin dashboard.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <Card key={service.id} className="border-border/80 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription className="line-clamp-3">{service.description ?? 'Professional water service.'}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between text-sm">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {service.service_type?.replace('_', ' ') ?? 'Service'}
                      </span>
                      <span className="text-lg font-semibold">SAR {service.price}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="about" className="py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Built for real field teams</h2>
              <p className="mt-3 text-muted-foreground">
                Administrators orchestrate the network, drivers execute with clear task states, and customers follow every step
                — without seeing anyone else&apos;s private information.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'JWT sessions with nine-hour validity for steady work shifts',
                  'Dedicated panels for bookings, payments, invoices, and ratings',
                  'Notification center to keep every role aligned',
                ].map((line) => (
                  <li key={line} className="flex gap-2 text-sm">
                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="border-border/80 shadow-lg">
              <CardHeader>
                <CardTitle>Roles</CardTitle>
                <CardDescription>One platform, three experiences.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {[
                  { title: 'Customer', body: 'Book, pay, track, and rate completed work.' },
                  { title: 'Driver', body: 'Manage assignments, statuses, and cash on delivery.' },
                  { title: 'Admin', body: 'Full control of users, drivers, services, and verification.' },
                ].map((role) => (
                  <div key={role.title} className="rounded-xl border border-border/60 bg-muted/30 p-4">
                    <p className="font-semibold">{role.title}</p>
                    <p className="text-sm text-muted-foreground">{role.body}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="contact" className="border-t border-border/60 bg-muted/15 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">Contact us</h2>
                <p className="mt-2 text-muted-foreground">
                  Tell us about your fleet size, service area, or integration needs — we&apos;ll route it to your operations
                  inbox once connected.
                </p>
              </div>
              <Card className="border-border/80 shadow-md">
                <CardContent className="pt-6">
                  <form className="grid gap-4" onSubmit={handleContact}>
                    <div className="grid gap-2">
                      <Label htmlFor="contact-name">Name</Label>
                      <Input id="contact-name" name="name" required placeholder="Your name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contact-email">Email</Label>
                      <Input id="contact-email" name="email" type="email" required placeholder="you@company.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contact-message">Message</Label>
                      <Textarea id="contact-message" name="message" required placeholder="How can we help?" rows={4} />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto">
                      Send message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} WTM — Water Tank Management</p>
      </footer>
    </div>
  );
}
