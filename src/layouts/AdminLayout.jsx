import { Badge } from '@/components/ui/badge';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { BarChart3, Package, TableOfContents, Calendar, Settings, LogOut, ShoppingCart, ShieldBan, BaggageClaim, Boxes, Wallet } from 'lucide-react';
import { NavLink, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { getNumberLocale } from '@/i18n';

function getPageTitleKey(pathname) {
  if (pathname.startsWith('/admin/customer/')) return 'pageTitle.customerDetails';
  if (pathname === '/admin/sale/add') return 'pageTitle.addSale';
  if (pathname.startsWith('/admin/sale/')) return 'pageTitle.editSale';
  if (pathname === '/admin/stoke/add') return 'pageTitle.addStock';
  if (pathname.startsWith('/admin/stoke/')) return 'pageTitle.editStock';

  const map = {
    '/admin/dashboard': 'nav.dashboard',
    '/admin/analysis': 'nav.analytics',
    '/admin/customers': 'nav.customers',
    '/admin/due-customers': 'nav.dueCustomers',
    '/admin/stoke': 'nav.stock',
    '/admin/collection': 'nav.collection',
    '/admin/sale': 'nav.sales',
    '/admin/inactive': 'nav.inactive',
    '/admin/items': 'nav.cms',
  };
  return map[pathname] || 'nav.overview';
}

export default function AdminLayout() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login', { replace: true });
  };

  const today = new Date().toLocaleDateString(getNumberLocale(i18n.language));

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
              <span className='text-lg font-bold text-sidebar-foreground'>{t('app.name')}</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{t('nav.dashboard')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <NavLink to='/admin/dashboard'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <Package className='w-4 h-4' />
                          <span>{t('nav.dashboard')}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <NavLink to='/admin/analysis'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <BarChart3 className='w-4 h-4' />
                          <span>{t('nav.analytics')}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>{t('nav.management')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <NavLink to='/admin/customers'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <ShoppingCart className='w-4 h-4' />
                          <span>{t('nav.customers')}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <NavLink to='/admin/due-customers'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <Wallet className='w-4 h-4' />
                          <span>{t('nav.dueCustomers')}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <NavLink to='/admin/stoke'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <Package className='w-4 h-4' />
                          <span>{t('nav.stock')}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <NavLink to='/admin/collection'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <Boxes className='w-4 h-4' />
                          <span>{t('nav.collection')}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <NavLink to='/admin/sale'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <BaggageClaim className='w-4 h-4' />
                          <span>{t('nav.sales')}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <NavLink to='/admin/inactive'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <ShieldBan className='w-4 h-4' />
                          <span>{t('nav.inactive')}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <NavLink to='/admin/items'>
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          <TableOfContents className='w-4 h-4' />
                          <span>{t('nav.cms')}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>{t('nav.settings')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings className='w-4 h-4' />
                      <span>{t('nav.configuration')}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className='border-t border-sidebar-border'>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className='px-2 pb-2'>
                  <LanguageSwitcher className='w-full justify-stretch [&>button]:flex-1' />
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} className='cursor-pointer'>
                  <LogOut className='w-4 h-4' />
                  <span>{t('nav.logout')}</span>
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
              <h1 className='text-lg font-semibold'>{t(getPageTitleKey(location.pathname))}</h1>
            </div>
            <div className='ml-auto flex items-center gap-2'>
              <LanguageSwitcher className='hidden sm:inline-flex' />
              <Badge variant='outline' className='bg-primary/10 text-primary border-primary/20'>
                <Calendar className='w-3 h-3 mr-1' />
                {t('dashboard.todayBadge', { date: today })}
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
