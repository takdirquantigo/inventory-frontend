import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '@/config/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CustomerDueBills() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['customer-due-bills', page],
    queryFn: async () => {
      const res = await API.get('api/customer-portal/due-bills', { params: { page, per_page: 15 } });
      return res.data;
    },
  });

  const p = data?.data;
  const rows = p?.data ?? [];
  const lastPage = p?.last_page ?? 1;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Due bills provided</h2>
      <p className="text-sm text-muted-foreground">Payments recorded as due-bill collections.</p>

      <Card>
        <CardHeader>
          <CardTitle>Due bill list</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No due bill entries found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount paid</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.pay}</TableCell>
                      <TableCell>{row.price ?? '—'}</TableCell>
                      <TableCell>{row.due ?? '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex items-center justify-between gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {lastPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= lastPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
