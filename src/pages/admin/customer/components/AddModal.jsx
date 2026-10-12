import React, { useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { Save, Phone, MapPin, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import API from '@/config/config';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/common/modal';
import InputField from '@/components/form/InputField';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function matchesHtml(matches, t) {
  if (!matches.length) return '';
  const items = matches
    .map((m) => {
      const pct = m.match_percent != null ? ` · ${Math.round(m.match_percent)}%` : '';
      const reason =
        m.match_reason === 'phone' ? t('customers.matchReasonPhone') : t('customers.matchReasonSimilar');
      return `<li style="text-align:left;margin:0 0 10px;padding-bottom:8px;border-bottom:1px solid #e5e7eb">
        <div style="font-weight:600">${escapeHtml(m.name)} <span style="font-weight:400;font-size:12px;color:#b45309">${escapeHtml(reason)}${escapeHtml(pct)}</span></div>
        <div style="font-size:12px;color:#6b7280">${escapeHtml(m.phone || t('customers.noPhone'))}</div>
        <div style="font-size:12px;color:#6b7280">${escapeHtml(m.address || t('customers.noAddress'))}</div>
      </li>`;
    })
    .join('');

  return `<p style="text-align:left;margin:0 0 8px">${escapeHtml(t('customers.duplicateHint'))}</p>
    <ul style="list-style:none;padding:0;margin:0;max-height:240px;overflow:auto">${items}</ul>`;
}

function normalizePhone(value) {
  return String(value ?? '').replace(/\D/g, '');
}

function phonesMatch(a, b) {
  const na = normalizePhone(a);
  const nb = normalizePhone(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  const ta = na.slice(-11);
  const tb = nb.slice(-11);
  if (ta.length >= 10 && ta === tb) return true;
  return na.endsWith(nb) || nb.endsWith(na);
}

function MatchCard({ customer, t }) {
  return (
    <div className="rounded-lg border border-border/70 bg-background px-3 py-2 text-left">
      <p className="truncate text-sm font-semibold text-foreground">{customer.name || '—'}</p>
      <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
        <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
        <span className="wrap-break-word">{customer.phone || t('customers.noPhone')}</span>
      </p>
      <p className="mt-0.5 flex items-start gap-1.5 text-xs text-muted-foreground">
        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
        <span className="line-clamp-2 wrap-break-word">{customer.address || t('customers.noAddress')}</span>
      </p>
      {customer.match_percent != null && (
        <p className="mt-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
          {t('customers.matchPercent', { percent: Math.round(customer.match_percent) })}
        </p>
      )}
    </div>
  );
}

export default function AddModal({
  openModal,
  setOpenModal,
  title,
  singleData,
  setSingleData,
  onSuccess,
}) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      password: '123456',
    },
  });

  const queryClient = useQueryClient();
  const nameValue = watch('name') || '';
  const phoneValue = watch('phone') || '';

  const { data: allCustomers = [] } = useQuery({
    queryKey: ['all-customers'],
    queryFn: async () => {
      const res = await API.get('/api/customers/all-customers');
      return res.data?.data ?? [];
    },
    enabled: openModal,
    staleTime: 60_000,
  });

  const nameMatches = useMemo(() => {
    const q = String(nameValue).trim().toLowerCase();
    if (q.length < 2) return [];
    return allCustomers
      .filter((customer) => String(customer.name || '').toLowerCase().includes(q))
      .slice(0, 10);
  }, [allCustomers, nameValue]);

  const phoneMatches = useMemo(() => {
    const digits = normalizePhone(phoneValue);
    if (digits.length < 8) return [];
    return allCustomers.filter((customer) => phonesMatch(digits, customer.phone)).slice(0, 10);
  }, [allCustomers, phoneValue]);

  const showNameSuggestions = nameMatches.length > 0;

  const finishSave = (res) => {
    const loginId = res?.data?.customer_login_id;
    toast.success(loginId ? t('customers.savedWithId', { id: loginId }) : t('customers.saved'));
    queryClient.invalidateQueries({ queryKey: ['customer'] });
    queryClient.invalidateQueries({ queryKey: ['all-customers'] });
    onSuccess?.(res?.data);
    reset({ password: '123456' });
    setSingleData?.(null);
    setOpenModal(false);
  };

  const onSubmit = async (data) => {
    const save = (payload) => API.post('/api/customers', payload);

    try {
      toast.loading(t('toast.saving'), { id: 'save-customer' });
      const res = await save(data);
      toast.dismiss('save-customer');
      finishSave(res);
    } catch (error) {
      toast.dismiss('save-customer');
      const body = error.response?.data;
      if (error.response?.status === 409 && body?.requires_confirmation) {
        const hasPhone = (body.phone_matches || []).length > 0;
        const result = await Swal.fire({
          icon: 'warning',
          title: hasPhone ? t('customers.phoneMatchTitle') : t('customers.similarMatchTitle'),
          html: matchesHtml(body.matches || [], t),
          showCancelButton: true,
          confirmButtonColor: '#d97706',
          cancelButtonColor: '#6b7280',
          confirmButtonText: t('customers.addAnyway'),
          cancelButtonText: t('common.cancel'),
        });
        if (!result.isConfirmed) return;

        try {
          toast.loading(t('toast.saving'), { id: 'save-customer' });
          const res = await save({ ...data, force: true });
          toast.dismiss('save-customer');
          finishSave(res);
        } catch (err) {
          toast.dismiss('save-customer');
          toast.error(err.response?.data?.error || err.response?.data?.message || t('toast.somethingWrong'));
        }
        return;
      }

      toast.error(body?.error || body?.message || t('toast.somethingWrong'));
    }
  };

  return (
    <Modal
      open={openModal}
      onOpenChange={setOpenModal}
      title={title ?? ''}
      onClose={() => setSingleData?.(null)}
      className="w-full max-w-lg min-w-0"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="mt-1">
          <InputField
            label={t('customers.name')}
            id="name"
            type="text"
            placeholder={t('customers.namePlaceholder')}
            register={register}
            error={errors.name}
            validation={{ required: t('customers.nameRequired') }}
          />
          {showNameSuggestions && (
            <div className="mt-2 max-h-36 space-y-2 overflow-y-auto rounded-xl border border-amber-500/30 bg-amber-50/80 p-2 sm:max-h-44 dark:bg-amber-950/30">
              <p className="px-1 text-xs font-medium text-amber-800 dark:text-amber-300">
                {t('customers.nameSuggestions')}
              </p>
              {nameMatches.map((customer) => (
                <MatchCard key={customer.id} customer={customer} t={t} />
              ))}
            </div>
          )}
        </div>

        <div>
          <InputField
            label={t('common.phone')}
            id="phone"
            type="number"
            placeholder={t('customers.phonePlaceholder')}
            register={register}
            error={errors.phone}
          />
          {phoneMatches.length > 0 && (
            <div className="mt-2 max-h-36 space-y-2 overflow-y-auto rounded-xl border border-destructive/30 bg-destructive/5 p-3 sm:max-h-44">
              <p className="flex items-start gap-2 text-sm font-medium text-destructive">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{t('customers.phoneMatchWarning')}</span>
              </p>
              {phoneMatches.map((customer) => (
                <MatchCard key={customer.id} customer={customer} t={t} />
              ))}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="address" className="mb-2">{t('common.address')}</Label>
          <Textarea
           {...register('address')}
           error={errors.address}
          />
        </div>
        <div>
          <InputField
            label={t('customers.portalPassword')}
            id="password"
            type="password"
            placeholder={t('customers.passwordPlaceholder')}
            register={register}
            validation={{ required: t('customers.passwordRequired'), minLength: { value: 6, message: t('validation.min6') } }}
            error={errors.password}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {t('customers.portalHint')}
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary-light cursor-pointer font-semibold w-full"
        >
          <Save className="mr-2" /> {isSubmitting ? t('common.submitting') : t('common.submit')}
        </Button>
      </form>
    </Modal>
  );
}
