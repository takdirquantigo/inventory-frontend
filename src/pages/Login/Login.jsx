import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import API from '@/config/config';
import { getDashboardPathByRole } from '@/lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dashboardPath = getDashboardPathByRole();
  if (dashboardPath) {
    return <Navigate to={dashboardPath} replace />;
  }

  const onSubmit = async (data) => {
    toast.promise(
      API.post('/api/customer-auth/login', {
        customer_login_id: data.customer_login_id,
        password: data.password,
      }),
      {
        loading: 'Signing in…',
        success: (res) => {
          const { token, data: customer } = res.data;
          localStorage.setItem('customer_token', token);
          localStorage.setItem('customer', JSON.stringify(customer));
          navigate('/customer/dashboard');
          return 'Welcome';
        },
        error: (err) => err?.response?.data?.error || 'Login failed',
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-center">Customer sign in</h2>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Use your 6-digit customer ID and the password set by the shop.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="customer_login_id">Customer ID</Label>
            <Input
              id="customer_login_id"
              type="text"
              inputMode="numeric"
              autoComplete="username"
              placeholder="e.g. 482391"
              {...register('customer_login_id', { required: 'Customer ID is required' })}
            />
            {errors.customer_login_id && (
              <p className="text-destructive text-sm mt-1">{errors.customer_login_id.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Staff / admin?{' '}
            <Link to="/admin/login" className="text-primary underline-offset-4 hover:underline">
              Admin login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
