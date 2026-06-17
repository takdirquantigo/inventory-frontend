import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
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
} from '@/components/ui/sidebar';
import { LayoutDashboard, ListOrdered, Receipt, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CustomerLayout() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('customer_token') : null;
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const logout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer');
    navigate('/login', { replace: true });
  };

  const customerRaw = localStorage.getItem('customer');
  let customerName = 'Customer';
  try {
    const c = customerRaw ? JSON.parse(customerRaw) : null;
    if (c?.name) customerName = c.name;
  } catch {
    /* ignore */
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="px-2 py-2">
              <p className="text-xs text-muted-foreground">Signed in as</p>
              <p className="font-semibold truncate">{customerName}</p>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>My account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <NavLink to="/customer/dashboard">
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <NavLink to="/customer/transactions">
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <ListOrdered className="w-4 h-4" />
                          <span>My transactions</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <NavLink to="/customer/due-bills">
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <Receipt className="w-4 h-4" />
                          <span>Due bills provided</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} className="cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">Customer portal</h1>
            <div className="ml-auto">
              <Badge variant="outline">{new Date().toLocaleDateString()}</Badge>
            </div>
          </header>
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
