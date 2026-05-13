'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { createService, deleteService, getServices, updateService } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-errors';
import { useAuth } from '@/components/providers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useApiQuery } from '@/hooks/use-api-query';
import type { Service } from '@/lib/types';

const SERVICE_TYPES = ['delivery', 'cleaning', 'maintenance', 'repair', 'emergency'] as const;

export default function ServicesAdminPage() {
  const { user, ready } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    service_type: 'delivery',
    price: '',
    estimated_duration: '60',
    is_active: true,
    is_emergency: false,
  });

  const servicesQ = useApiQuery(ready && user?.type === 'admin' ? 'admin-services' : null, () => getServices(), {
    enabled: Boolean(ready && user?.type === 'admin'),
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createService({
        name: form.name,
        description: form.description,
        service_type: form.service_type,
        price: Number(form.price),
        estimated_duration: Number(form.estimated_duration),
        is_active: form.is_active,
        is_emergency: form.is_emergency,
      });
      toast.success('Service created');
      setOpen(false);
      setForm({
        name: '',
        description: '',
        service_type: 'delivery',
        price: '',
        estimated_duration: '60',
        is_active: true,
        is_emergency: false,
      });
      await servicesQ.refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Create failed'));
    }
  };

  const toggleActive = async (s: Service) => {
    try {
      await updateService(s.id, { is_active: !s.is_active });
      toast.success('Updated');
      await servicesQ.refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Update failed'));
    }
  };

  const remove = async (s: Service) => {
    if (!confirm(`Delete service "${s.name}"?`)) return;
    try {
      await deleteService(s.id);
      toast.success('Deleted');
      await servicesQ.refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Delete failed'));
    }
  };

  if (!user) return null;

  if (user.type !== 'admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Restricted</CardTitle>
          <CardDescription>Service catalog management requires an admin account.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Administration</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Services</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create and maintain the offerings shown on the public site.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-md">Add service</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>New service</DialogTitle>
                <DialogDescription>Maps to POST /services</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Type</Label>
                    <Select value={form.service_type} onValueChange={(v) => setForm((f) => ({ ...f, service_type: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Price (SAR)</Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      required
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    min={1}
                    required
                    value={form.estimated_duration}
                    onChange={(e) => setForm((f) => ({ ...f, estimated_duration: e.target.value }))}
                  />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2">
                  <Label htmlFor="active">Active</Label>
                  <Switch id="active" checked={form.is_active} onCheckedChange={(c) => setForm((f) => ({ ...f, is_active: c }))} />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2">
                  <Label htmlFor="emergency">Emergency</Label>
                  <Switch
                    id="emergency"
                    checked={form.is_emergency}
                    onCheckedChange={(c) => setForm((f) => ({ ...f, is_emergency: c }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/80 shadow-md">
        <CardHeader>
          <CardTitle>Catalog</CardTitle>
          <CardDescription>Public landing page reads the same dataset.</CardDescription>
        </CardHeader>
        <CardContent>
          {servicesQ.loading ? (
            <Skeleton className="h-56 w-full rounded-xl" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {(servicesQ.data ?? []).map((s: Service) => (
                <div
                  key={s.id}
                  className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold">{s.name}</h3>
                      <Badge variant={s.is_active ? 'default' : 'secondary'}>{s.is_active ? 'Active' : 'Hidden'}</Badge>
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{s.description}</p>
                    <p className="mt-3 text-sm font-medium">
                      SAR {s.price} · {s.estimated_duration ?? '—'} min
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => toggleActive(s)}>
                      Toggle active
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(s)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {(servicesQ.data ?? []).length === 0 && !servicesQ.loading ? (
            <p className="text-sm text-muted-foreground">No services yet.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
