'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BellIcon,
  CalendarIcon,
  CreditCardIcon,
  DropletsIcon,
  FileTextIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  StarIcon,
  TruckIcon,
  UserCogIcon,
  UsersIcon,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { WtmNavUser } from '@/components/wtm-nav-user';
import type { AuthUser } from '@/lib/auth';
import type { UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
};

const navItems: NavItem[] = [
  { title: 'Overview', href: '/dashboard', icon: LayoutDashboardIcon, roles: ['user', 'driver', 'admin'] },
  { title: 'Bookings', href: '/dashboard/bookings', icon: CalendarIcon, roles: ['user', 'driver', 'admin'] },
  { title: 'Tracking', href: '/dashboard/tracking', icon: MapPinIcon, roles: ['user', 'driver', 'admin'] },
  { title: 'Payments', href: '/dashboard/payments', icon: CreditCardIcon, roles: ['user', 'admin'] },
  { title: 'Invoices', href: '/dashboard/invoices', icon: FileTextIcon, roles: ['user', 'admin'] },
  { title: 'History', href: '/dashboard/history', icon: HistoryIcon, roles: ['user', 'driver', 'admin'] },
  { title: 'Notifications', href: '/dashboard/notifications', icon: BellIcon, roles: ['user', 'driver', 'admin'] },
  { title: 'Driver tasks', href: '/dashboard/driver-tasks', icon: TruckIcon, roles: ['driver', 'admin'] },
  { title: 'Ratings', href: '/dashboard/ratings', icon: StarIcon, roles: ['user', 'driver', 'admin'] },
  { title: 'Users', href: '/dashboard/users', icon: UsersIcon, roles: ['admin'] },
  { title: 'Drivers', href: '/dashboard/drivers', icon: UserCogIcon, roles: ['admin'] },
  { title: 'Services', href: '/dashboard/services', icon: DropletsIcon, roles: ['admin'] },
];

export function WtmSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user: AuthUser }) {
  const pathname = usePathname();
  const items = navItems.filter((item) => item.roles.includes(user.type));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border" {...props}>
      <SidebarHeader className="gap-3 p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl border border-sidebar-border/80 bg-sidebar-accent/40 px-3 py-2 shadow-sm transition hover:bg-sidebar-accent/60"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
            <DropletsIcon className="size-5" />
          </span>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight">WTM Platform</span>
            <span className="text-xs text-muted-foreground">Water operations</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link href={item.href} className={cn(active && 'font-medium')}>
                        <Icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <WtmNavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
