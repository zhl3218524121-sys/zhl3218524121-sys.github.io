import SocialIcons from './SocialIcons'
import { useJsonData } from '../hooks/useJsonData'

export default function Footer() {
  const { data: config } = useJsonData('/data/config.json')

  return (
    <footer className="border-t border-stone-200/30 dark:border-stone-700/30">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm opacity-40">
          © {new Date().getFullYear()} {config?.site?.name || 'ZMING'}. All rights reserved.
        </div>
        <SocialIcons social={config?.social} />
      </div>
    </footer>
  )
}
