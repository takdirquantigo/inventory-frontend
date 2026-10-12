import { Fragment, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import API from '@/config/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from 'react-i18next';
import { getNumberLocale } from '@/i18n';

const CYLINDER_KEYS = {
  five_kg: 'cylinders.filled5kg',
  twelve_kg: 'cylinders.filled12kg',
  twentyfive_kg: 'cylinders.filled25kg',
  thirtythree_kg: 'cylinders.filled33kg',
  thirtyfive_kg: 'cylinders.filled35kg',
  fourtyfive_kg: 'cylinders.filled45kg',
  others_kg: 'cylinders.othersFilled',
  empty_five_kg: 'cylinders.empty5kg',
  empty_twelve_kg: 'cylinders.empty12kg',
  empty_twentyfive_kg: 'cylinders.empty25kg',
  empty_thirtythree_kg: 'cylinders.empty33kg',
  empty_thirtyfive_kg: 'cylinders.empty35kg',
  empty_fourtyfive_kg: 'cylinders.empty45kg',
  empty_others_kg: 'cylinders.emptyOthers',
};

/** Same order as AnalysisController filled + empty columns */
const MONTHLY_VARIANT_ORDER = [
  'five_kg',
  'twelve_kg',
  'twentyfive_kg',
  'thirtythree_kg',
  'thirtyfive_kg',
  'fourtyfive_kg',
  'others_kg',
  'empty_five_kg',
  'empty_twelve_kg',
  'empty_twentyfive_kg',
  'empty_thirtythree_kg',
  'empty_thirtyfive_kg',
  'empty_fourtyfive_kg',
  'empty_others_kg',
];

const money = (value, locale) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(Number(value || 0));
const number = (value, locale) => new Intl.NumberFormat(locale).format(Number(value || 0));

export default function Analysis() {
  const { t, i18n } = useTranslation();
  const locale = getNumberLocale(i18n.language);
  const today = new Date().toISOString().slice(0, 10);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState(today);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['analysis-overview', fromDate, toDate],
    queryFn: async () => {
      const response = await API.get('api/analysis/overview', {
        params: {
          start_date: fromDate || undefined,
          end_date: toDate || undefined,
        },
      });
      return response.data;
    },
    keepPreviousData: true,
  });

  const summary = data?.summary ?? {};
  const trendData = data?.trends?.daily ?? [];
  const monthlyCylinderRows = data?.trends?.monthly_cylinder_breakdown ?? [];
  const topCustomers = data?.top_customers ?? [];
  const receivables = data?.high_receivables ?? [];
  const movement = data?.cylinder_movement ?? {};

  const cylinderMovementData = useMemo(() => {
    return Object.entries(movement).map(([key, value]) => ({
      name: t(CYLINDER_KEYS[key] ?? key),
      in: Number(value?.in || 0),
      out: Number(value?.out || 0),
      net: Number(value?.net || 0),
    }));
  }, [movement, t]);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{t('analysis.title')}</h2>
          <p className="text-sm text-muted-foreground">{t('analysis.subtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <span>{t('common.to')}</span>
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          <Button onClick={() => refetch()}>{t('common.apply')}</Button>
          <Button
            variant="outline"
            onClick={() => {
              setFromDate('');
              setToDate(today);
            }}
          >
            {t('common.reset')}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title={t('analysis.totalSales')} value={money(summary.total_sales, locale)} />
        <MetricCard title={t('analysis.totalCollection')} value={money(summary.total_collection, locale)} />
        <MetricCard title={t('analysis.purchaseCost')} value={money(summary.total_purchase_cost, locale)} />
        <MetricCard title={t('analysis.bookedDue')} value={money(summary.total_due_booked, locale)} />
        <MetricCard title={t('analysis.collectedDue')} value={money(summary.due_collection, locale)} />
        <MetricCard title={t('analysis.transactions')} value={number(summary.total_transactions, locale)} />
        <MetricCard title={t('analysis.activeCustomers')} value={number(summary.active_customers, locale)} />
        <MetricCard title={t('analysis.purchaseEntries')} value={number(summary.total_purchase_entries, locale)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('analysis.monthlyTitle')}</CardTitle>
          <CardDescription>
            {t('analysis.monthlyDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-10 min-w-[88px] bg-background">{t('analysis.month')}</TableHead>
                {MONTHLY_VARIANT_ORDER.map((key) => (
                  <TableHead key={key} colSpan={2} className="border-l text-center">
                    <span className="whitespace-normal text-xs font-medium leading-tight">
                      {t(CYLINDER_KEYS[key] ?? key)}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
              <TableRow>
                <TableHead className="sticky left-0 z-10 bg-background" />
                {MONTHLY_VARIANT_ORDER.map((key) => (
                  <Fragment key={`${key}-sub`}>
                    <TableHead className="border-l text-right text-xs text-muted-foreground">{t('analysis.in')}</TableHead>
                    <TableHead className="text-right text-xs text-muted-foreground">{t('analysis.out')}</TableHead>
                  </Fragment>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyCylinderRows.map((row) => (
                <TableRow key={row.month}>
                  <TableCell className="sticky left-0 z-10 bg-background font-medium">{row.month_label}</TableCell>
                  {MONTHLY_VARIANT_ORDER.map((key) => {
                    const cell = row.cylinders?.[key] ?? { purchase: 0, sale: 0 };
                    return (
                      <Fragment key={`${row.month}-${key}`}>
                        <TableCell className="border-l text-right tabular-nums">{number(cell.purchase, locale)}</TableCell>
                        <TableCell className="text-right tabular-nums">{number(cell.sale, locale)}</TableCell>
                      </Fragment>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('analysis.dailyTrend')}</CardTitle>
            <CardDescription>{t('analysis.dailyTrendDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" name={t('analysis.sales')} stroke="#2563eb" strokeWidth={2} />
                  <Line type="monotone" dataKey="collection" name={t('analysis.collection')} stroke="#16a34a" strokeWidth={2} />
                  <Line type="monotone" dataKey="due" name={t('common.due')} stroke="#dc2626" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('analysis.cylinderMovement')}</CardTitle>
            <CardDescription>{t('analysis.cylinderMovementDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cylinderMovementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="in" name={t('analysis.in')} fill="#16a34a" />
                  <Bar dataKey="out" name={t('analysis.out')} fill="#2563eb" />
                  <Bar dataKey="net" name={t('analysis.net')} fill="#d97706" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('analysis.topCustomers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.customer')}</TableHead>
                  <TableHead>{t('analysis.sales')}</TableHead>
                  <TableHead>{t('common.paid')}</TableHead>
                  <TableHead>{t('common.due')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((item) => (
                  <TableRow key={`${item.customer_id}-${item.customer_name}`}>
                    <TableCell>{item.customer_name || t('common.unknown')}</TableCell>
                    <TableCell>{money(item.total_sales, locale)}</TableCell>
                    <TableCell>{money(item.total_paid, locale)}</TableCell>
                    <TableCell>{money(item.total_due, locale)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('analysis.highestReceivables')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.customer')}</TableHead>
                  <TableHead>{t('analysis.receivable')}</TableHead>
                  <TableHead>{t('analysis.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receivables.map((item) => (
                  <TableRow key={`due-${item.customer_id}-${item.customer_name}`}>
                    <TableCell>{item.customer_name || t('common.unknown')}</TableCell>
                    <TableCell>{money(item.total_due, locale)}</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">{t('analysis.highDue')}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('analysis.movementDetail')}</CardTitle>
          <CardDescription>{t('analysis.movementDetailDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('analysis.cylinderType')}</TableHead>
                <TableHead>{t('analysis.in')}</TableHead>
                <TableHead>{t('analysis.out')}</TableHead>
                <TableHead>{t('analysis.net')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cylinderMovementData.map((item) => (
                <TableRow key={item.name}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{number(item.in, locale)}</TableCell>
                  <TableCell>{number(item.out, locale)}</TableCell>
                  <TableCell>{number(item.net, locale)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isLoading && <p className="text-sm text-muted-foreground">{t('analysis.loading')}</p>}
      {isError && <p className="text-sm text-red-500">{t('analysis.failed', { message: error?.message })}</p>}
    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}