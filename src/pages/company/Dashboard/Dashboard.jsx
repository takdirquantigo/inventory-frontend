
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  BarChart3,
  Users,
  Package,
  Truck,
  DollarSign,
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
  Home,
  ShoppingCart,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

// Sample data for charts
const salesData = [
  { month: "Jan", sales: 45000, orders: 120 },
  { month: "Feb", sales: 52000, orders: 140 },
  { month: "Mar", sales: 48000, orders: 130 },
  { month: "Apr", sales: 61000, orders: 165 },
  { month: "May", sales: 55000, orders: 150 },
  { month: "Jun", sales: 67000, orders: 180 },
]

const cylinderData = [
  { size: "12kg", sold: 450, revenue: 382500 },
  { size: "25kg", sold: 320, revenue: 528000 },
  { size: "35kg", sold: 180, revenue: 396000 },
  { size: "45kg", sold: 95, revenue: 266000 },
]

const deliveryStatusData = [
  { name: "Delivered", value: 85, color: "hsl(var(--chart-1))" },
  { name: "In Transit", value: 12, color: "hsl(var(--chart-2))" },
  { name: "Pending", value: 3, color: "hsl(var(--chart-3))" },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Rajesh Kumar",
    cylinder: "25kg",
    status: "Delivered",
    amount: "₹1,650",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Priya Sharma",
    cylinder: "12kg",
    status: "In Transit",
    amount: "₹850",
    date: "2024-01-15",
  },
  { id: "ORD-003", customer: "Amit Patel", cylinder: "35kg", status: "Pending", amount: "₹2,200", date: "2024-01-14" },
  {
    id: "ORD-004",
    customer: "Sunita Reddy",
    cylinder: "45kg",
    status: "Delivered",
    amount: "₹2,800",
    date: "2024-01-14",
  },
  {
    id: "ORD-005",
    customer: "Vikram Singh",
    cylinder: "25kg",
    status: "Delivered",
    amount: "₹1,650",
    date: "2024-01-13",
  },
]

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
    {/* Key Metrics */}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">₹3,48,000</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline w-3 h-3 mr-1" />
            +12.5% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">1,045</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline w-3 h-3 mr-1" />
            +8.2% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">2,350</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline w-3 h-3 mr-1" />
            +15.3% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">98.5%</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline w-3 h-3 mr-1" />
            +2.1% from last month
          </p>
        </CardContent>
      </Card>
    </div>

    {/* Charts Section */}
    <div className="grid gap-6 md:grid-cols-2">
      {/* Sales Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Trend</CardTitle>
          <CardDescription>Monthly sales and order volume</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              sales: {
                label: "Sales (₹)",
                color: "hsl(var(--chart-1))",
              },
              orders: {
                label: "Orders",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="var(--color-sales)"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--color-orders)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Cylinder Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cylinder Sales by Size</CardTitle>
          <CardDescription>Units sold and revenue by cylinder size</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              sold: {
                label: "Units Sold",
                color: "hsl(var(--chart-1))",
              },
              revenue: {
                label: "Revenue (₹)",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cylinderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="size" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar yAxisId="left" dataKey="sold" fill="var(--color-sold)" />
                <Bar yAxisId="right" dataKey="revenue" fill="var(--color-revenue)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>

    {/* Analytics Tabs */}
    <Tabs defaultValue="orders" className="space-y-4">
      <TabsList>
        <TabsTrigger value="orders">Recent Orders</TabsTrigger>
        <TabsTrigger value="delivery">Delivery Status</TabsTrigger>
        <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
      </TabsList>

      <TabsContent value="orders" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Cylinder</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.cylinder}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "Delivered"
                            ? "default"
                            : order.status === "In Transit"
                              ? "secondary"
                              : "outline"
                        }
                        className={
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : order.status === "In Transit"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }
                      >
                        {order.status === "Delivered" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {order.status === "In Transit" && <Clock className="w-3 h-3 mr-1" />}
                        {order.status === "Pending" && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{order.amount}</TableCell>
                    <TableCell>{order.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="delivery" className="space-y-4">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Status Distribution</CardTitle>
              <CardDescription>Current delivery status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  delivered: {
                    label: "Delivered",
                    color: "hsl(var(--chart-1))",
                  },
                  inTransit: {
                    label: "In Transit",
                    color: "hsl(var(--chart-2))",
                  },
                  pending: {
                    label: "Pending",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deliveryStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name || "Unknown"}: ${value || 0}%`}
                    >
                      {deliveryStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value, name) => [`${value}%`, name || "Status"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Performance</CardTitle>
              <CardDescription>Key delivery metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">On-Time Delivery</span>
                  <span className="text-sm text-muted-foreground">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Customer Satisfaction</span>
                  <span className="text-sm text-muted-foreground">98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Same Day Delivery</span>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Delivery Success Rate</span>
                  <span className="text-sm text-muted-foreground">99.2%</span>
                </div>
                <Progress value={99.2} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="inventory" className="space-y-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cylinderData.map((cylinder) => (
            <Card key={cylinder.size}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{cylinder.size} Cylinders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">In Stock</span>
                    <span className="text-sm font-medium">{Math.floor(Math.random() * 100) + 50} units</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sold This Month</span>
                    <span className="text-sm font-medium">{cylinder.sold} units</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="text-sm font-medium">₹{cylinder.revenue.toLocaleString()}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Stock Level</span>
                      <span className="text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 40) + 60}%
                      </span>
                    </div>
                    <Progress value={Math.floor(Math.random() * 40) + 60} className="h-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  </div>
  )
}
