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
    <header className="px-6 py-4 border-b sticky top-0 z-[900] panel" style={{ borderColor: 'var(--border-color)' }}>
      <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img src="/favicon.ico" alt="Impactor-2025 Logo" className="h-10 w-10" />
          <div>
            <div className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{t('header.title')}</div>
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
            className="self-start rounded-full border px-4 py-2 text-sm font-medium transition-all hover:shadow-md"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--metric-bg)',
              color: 'var(--text-primary)'
            }}
          >
            {t('tutorial.welcome')}
          </button>
          <button
            type="button"
            onClick={onPreparednessClick}
            className="self-start rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-all hover:shadow-md"
            style={{
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--metric-bg)',
              color: 'var(--text-primary)'
            }}
          >
            {t('preparedness.title')}
          </button>
        </div>
      </div>
    </header>
  )
}
