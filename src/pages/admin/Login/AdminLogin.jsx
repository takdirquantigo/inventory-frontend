import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import API from '@/config/config';
import { getDashboardPathByRole } from '@/lib/auth';

export default function AdminLogin() {
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
      API.post('/api/auth/login', data),
      {
        loading: 'Signing in...',
        success: (res) => {
          const { token, data: user } = res.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/admin/dashboard');
          return 'Welcome back';
        },
        error: (err) => err?.response?.data?.error || 'Login failed',
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-center">Admin sign in</h2>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Staff access — email or client ID and password
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="email">Email or client ID</Label>
            <Input
              id="email"
              type="text"
              autoComplete="username"
              {...register('email', { required: 'Required' })}
            />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password', { required: 'Required' })}
            />
            {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Customer?{' '}
            <Link to="/login" className="text-primary underline-offset-4 hover:underline">
              Customer login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
