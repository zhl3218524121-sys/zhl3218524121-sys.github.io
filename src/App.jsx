import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDarkMode } from './hooks/useDarkMode'
import { useScrollPosition } from './hooks/useScrollPosition'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import ThemeMenu from './components/ThemeMenu'
import NotFound from './components/NotFound'

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

function App() {
  const [dark, toggleDark] = useDarkMode()
  const scrollY = useScrollPosition()

  return (
    <div className="min-h-screen transition-colors duration-400">
      <Navbar />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ThemeMenu dark={dark} toggleDark={toggleDark} />
      <BackToTop />
    </div>
  )
}

export default App
