import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Truck, DollarSign, UserCheck, Wallet, PiggyBank, Receipt } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '@/config/config';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatToBDTime, cn } from '@/lib/utils';

function formatTk(value) {
  if (value === null || value === undefined || value === '') return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return `TK ${new Intl.NumberFormat('en-BD', { maximumFractionDigits: 2 }).format(n)}`;
}

function formatCount(value) {
  if (value === null || value === undefined || value === '') return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat('en-BD').format(n);
}

function StatCard({ title, value, subtitle, icon: Icon, glow, iconTint, ringTint }) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm',
        'transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-xl',
        glow,
      )}>
      <div
        className={cn(
          'pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-40 blur-3xl transition-opacity duration-300 group-hover:opacity-70',
          ringTint,
        )}
      />
      <div className='relative flex items-start justify-between gap-4'>
        <div className='space-y-3'>
          <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>{title}</p>
          <p className='text-3xl font-bold tracking-tight text-foreground tabular-nums'>{value}</p>
          {subtitle ? <p className='text-xs text-muted-foreground'>{subtitle}</p> : null}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-inner ring-2 ring-background',
            iconTint,
          )}>
          <Icon className='h-6 w-6' strokeWidth={2} />
        </div>
      </div>
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-foreground/10 to-transparent' />
    </div>
  );
}

