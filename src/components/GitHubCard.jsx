export default function GitHubCard({ username }) {
  if (!username) return null
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium opacity-60 tracking-wide">GitHub</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl overflow-hidden border border-stone-200/40 dark:border-stone-700/40 hover:opacity-90 transition-opacity"
        >
          <img
            src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=transparent&hide_border=true&title_color=currentColor&text_color=currentColor&icon_color=currentColor`}
            alt="GitHub Stats"
            className="w-full sm:w-80"
            loading="lazy"
          />
        </a>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl overflow-hidden border border-stone-200/40 dark:border-stone-700/40 hover:opacity-90 transition-opacity"
        >
          <img
            src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=transparent&hide_border=true&title_color=currentColor&text_color=currentColor`}
            alt="Top Languages"
            className="w-full sm:w-64"
            loading="lazy"
          />
        </a>
      </div>
    </div>
  )
}
