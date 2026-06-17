import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import API from '@/config/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export default function CustomerTransactionDetail() {
  const { saleId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['customer-transaction-detail', saleId],
    queryFn: async () => {
      const res = await API.get(`api/customer-portal/transactions/${saleId}`);
      return res.data?.data;
    },
    enabled: Boolean(saleId),
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading sale details…</p>;
  }
  if (isError || !data?.sale) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">This sale could not be found or you do not have access.</p>
        <Button variant="outline" asChild>
          <Link to="/customer/transactions">Back to transactions</Link>
        </Button>
      </div>
    );
  }

  const sale = data.sale;
  const filled = data.filled_cylinders ?? [];
  const empty = data.empty_cylinders ?? [];
  const pricing = data.pricing_lines ?? [];

  const isDue = Number(sale.is_due_bill) === 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/customer/transactions" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </Button>
        <h2 className="text-2xl font-semibold">Sale #{sale.id}</h2>
        {isDue ? <Badge variant="secondary">Due / collection</Badge> : <Badge>Sale</Badge>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bill summary</CardTitle>
          <CardDescription>Date and amounts for this entry</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="font-medium">{sale.date ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Bill price</p>
            <p className="font-medium">{sale.price ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Paid</p>
            <p className="font-medium">{sale.pay ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Due on bill</p>
            <p className="font-medium">{sale.due ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Customer name on bill</p>
            <p className="font-medium">{sale.customer_name ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Recorded</p>
            <p className="font-medium">{sale.created_at ? new Date(sale.created_at).toLocaleString() : '—'}</p>
          </div>
          {(sale.other_cost_name || sale.other_cost_amount) && (
            <div className="sm:col-span-2">
              <p className="text-muted-foreground">Other cost</p>
              <p className="font-medium">
                {sale.other_cost_name || '—'} — {sale.other_cost_amount ?? '—'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filled cylinders</CardTitle>
          <CardDescription>Quantities delivered on this bill</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filled.map((row) => (
                <TableRow key={row.key}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell className="text-right font-mono">{row.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Empty cylinders</CardTitle>
          <CardDescription>Empty cylinders recorded on this bill</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empty.map((row) => (
                <TableRow key={row.key}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell className="text-right font-mono">{row.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Line pricing (if recorded)</CardTitle>
          <CardDescription>Per-size line totals from the shop</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Line</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricing.map((row) => (
                <TableRow key={row.key}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell className="text-right font-mono">{row.amount ?? '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