export default function Dashboard() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['dashboard', fromDate, toDate],
    queryFn: async () => {
      const response = await API.get(`api/customers/dashboard`, {
        params: {
          start_date: fromDate,
          end_date: toDate,
        },
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });




  let filledCylinder = [
    { label: '5KG', value: data?.current_stock?.five_kg },
    { label: '12KG', value: data?.current_stock?.twelve_kg },
    { label: '25KG', value: data?.current_stock?.twentyfive_kg },
    { label: '33KG', value: data?.current_stock?.thirtythree_kg },
    { label: '35KG', value: data?.current_stock?.thirtyfive_kg },
    { label: '45KG', value: data?.current_stock?.fourtyfive_kg },
  ];
  let emptyCylinder = [
    { label: '5KG', value: data?.current_stock?.empty_five_kg },
    { label: '12KG', value: data?.current_stock?.empty_twelve_kg },
    { label: '25KG', value: data?.current_stock?.empty_twentyfive_kg },
    { label: '33KG', value: data?.current_stock?.empty_thirtythree_kg },
    { label: '35KG', value: data?.current_stock?.empty_thirtyfive_kg },
    { label: '45KG', value: data?.current_stock?.empty_fourtyfive_kg },
  ];
  return (
    <div className='flex-1 space-y-4 p-2'>
      <div className='flex flex-col gap-4 rounded-2xl border border-border/60 bg-muted/30 p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end'>
        <div className='flex min-w-0 flex-1 flex-col gap-1.5 sm:max-w-44'>
          <label className='text-xs font-medium text-muted-foreground' htmlFor='dash-from'>
            From
          </label>
          <Input
            id='dash-from'
            type='date'
            value={fromDate}
            className='bg-background'
            onChange={(e) => {
              setFromDate(e.target.value);
              if (!toDate) setToDate(e.target.value);
            }}
          />
        </div>
        <div className='hidden items-center pb-2 text-muted-foreground sm:flex' aria-hidden>
          →
        </div>
        <div className='flex min-w-0 flex-1 flex-col gap-1.5 sm:max-w-44'>
          <label className='text-xs font-medium text-muted-foreground' htmlFor='dash-to'>
            To
          </label>
          <Input
            id='dash-to'
            type='date'
            value={toDate}
            min={fromDate || undefined}
            className='bg-background'
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className='flex flex-wrap gap-2 sm:ml-auto'>
          <Button type='button' onClick={() => refetch()} disabled={isFetching} className='min-w-24'>
            {isFetching ? 'Loading…' : 'Apply'}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              setFromDate('');
              setToDate('');
              refetch();
            }}>
            Clear
          </Button>
        </div>
      </div>

      <div>
        <h2 className='mb-4 text-lg font-semibold tracking-tight'>Overview</h2>
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
          <StatCard
            title='Total customers'
            value={formatCount(data?.total_customer)}
            subtitle='Registered in the system'
            icon={Users}
            glow='bg-gradient-to-br from-violet-500/[0.12] via-transparent to-transparent'
            iconTint='bg-violet-500/15 text-violet-600 shadow-violet-500/10 dark:text-violet-400'
            ringTint='bg-violet-400'
          />
          <StatCard
            title='Total sales'
            value={formatTk(data?.total_sale)}
            subtitle='Sales amount in range'
            icon={DollarSign}
            glow='bg-gradient-to-br from-emerald-500/[0.12] via-transparent to-transparent'
            iconTint='bg-emerald-500/15 text-emerald-600 shadow-emerald-500/10 dark:text-emerald-400'
            ringTint='bg-emerald-400'
          />
          <StatCard
            title='Total paid'
            value={formatTk(data?.total_paid)}
            subtitle='Collected payments'
            icon={Wallet}
            glow='bg-gradient-to-br from-sky-500/[0.12] via-transparent to-transparent'
            iconTint='bg-sky-500/15 text-sky-600 shadow-sky-500/10 dark:text-sky-400'
            ringTint='bg-sky-400'
          />
          <StatCard
            title='Total due'
            value={formatTk(data?.total_due)}
            subtitle='Outstanding balance'
            icon={UserCheck}
            glow='bg-gradient-to-br from-amber-500/[0.14] via-transparent to-transparent'
            iconTint='bg-amber-500/15 text-amber-700 shadow-amber-500/10 dark:text-amber-400'
            ringTint='bg-amber-400'
          />
          <StatCard
            title="Today's sales"
            value={formatTk(data?.today_sale ?? 0)}
            subtitle='Invoice total for today'
            icon={Truck}
            glow='bg-gradient-to-br from-rose-500/[0.12] via-transparent to-transparent'
            iconTint='bg-rose-500/15 text-rose-600 shadow-rose-500/10 dark:text-rose-400'
            ringTint='bg-rose-400'
          />
          <StatCard
            title="Today's payments"
            value={formatTk(data?.today_paid ?? 0)}
            subtitle='Cash collected today'
            icon={PiggyBank}
            glow='bg-gradient-to-br from-teal-500/[0.12] via-transparent to-transparent'
            iconTint='bg-teal-500/15 text-teal-600 shadow-teal-500/10 dark:text-teal-400'
            ringTint='bg-teal-400'
          />
          <StatCard
            title='Due bills collected'
            value={formatTk(data?.collectBill ?? 0)}
            subtitle='Today · due invoice amounts'
            icon={Receipt}
            glow='bg-gradient-to-br from-cyan-500/[0.12] via-transparent to-transparent'
            iconTint='bg-cyan-500/15 text-cyan-600 shadow-cyan-500/10 dark:text-cyan-400'
            ringTint='bg-cyan-400'
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <div className='flex justify-between'>
              <CardTitle className='text-lg font-semibold'>Cylinder Stock</CardTitle>
              <CardTitle className='text-sm font-semibold'>Updated: {formatToBDTime(data?.current_stock?.updated_at)}</CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Left side - Filled Cylinder */}
              <div>
                <h3 className='font-semibold mb-3'>Filled Cylinders</h3>
                <div className='space-y-2'>
                  {filledCylinder.map((item, idx) => (
                    <div key={idx} className='flex items-center justify-between p-2 rounded-md border hover:bg-muted/40 transition'>
                      <span className='text-sm font-medium'>{item.label}</span>
                      <span className='text-sm font-semibold'>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right side - Empty Cylinder */}
              <div>
                <h3 className='font-semibold mb-3'>Empty Cylinders</h3>
                <div className='space-y-2'>
                  {emptyCylinder.map((item, idx) => (
                    <div key={idx} className='flex items-center justify-between p-2 rounded-md border hover:bg-muted/40 transition'>
                      <span className='text-sm font-medium'>{item.label}</span>
                      <span className='text-sm font-semibold'>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-semibold'>Top Customers</CardTitle>
          </CardHeader>

          <CardContent>
            <div className='space-y-4'>
              {data?.top_customers?.map((cs, index) => (
                <div key={index} className='flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition'>
                  {/* Left: Avatar + Name */}
                  <div className='flex items-center gap-3'>
                    <Avatar>
                      <AvatarImage src='https://github.com/shadcn.png' alt={cs.customer_name} />
                      <AvatarFallback>{cs?.customer_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className='text-sm font-medium'>{cs?.customer_name}</h2>
                      <p className='text-xs text-muted-foreground'>Customer #{index + 1}</p>
                    </div>
                  </div>

                  {/* Right: Total Bought */}
                  <div className='text-right'>
                    <p className='text-sm font-semibold'>{cs?.total_bought}TK</p>
                    <p className='text-xs text-muted-foreground'>Total Bought</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest customer orders and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Is Due</TableHead>
                <TableHead>Pay</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.recent_activity?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className='font-medium'>{order.id}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{order?.is_due_bill == 1 ? <Badge className='bg-red-100 text-red-700 hover:bg-red-200'>Due Bill</Badge> : <Badge className='bg-green-100 text-green-700 hover:bg-green-200'>Purchase</Badge>}</TableCell>

                  <TableCell>{order.pay}</TableCell>
                  <TableCell>{order.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
