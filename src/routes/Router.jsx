import AdminLayout from '@/layouts/AdminLayout';
import CustomerLayout from '@/layouts/CustomerLayout';
import Analysis from '@/pages/admin/analysis/Analysis';
import Customer from '@/pages/admin/customer/Customer';
import Dashboard from '@/pages/admin/Dashboard/Dashboard';
import Details from '@/pages/admin/details/Details';
import DueCustomers from '@/pages/admin/due-customers/DueCustomers';
import Inactive from '@/pages/admin/inactive/Inactive';
import Items from '@/pages/admin/Items/Items';
import AdminLogin from '@/pages/admin/Login/AdminLogin';
import AddSale from '@/pages/admin/sale/components/AddSale';
import EditSale from '@/pages/admin/sale/components/EditSale';
import Sale from '@/pages/admin/sale/Sale';
import AddStoke from '@/pages/admin/stoke/components/AddStoke';
import EditStoke from '@/pages/admin/stoke/components/EditStoke';
import Stoke from '@/pages/admin/stoke/Stoke';
import Collection from '@/pages/collection/Collection';
import CustomerDashboard from '@/pages/customer/CustomerDashboard';
import CustomerDueBills from '@/pages/customer/CustomerDueBills';
import CustomerTransactionDetail from '@/pages/customer/CustomerTransactionDetail';
import CustomerTransactions from '@/pages/customer/CustomerTransactions';
import Home from '@/pages/Home/Home';
import Login from '@/pages/Login/Login';
import { createBrowserRouter, Navigate } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'customers', element: <Customer /> },
      { path: 'due-customers', element: <DueCustomers /> },
      { path: 'customer/:id', element: <Details /> },
      { path: 'stoke', element: <Stoke /> },
      { path: 'stoke/add', element: <AddStoke /> },
      { path: 'stoke/:id', element: <EditStoke /> },
      { path: 'sale', element: <Sale /> },
      { path: 'sale/add', element: <AddSale /> },
      { path: 'sale/:id', element: <EditSale /> },
      { path: 'collection', element: <Collection /> },
      { path: 'inactive', element: <Inactive /> },
      { path: 'items', element: <Items /> },
      { path: 'analysis', element: <Analysis /> },
    ],
  },
  {
    path: '/customer',
    element: <CustomerLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <CustomerDashboard /> },
      { path: 'transactions', element: <CustomerTransactions /> },
      { path: 'transactions/:saleId', element: <CustomerTransactionDetail /> },
      { path: 'due-bills', element: <CustomerDueBills /> },
    ],
  },
]);

export default router;
