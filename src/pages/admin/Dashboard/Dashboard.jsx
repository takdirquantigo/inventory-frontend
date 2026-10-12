import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, DollarSign, CalendarDays, CalendarRange } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '@/config/config';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatToBDTime, cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { getNumberLocale } from '@/i18n';
import { DataTable } from '@/components/common/data-table';
import Modal from '@/components/common/modal';

function formatTk(value, locale) {
  if (value === null || value === undefined || value === '') return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return `TK ${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(n)}`;
}

function formatCount(value, locale) {
  if (value === null || value === undefined || value === '') return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat(locale).format(n);
}

function cylinderPair(filled, empty) {
  const left = Number(filled) || 0;
  const right = Number(empty) || 0;
  return `${left}/${right}`;
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

function StatGroupCard({ title, subtitle, icon: Icon, glow, iconTint, ringTint, items }) {
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
      <div className='relative mb-5 flex items-start justify-between gap-4'>
        <div className='space-y-1'>
          <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>{title}</p>
          {subtitle ? <p className='text-xs text-muted-foreground'>{subtitle}</p> : null}
        </div>
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-inner ring-2 ring-background',
            iconTint,
          )}>
          <Icon className='h-5 w-5' strokeWidth={2} />
        </div>
      </div>
      <div className='relative grid grid-cols-3 gap-3'>
        {items.map((item) => (
          <div key={item.label} className='min-w-0 space-y-1'>
            <p className={cn('text-[11px] font-semibold uppercase tracking-wider', item.tone)}>{item.label}</p>
            <p className='truncate text-sm font-bold tracking-tight text-foreground tabular-nums sm:text-xl'>{item.value}</p>
          </div>
        ))}
      </div>
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-foreground/10 to-transparent' />
    </div>
  );
}

