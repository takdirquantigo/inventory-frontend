import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import API from '@/config/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function CustomerTransactions() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['customer-transactions', page],
    queryFn: async () => {
      const res = await API.get('api/customer-portal/transactions', { params: { page, per_page: 15 } });
      return res.data;
    },
  });

  const p = data?.data;
  const rows = p?.data ?? [];
  const lastPage = p?.last_page ?? 1;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">My transactions</h2>
      <p className="text-sm text-muted-foreground">View only — you cannot change these records.</p>

      <Card>
        <CardHeader>
          <CardTitle>All bills</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Pay</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead className="text-right w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        {Number(row.is_due_bill) === 1 ? (
                          <Badge variant="secondary">Due / collection</Badge>
                        ) : (
                          <Badge>Sale</Badge>
                        )}
                      </TableCell>
                      <TableCell>{row.price}</TableCell>
                      <TableCell>{row.pay}</TableCell>
                      <TableCell>{row.due}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/customer/transactions/${row.id}`}>Details</Link>
                        </Button>
                      </TableCell>
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
