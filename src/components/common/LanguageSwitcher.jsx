import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher({ className }) {
  const { i18n, t } = useTranslation();
  const current = i18n.language?.startsWith('bn') ? 'bn' : 'en';

  const setLang = (lng) => {
    if (lng !== current) i18n.changeLanguage(lng);
  };

  return (
    <div
      role='group'
      aria-label={t('lang.switch')}
      className={cn('inline-flex overflow-hidden rounded-md border border-border bg-background text-xs font-semibold', className)}>
      <button
        type='button'
        onClick={() => setLang('en')}
        className={cn('cursor-pointer px-2.5 py-1 transition-colors', current === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>
        {t('lang.en')}
      </button>
      <button
        type='button'
        onClick={() => setLang('bn')}
        className={cn('cursor-pointer px-2.5 py-1 transition-colors', current === 'bn' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>
        {t('lang.bn')}
      </button>
    </div>
  );
}