function dailyColumns({ t, locale, onDueClick }) {
  return [
    {
      accessorKey: 'date',
      header: () => <div className='text-left font-bold'>{t('common.date')}</div>,
      cell: ({ row }) => <div className='text-left font-medium tabular-nums'>{row.original.date}</div>,
    },
    {
      accessorKey: 'twelve_kg',
      header: () => <div className='text-center font-bold'>{t('cylinders.12kg')}</div>,
      cell: ({ row }) => <div className='text-center tabular-nums'>{cylinderPair(row.original.twelve_kg, row.original.empty_twelve_kg)}</div>,
    },
    {
      accessorKey: 'thirtyfive_kg',
      header: () => <div className='text-center font-bold'>{t('cylinders.35kg')}</div>,
      cell: ({ row }) => <div className='text-center tabular-nums'>{cylinderPair(row.original.thirtyfive_kg, row.original.empty_thirtyfive_kg)}</div>,
    },
    {
      accessorKey: 'fourtyfive_kg',
      header: () => <div className='text-center font-bold'>{t('cylinders.45kg')}</div>,
      cell: ({ row }) => <div className='text-center tabular-nums'>{cylinderPair(row.original.fourtyfive_kg, row.original.empty_fourtyfive_kg)}</div>,
    },
    {
      accessorKey: 'amount',
      header: () => <div className='text-right font-bold'>{t('common.amount')}</div>,
      cell: ({ row }) => <div className='text-right tabular-nums'>{formatTk(row.original.amount, locale)}</div>,
    },
    {
      accessorKey: 'paid',
      header: () => <div className='text-right font-bold'>{t('common.paid')}</div>,
      cell: ({ row }) => <div className='text-right tabular-nums'>{formatTk(row.original.paid, locale)}</div>,
    },
    {
      accessorKey: 'due',
      header: () => <div className='text-right font-bold'>{t('common.due')}</div>,
      cell: ({ row }) => {
        const due = Number(row.original.due) || 0;
        if (due <= 0) {
          return <div className='text-right tabular-nums text-muted-foreground'>{formatTk(0, locale)}</div>;
        }
        return (
          <div className='text-right'>
            <button
              type='button'
              className='font-semibold tabular-nums text-amber-700 underline decoration-amber-400/70 underline-offset-2 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300'
              aria-label={t('dashboard.viewDue', { date: row.original.date })}
              onClick={() => onDueClick(row.original.date)}>
              {formatTk(due, locale)}
            </button>
          </div>
        );
      },
    },
  ];
}

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const locale = getNumberLocale(i18n.language);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const [dueDate, setDueDate] = useState(null);

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

  const {
    data: dailySales,
    isLoading: dailyLoading,
    isError: dailyError,
    error: dailyErrorObj,
  } = useQuery({
    queryKey: ['dashboard-daily-sales', fromDate, toDate, page],
    queryFn: async () => {
      const response = await API.get('api/customers/dashboard/daily-sales', {
        params: {
          start_date: fromDate,
          end_date: toDate,
          page,
        },
      });
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const { data: dueList, isFetching: dueLoading } = useQuery({
    queryKey: ['dashboard-daily-dues', dueDate],
    enabled: Boolean(dueDate),
    queryFn: async () => {
      const response = await API.get('api/customers/dashboard/daily-dues', {
        params: { date: dueDate },
      });
      return response.data;
    },
  });




  let filledCylinder = [
    { label: t('cylinders.5kg'), value: data?.current_stock?.five_kg },
    { label: t('cylinders.12kg'), value: data?.current_stock?.twelve_kg },
    { label: t('cylinders.25kg'), value: data?.current_stock?.twentyfive_kg },
    { label: t('cylinders.33kg'), value: data?.current_stock?.thirtythree_kg },
    { label: t('cylinders.35kg'), value: data?.current_stock?.thirtyfive_kg },
    { label: t('cylinders.45kg'), value: data?.current_stock?.fourtyfive_kg },
  ];
  let emptyCylinder = [
    { label: t('cylinders.5kg'), value: data?.current_stock?.empty_five_kg },
    { label: t('cylinders.12kg'), value: data?.current_stock?.empty_twelve_kg },
    { label: t('cylinders.25kg'), value: data?.current_stock?.empty_twentyfive_kg },
    { label: t('cylinders.33kg'), value: data?.current_stock?.empty_thirtythree_kg },
    { label: t('cylinders.35kg'), value: data?.current_stock?.empty_thirtyfive_kg },
    { label: t('cylinders.45kg'), value: data?.current_stock?.empty_fourtyfive_kg },
  ];
  return (
    <div className='flex-1 space-y-4 p-2'>
      <div className='flex flex-col gap-4 rounded-2xl border border-border/60 bg-muted/30 p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end'>
        <div className='flex min-w-0 flex-1 flex-col gap-1.5 sm:max-w-44'>
          <label className='text-xs font-medium text-muted-foreground' htmlFor='dash-from'>
            {t('common.from')}
          </label>
          <Input
            id='dash-from'
            type='date'
            value={fromDate}
            className='bg-background'
            onChange={(e) => {
              setFromDate(e.target.value);
              if (!toDate) setToDate(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className='hidden items-center pb-2 text-muted-foreground sm:flex' aria-hidden>
          →
        </div>
        <div className='flex min-w-0 flex-1 flex-col gap-1.5 sm:max-w-44'>
          <label className='text-xs font-medium text-muted-foreground' htmlFor='dash-to'>
            {t('common.to')}
          </label>
          <Input
            id='dash-to'
            type='date'
            value={toDate}
            min={fromDate || undefined}
            className='bg-background'
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className='flex flex-wrap gap-2 sm:ml-auto'>
          <Button type='button' onClick={() => refetch()} disabled={isFetching} className='min-w-24'>
            {isFetching ? t('common.loading') : t('common.apply')}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              setFromDate('');
              setToDate('');
              setPage(1);
              refetch();
            }}>
            {t('common.clear')}
          </Button>
        </div>
      </div>

      <div>
        <h2 className='mb-4 text-lg font-semibold tracking-tight'>{t('dashboard.overview')}</h2>
        <div className='grid gap-4 md:grid-cols-2'>
          <StatCard
            title={t('dashboard.totalCustomers')}
            value={formatCount(data?.total_customer, locale)}
            subtitle={t('dashboard.registered')}
            icon={Users}
            glow='bg-gradient-to-br from-violet-500/[0.12] via-transparent to-transparent'
            iconTint='bg-violet-500/15 text-violet-600 shadow-violet-500/10 dark:text-violet-400'
            ringTint='bg-violet-400'
          />
          <StatGroupCard
            title={t('dashboard.totals')}
            subtitle={fromDate && toDate ? `${fromDate} → ${toDate}` : t('dashboard.allTime')}
            icon={DollarSign}
            glow='bg-gradient-to-br from-emerald-500/[0.12] via-transparent to-transparent'
            iconTint='bg-emerald-500/15 text-emerald-600 shadow-emerald-500/10 dark:text-emerald-400'
            ringTint='bg-emerald-400'
            items={[
              { label: t('common.sale'), value: formatTk(data?.total_sale, locale), tone: 'text-emerald-600 dark:text-emerald-400' },
              { label: t('common.paid'), value: formatTk(data?.total_paid, locale), tone: 'text-sky-600 dark:text-sky-400' },
              { label: t('common.due'), value: formatTk(data?.total_due, locale), tone: 'text-amber-600 dark:text-amber-400' },
            ]}
          />
          <StatGroupCard
            title={t('dashboard.today')}
            subtitle={t('dashboard.todaySubtitle')}
            icon={CalendarDays}
            glow='bg-gradient-to-br from-rose-500/[0.12] via-transparent to-transparent'
            iconTint='bg-rose-500/15 text-rose-600 shadow-rose-500/10 dark:text-rose-400'
            ringTint='bg-rose-400'
            items={[
              { label: t('common.sale'), value: formatTk(data?.today_sale ?? 0, locale), tone: 'text-emerald-600 dark:text-emerald-400' },
              { label: t('common.paid'), value: formatTk(data?.today_paid ?? 0, locale), tone: 'text-sky-600 dark:text-sky-400' },
              { label: t('common.due'), value: formatTk(data?.today_due ?? 0, locale), tone: 'text-amber-600 dark:text-amber-400' },
            ]}
          />
          <StatGroupCard
            title={t('dashboard.thisMonth')}
            subtitle={new Date().toLocaleString(locale, { month: 'long', year: 'numeric', timeZone: 'Asia/Dhaka' })}
            icon={CalendarRange}
            glow='bg-gradient-to-br from-sky-500/[0.12] via-transparent to-transparent'
            iconTint='bg-sky-500/15 text-sky-600 shadow-sky-500/10 dark:text-sky-400'
            ringTint='bg-sky-400'
            items={[
              { label: t('common.sale'), value: formatTk(data?.month_sale ?? 0, locale), tone: 'text-emerald-600 dark:text-emerald-400' },
              { label: t('common.paid'), value: formatTk(data?.month_paid ?? 0, locale), tone: 'text-sky-600 dark:text-sky-400' },
              { label: t('common.due'), value: formatTk(data?.month_due ?? 0, locale), tone: 'text-amber-600 dark:text-amber-400' },
            ]}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <div className='flex justify-between'>
              <CardTitle className='text-lg font-semibold'>{t('dashboard.cylinderStock')}</CardTitle>
              <CardTitle className='text-sm font-semibold'>{t('dashboard.updated', { date: formatToBDTime(data?.current_stock?.updated_at) })}</CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Left side - Filled Cylinder */}
              <div>
                <h3 className='font-semibold mb-3'>{t('dashboard.filled')}</h3>
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
                <h3 className='font-semibold mb-3'>{t('dashboard.empty')}</h3>
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
            <CardTitle className='text-lg font-semibold'>{t('dashboard.topCustomers')}</CardTitle>
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
                      <p className='text-xs text-muted-foreground'>{t('dashboard.customerN', { n: index + 1 })}</p>
                    </div>
                  </div>

                  {/* Right: Total Bought */}
                  <div className='text-right'>
                    <p className='text-sm font-semibold'>{cs?.total_bought}{t('common.tk')}</p>
                    <p className='text-xs text-muted-foreground'>{t('dashboard.totalBought')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.dailySales')}</CardTitle>
          <CardDescription>{t('dashboard.dailySalesDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={dailyColumns({ t, locale, onDueClick: setDueDate })}
            data={dailySales?.data ?? []}
            links={dailySales?.links ?? []}
            setPage={setPage}
            page={page}
            isLoading={dailyLoading}
            isError={dailyError}
            error={dailyErrorObj}
            isShowSearch={false}
          />
        </CardContent>
      </Card>

      <Modal open={Boolean(dueDate)} onOpenChange={(open) => !open && setDueDate(null)} closeOnOutsideClick title={t('dashboard.dueOnDate', { date: dueDate ?? '' })} className='max-w-4xl'>
        <p className='text-sm text-muted-foreground'>{t('dashboard.dueOnDateDesc')}</p>
        <div className='max-h-[60dvh] overflow-auto rounded-xl border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.customer')}</TableHead>
                <TableHead className='text-center'>{t('cylinders.12kg')}</TableHead>
                <TableHead className='text-center'>{t('cylinders.35kg')}</TableHead>
                <TableHead className='text-center'>{t('cylinders.45kg')}</TableHead>
                <TableHead className='text-right'>{t('common.amount')}</TableHead>
                <TableHead className='text-right'>{t('common.paid')}</TableHead>
                <TableHead className='text-right'>{t('common.due')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dueLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className='h-24 text-center text-muted-foreground'>
                    {t('common.loading')}
                  </TableCell>
                </TableRow>
              ) : dueList?.data?.length ? (
                dueList.data.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className='font-medium'>{sale.customer_name || t('common.na')}</TableCell>
                    <TableCell className='text-center tabular-nums'>{cylinderPair(sale.twelve_kg, sale.empty_twelve_kg)}</TableCell>
                    <TableCell className='text-center tabular-nums'>{cylinderPair(sale.thirtyfive_kg, sale.empty_thirtyfive_kg)}</TableCell>
                    <TableCell className='text-center tabular-nums'>{cylinderPair(sale.fourtyfive_kg, sale.empty_fourtyfive_kg)}</TableCell>
                    <TableCell className='text-right tabular-nums'>{formatTk(sale.price, locale)}</TableCell>
                    <TableCell className='text-right tabular-nums'>{formatTk(sale.pay, locale)}</TableCell>
                    <TableCell className='text-right font-semibold tabular-nums text-amber-700 dark:text-amber-400'>{formatTk(sale.due, locale)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className='h-24 text-center text-muted-foreground'>
                    {t('dashboard.noDueRecords')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Modal>
    </div>
  );
}
