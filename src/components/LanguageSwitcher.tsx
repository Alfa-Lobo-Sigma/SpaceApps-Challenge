import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex gap-1 p-1 rounded-lg bg-white/5">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-white/10 text-white'
            : 'text-white/60 hover:text-white/80'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('es')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'es'
            ? 'bg-white/10 text-white'
            : 'text-white/60 hover:text-white/80'
        }`}
      >
        ES
      </button>
    </div>
  )
}
