import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import API from '@/config/config';
import { getDashboardPathByRole } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
        loading: t('login.signingIn'),
        success: (res) => {
          const { token, data: user } = res.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/admin/dashboard');
          return t('login.welcomeBack');
        },
        error: (err) => err?.response?.data?.error || t('login.loginFailed'),
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-lg">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-center">{t('login.title')}</h2>
          <p className="text-sm text-muted-foreground text-center mt-2">
            {t('login.subtitle')}
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="email">{t('login.emailOrClientId')}</Label>
            <Input
              id="email"
              type="text"
              autoComplete="username"
              {...register('email', { required: t('common.required') })}
            />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">{t('login.password')}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password', { required: t('common.required') })}
            />
            {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full">
            {t('login.signIn')}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            {t('login.customerQuestion')}{' '}
            <Link to="/login" className="text-primary underline-offset-4 hover:underline">
              {t('login.customerLogin')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
