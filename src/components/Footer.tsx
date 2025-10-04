import { useLanguage } from '../contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-8 px-4 sm:px-6 py-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto text-center text-xs sm:text-sm label">
        {t('footer.developed')}
      </div>
    </footer>
  )
}
