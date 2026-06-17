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

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-BD', {
  style: 'currency',
  currency: 'BDT',
  maximumFractionDigits: 0,
});

const NUMBER_FORMATTER = new Intl.NumberFormat('en-BD');

const CYLINDER_LABELS = {
  five_kg: '5 KG Filled',
  twelve_kg: '12 KG Filled',
  twentyfive_kg: '25 KG Filled',
  thirtythree_kg: '33 KG Filled',
  thirtyfive_kg: '35 KG Filled',
  fourtyfive_kg: '45 KG Filled',
  others_kg: 'Others Filled',
  empty_five_kg: '5 KG Empty',
  empty_twelve_kg: '12 KG Empty',
  empty_twentyfive_kg: '25 KG Empty',
  empty_thirtythree_kg: '33 KG Empty',
  empty_thirtyfive_kg: '35 KG Empty',
  empty_fourtyfive_kg: '45 KG Empty',
  empty_others_kg: 'Others Empty',
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

const money = (value) => CURRENCY_FORMATTER.format(Number(value || 0));
const number = (value) => NUMBER_FORMATTER.format(Number(value || 0));

export default function Analysis() {
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
      name: CYLINDER_LABELS[key] ?? key,
      in: Number(value?.in || 0),
      out: Number(value?.out || 0),
      net: Number(value?.net || 0),
    }));
  }, [movement]);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">LPG Business Analysis</h2>
          <p className="text-sm text-muted-foreground">Sales, collection, stock movement, due and profitability insights</p>
        </div>

        <div className="flex items-center gap-2">
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <span>to</span>
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          <Button onClick={() => refetch()}>Apply</Button>
          <Button
            variant="outline"
            onClick={() => {
              setFromDate('');
              setToDate(today);
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Sales" value={money(summary.total_sales)} />
        <MetricCard title="Total Collection" value={money(summary.total_collection)} />
        <MetricCard title="Purchase Cost" value={money(summary.total_purchase_cost)} />
        <MetricCard title="Booked Due" value={money(summary.total_due_booked)} />
        <MetricCard title="Collected from Due Bills" value={money(summary.due_collection)} />
        <MetricCard title="Transactions" value={number(summary.total_transactions)} />
        <MetricCard title="Active Customers" value={number(summary.active_customers)} />
        <MetricCard title="Purchase Entries" value={number(summary.total_purchase_entries)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly breakdown</CardTitle>
          <CardDescription>
            Per month and cylinder type: purchase (stock-in from products) vs sale quantities. Scroll horizontally to
            see all sizes.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-10 min-w-[88px] bg-background">Month</TableHead>
                {MONTHLY_VARIANT_ORDER.map((key) => (
                  <TableHead key={key} colSpan={2} className="border-l text-center">
                    <span className="whitespace-normal text-xs font-medium leading-tight">
                      {CYLINDER_LABELS[key] ?? key}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
              <TableRow>
                <TableHead className="sticky left-0 z-10 bg-background" />
                {MONTHLY_VARIANT_ORDER.map((key) => (
                  <Fragment key={`${key}-sub`}>
                    <TableHead className="border-l text-right text-xs text-muted-foreground">In</TableHead>
                    <TableHead className="text-right text-xs text-muted-foreground">Out</TableHead>
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
                        <TableCell className="border-l text-right tabular-nums">{number(cell.purchase)}</TableCell>
                        <TableCell className="text-right tabular-nums">{number(cell.sale)}</TableCell>
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
            <CardTitle>Daily Sales vs Collection Trend</CardTitle>
            <CardDescription>Cashflow behavior for selected period</CardDescription>
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
                  <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} />
                  <Line type="monotone" dataKey="collection" stroke="#16a34a" strokeWidth={2} />
                  <Line type="monotone" dataKey="due" stroke="#dc2626" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cylinder In/Out Movement</CardTitle>
            <CardDescription>Filled outflow + empty return trends by size</CardDescription>
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
                  <Bar dataKey="in" fill="#16a34a" />
                  <Bar dataKey="out" fill="#2563eb" />
                  <Bar dataKey="net" fill="#d97706" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Customers by Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((item) => (
                  <TableRow key={`${item.customer_id}-${item.customer_name}`}>
                    <TableCell>{item.customer_name || 'Unknown'}</TableCell>
                    <TableCell>{money(item.total_sales)}</TableCell>
                    <TableCell>{money(item.total_paid)}</TableCell>
                    <TableCell>{money(item.total_due)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highest Receivables</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Receivable</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receivables.map((item) => (
                  <TableRow key={`due-${item.customer_id}-${item.customer_name}`}>
                    <TableCell>{item.customer_name || 'Unknown'}</TableCell>
                    <TableCell>{money(item.total_due)}</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">High Due</Badge>
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
          <CardTitle>Cylinder Movement Detail</CardTitle>
          <CardDescription>Size-wise LPG logistics summary in selected range</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cylinder Type</TableHead>
                <TableHead>In</TableHead>
                <TableHead>Out</TableHead>
                <TableHead>Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cylinderMovementData.map((item) => (
                <TableRow key={item.name}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{number(item.in)}</TableCell>
                  <TableCell>{number(item.out)}</TableCell>
                  <TableCell>{number(item.net)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isLoading && <p className="text-sm text-muted-foreground">Loading analysis data...</p>}
      {isError && <p className="text-sm text-red-500">Failed to load analysis: {error?.message}</p>}
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