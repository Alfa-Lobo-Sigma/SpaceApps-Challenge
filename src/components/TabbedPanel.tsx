import { useState, ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface TabbedPanelProps {
  tabs: Tab[]
  className?: string
}

export default function TabbedPanel({ tabs, className = '' }: TabbedPanelProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '')

  if (tabs.length === 0) return null

  return (
    <div className={`panel rounded-2xl ${className}`}>
      {/* Tab Headers */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex flex-wrap gap-2 px-5 pt-5" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-2 px-3 rounded-t-lg border-b-2 font-medium text-sm transition-all duration-200 ease-in-out
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800/50'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`transition-opacity duration-200 ${activeTab === tab.id ? 'block opacity-100' : 'hidden opacity-0'}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}