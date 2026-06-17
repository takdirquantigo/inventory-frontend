import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, DollarSign, Printer, ShoppingCart, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "@/config/config";
import PrintButton from "@/components/PrintButton";

const formatDate = (date) => date ? date.toISOString().split("T")[0] : null;

export default function Details() {
  const { id } = useParams();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["details", id, fromDate, toDate],
    queryFn: async () => {
      const params = {};
      if (fromDate && toDate) {
        params.start_date = fromDate;
        params.end_date = toDate;
      }
      const response = await API.get(`/api/customers/details/${id}`, { params });
      return response.data;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-6 py-8'>
        {/* Customer Overview */}
        <Link to='/admin/customers'>
          {' '}
          <Badge variant='secondary' className='ml-auto'>
            <ArrowLeft /> Go Back
          </Badge>
        </Link>
        <Card className="mb-8 mt-3">
          <CardHeader>
            <CardTitle className="flex items-center flex-col md:flex-row justify-between gap-3">
              <div className="flex items-start md:items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/professional-business-person.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl">{data?.customer?.name}</h2>
                </div>
              </div>

              {/* From / To Date Inputs */}
              <div className="flex gap-2 flex-col md:flex-row items-center">
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    if (!toDate) setToDate(e.target.value); // auto-fill toDate if empty
                  }}
                />
                <span>→</span>
                <Input
                  type="date"
                  value={toDate}
                  min={fromDate} // ensure toDate is not earlier than fromDate
                  onChange={(e) => setToDate(e.target.value)}
                />
                <Button
                  onClick={() => refetch()}
                  variant="default"
                  className="ml-2"
                >
                  Apply
                </Button>
                <Button
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                    refetch();
                  }}
                  variant="outline"
                >
                  Clear
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Analytics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Cycle</CardTitle>
              <ShoppingCart className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{data?.analytics?.sales_count || 0} Cylinders</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Buy</CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{data?.analytics?.total_amount || 0} TK</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Pay</CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{data?.analytics?.total_paid || 0} TK</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Due</CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{(data?.analytics?.total_amount || 0) - (data?.analytics?.total_paid || 0)} TK</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8" >
                    <Card  >
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>5 KG</CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{(data?.analytics?.quantities?.['5kg'] || 0)} / {(data?.analytics?.empty_return?.['5kg'] || 0)}</div>
              <p className="text-xs text-muted-foreground">Package: {(data?.analytics?.package_quantities?.['5kg'] || 0)}</p>
            </CardContent>
          </Card>
          <Card  >
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>12 KG</CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{(data?.analytics?.quantities?.['12kg'] || 0)} / {(data?.analytics?.empty_return?.['12kg'] || 0)}</div>
              <p className="text-xs text-muted-foreground">Package: {(data?.analytics?.package_quantities?.['12kg'] || 0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>25 KG</CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{(data?.analytics?.quantities?.['25kg'] || 0)} / {(data?.analytics?.empty_return?.['25kg'] || 0)}</div>
              <p className="text-xs text-muted-foreground">Package: {(data?.analytics?.package_quantities?.['25kg'] || 0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>33 KG</CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{(data?.analytics?.quantities?.['33kg'] || 0)} / {(data?.analytics?.empty_return?.['33kg'] || 0)}</div>
              <p className="text-xs text-muted-foreground">Package: {(data?.analytics?.package_quantities?.['33kg'] || 0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>35 KG</CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{(data?.analytics?.quantities?.['35kg'] || 0)} / {(data?.analytics?.empty_return?.['35kg'] || 0)}</div>
              <p className="text-xs text-muted-foreground">Package: {(data?.analytics?.package_quantities?.['35kg'] || 0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>45 KG</CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{(data?.analytics?.quantities?.['45kg'] || 0)} / {(data?.analytics?.empty_return?.['45kg'] || 0)}</div>
              <p className="text-xs text-muted-foreground">Package: {(data?.analytics?.package_quantities?.['45kg'] || 0)}</p>
            </CardContent>
          </Card>


        </div>

        {/* Sales Table */}
        <h2 className='text-2xl font-bold mb-4'>Latest Sale</h2>
        <Table>
          <TableHeader className='bg-muted'>
            <TableRow>
              <TableHead className='w-[100px]'>5KG</TableHead>
              <TableHead className='w-[100px]'>12KG</TableHead>
              <TableHead>25KG</TableHead>
              <TableHead>33KG</TableHead>
              <TableHead className='text-right'>35KG</TableHead>
              <TableHead className='text-right'>45KG</TableHead>
              <TableHead className='text-right'>Total</TableHead>
              <TableHead className='text-right'>Pay</TableHead>
              <TableHead className='text-right'>Due</TableHead>
              <TableHead className='text-right'>Date</TableHead>
              <TableHead className='text-right'>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.sales?.length > 0 ? (
              data.sales.map((td, index) => (
                <TableRow key={index}>
                  <TableCell className='font-medium'>
                    {td.five_kg ?? '0'}/{td.empty_five_kg ?? '0'}
                  </TableCell>
                  <TableCell className='font-medium'>
                    {td.twelve_kg ?? '0'}/{td.empty_twelve_kg ?? '0'}
                  </TableCell>
                  <TableCell>
                    {td.twentyfive_kg ?? '0'}/{td.empty_twentyfive_kg ?? '0'}
                  </TableCell>
                  <TableCell>
                    {td.thirtythree_kg ?? '0'}/{td.empty_thirtythree_kg ?? '0'}
                  </TableCell>
                  <TableCell className='text-right'>
                    {td.thirtyfive_kg ?? '0'}/{td.empty_thirtyfive_kg ?? '0'}
                  </TableCell>
                  <TableCell className='text-right'>
                    {td.fourtyfive_kg ?? '0'}/{td.empty_fourtyfive_kg ?? '0'}
                  </TableCell>

                  <TableCell className='text-right'>{td.price ?? '0'}</TableCell>
                  <TableCell className='text-right'>{td.pay ?? '0'}</TableCell>
                  <TableCell className='text-right'>{td.due ?? '0'}</TableCell>
                  <TableCell className='text-right'>{td.date ?? '0'}</TableCell>
                  <TableCell className='text-right'>
                    <div>
                      <PrintButton
                        content={{ ...td, customer: data?.customer }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className='text-center text-muted-foreground'>
                  No sales found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
