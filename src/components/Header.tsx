import { useLanguage } from '../contexts/LanguageContext'
import ThemeSwitcher from './ThemeSwitcher'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const { t } = useLanguage()

  return (
    <header className="px-4 sm:px-6 py-4 border-b border-white/10 sticky top-0 z-50 panel">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <img src="/logo.png" alt="Team Logo" className="h-10 sm:h-12 w-auto" />
        <div className="flex-1 min-w-0">
          <div className="text-lg sm:text-xl font-semibold">{t('header.title')}</div>
          <div className="text-xs sm:text-sm label truncate">
            {t('header.subtitle')}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
