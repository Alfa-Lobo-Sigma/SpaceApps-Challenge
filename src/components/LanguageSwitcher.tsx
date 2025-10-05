import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const { theme } = useTheme()

  const isDark = theme === 'dark'

  return (
    <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.08)' }}>
      <button
        onClick={() => setLanguage('en')}
        className="px-3 py-1 rounded text-sm font-medium transition-colors"
        style={{
          backgroundColor: language === 'en' ? (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.12)') : 'transparent',
          color: language === 'en' ? 'var(--text-primary)' : 'var(--text-secondary)',
        }}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('es')}
        className="px-3 py-1 rounded text-sm font-medium transition-colors"
        style={{
          backgroundColor: language === 'es' ? (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.12)') : 'transparent',
          color: language === 'es' ? 'var(--text-primary)' : 'var(--text-secondary)',
        }}
      >
        ES
      </button>
    </div>
  )
}
