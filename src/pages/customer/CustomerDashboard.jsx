import { useQuery } from '@tanstack/react-query';
import API from '@/config/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

const money = (n) =>
  new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(
    Number(n || 0)
  );

export default function CustomerDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['customer-dashboard'],
    queryFn: async () => {
      const res = await API.get('api/customer-portal/dashboard');
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading your dashboard…</p>;
  }
  if (isError || !data) {
    return <p className="text-sm text-destructive">Could not load dashboard.</p>;
  }

  const summary = data.summary || {};
  const cylinders = data.cylinders || [];
  const monthly = (data.trends?.monthly || []).map((row) => ({
    ym: row.ym,
    purchase: Number(row.purchase || 0),
    paid: Number(row.paid || 0),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Welcome{data.customer?.name ? `, ${data.customer.name}` : ''}</h2>
        {data.customer?.customer_login_id && (
          <p className="text-sm text-muted-foreground">Your customer ID: {data.customer.customer_login_id}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{money(summary.total_purchase)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{money(summary.total_pay)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total due</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-amber-700">{money(summary.total_due)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly purchase &amp; payment</CardTitle>
            <CardDescription>Last months from your sales records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ym" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="purchase" name="Purchase" stroke="#2563eb" strokeWidth={2} />
                  <Line type="monotone" dataKey="paid" name="Paid" stroke="#16a34a" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cylinders: filled purchased vs empty provided</CardTitle>
            <CardDescription>From delivery bills (non–due-bill lines)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cylinders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" angle={-25} textAnchor="end" height={70} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="filled_purchased" name="Filled purchased" fill="#2563eb" />
                  <Bar dataKey="empty_provided" name="Empty provided" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
