import { useLanguage } from '../contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-8 px-4 sm:px-6 py-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <img src="/logo.png" alt="Team Logo" className="h-16 w-auto" />
        </div>
        <div className="text-center text-xs sm:text-sm label">
          {t('footer.developed')}
        </div>
      </div>
    </footer>
  )
}
