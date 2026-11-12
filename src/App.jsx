import { lazy, Suspense, useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDarkMode } from './hooks/useDarkMode'
import { useScrollPosition } from './hooks/useScrollPosition'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import ThemeMenu from './components/ThemeMenu'
import NotFound from './components/NotFound'
import SearchModal from './components/SearchModal'
import TerminalWidget from './components/TerminalWidget'
import AudioPlayer from './components/AudioPlayer'

const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const WorksPage = lazy(() => import('./pages/WorksPage'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const TimelinePage = lazy(() => import('./pages/TimelinePage'))
const ResumePage = lazy(() => import('./pages/ResumePage'))
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'))
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'))
const BooksPage = lazy(() => import('./pages/BooksPage'))
const SkillsPage = lazy(() => import('./pages/SkillsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NowPage = lazy(() => import('./pages/NowPage'))
const FriendsPage = lazy(() => import('./pages/FriendsPage'))
const TagPage = lazy(() => import('./pages/TagPage'))

function App() {
  const [dark, toggleDark] = useDarkMode()
  const scrollY = useScrollPosition()
  const [searchOpen, setSearchOpen] = useState(false)

  // Ctrl+K / Cmd+K 打开搜索
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className="min-h-screen transition-colors duration-400">
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <main>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/works" element={<WorksPage />} />
            <Route path="/works/:id" element={<ProjectDetailPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:id" element={<ArticleDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/now" element={<NowPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/tags/:tag" element={<TagPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ThemeMenu dark={dark} toggleDark={toggleDark} />
      {scrollY > 300 && <BackToTop />}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <TerminalWidget />
      <AudioPlayer />
    </div>
  )
}

export default App
