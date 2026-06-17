import { Badge } from '@/components/ui/badge';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { BarChart3, Package, TableOfContents, Calendar, Settings, LogOut, ShoppingCart, ShieldBan, BaggageClaim, Boxes, Wallet } from 'lucide-react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login', { replace: true });
  };

  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-full  bg-background'>
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader className='border-b border-sidebar-border'>
            <div className='flex items-center space-x-2 px-2 py-2'>
              <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
                <span className='text-primary-foreground font-bold text-sm'>G</span>
              </div>
              <span className='text-lg font-bold text-sidebar-foreground'>Mohammad Enterprice</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <NavLink to='/admin/dashboard'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <Package className='w-4 h-4' />
                          <span>Dashboard</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <NavLink to='/admin/analysis'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <BarChart3 className='w-4 h-4' />
                          <span>Analytics</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Customers */}
                  <SidebarMenuItem>
                    <NavLink to='/admin/customers'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <ShoppingCart className='w-4 h-4' />
                          <span>Customers</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <NavLink to='/admin/due-customers'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <Wallet className='w-4 h-4' />
                          <span>Due customers</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>

                  {/* Stoke */}
                  <SidebarMenuItem>
                    <NavLink to='/admin/stoke'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <Package className='w-4 h-4' />
                          <span>Stoke</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <NavLink to='/admin/collection'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <Boxes className='w-4 h-4' />
                          <span>Collection</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <NavLink to='/admin/sale'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <BaggageClaim className='w-4 h-4' />
                          <span>Sales</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <NavLink to='/admin/inactive'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <ShieldBan className='w-4 h-4' />
                          <span>Inactive</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <NavLink to='/admin/items'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <TableOfContents className='w-4 h-4' />
                          <span>CMS</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings className='w-4 h-4' />
                      <span>Configuration</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className='border-t border-sidebar-border'>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} className='cursor-pointer'>
                  <LogOut className='w-4 h-4' />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset>
          <header className='flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4'>
            <SidebarTrigger className='-ml-1' />
            <div className='flex items-center gap-2'>
              <h1 className='text-lg font-semibold'>Dashboard Overview</h1>
            </div>
            <div className='ml-auto flex items-center gap-2'>
              <Badge variant='outline' className='bg-primary/10 text-primary border-primary/20'>
                <Calendar className='w-3 h-3 mr-1' />
                Today: {new Date().toLocaleDateString()}
              </Badge>
            </div>
          </header>
          <div className='px-4 py-4'>
            <Outlet></Outlet>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
