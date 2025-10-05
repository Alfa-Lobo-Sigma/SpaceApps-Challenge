import type { MouseEventHandler } from 'react'
import ThemeSwitcher from './ThemeSwitcher'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../contexts/LanguageContext'

type HeaderProps = {
  onPreparednessClick: MouseEventHandler<HTMLButtonElement>
  onTutorialClick: MouseEventHandler<HTMLButtonElement>
}

export default function Header({ onPreparednessClick, onTutorialClick }: HeaderProps) {
  const { t } = useLanguage()

  return (
    <header className="px-6 py-4 border-b border-white/10 sticky top-0 z-[900] panel">
      <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <img src="/logo.png" alt="Team Logo" className="h-12 w-auto" />
          <div>
            <div className="text-xl font-semibold">{t('header.title')}</div>
            <div className="text-xs sm:text-sm label">
              {t('header.subtitle')}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <button
            type="button"
            onClick={onTutorialClick}
            className="self-start rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/40 hover:bg-white/15"
          >
            {t('tutorial.welcome')}
          </button>
          <button
            type="button"
            onClick={onPreparednessClick}
            className="self-start rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:border-white/40 hover:bg-white/20"
          >
            {t('preparedness.title')}
          </button>
        </div>
      </div>
    </header>
  )
}
