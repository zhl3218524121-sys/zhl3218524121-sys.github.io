import { Routes, Route } from 'react-router-dom'
import { useDarkMode } from './hooks/useDarkMode'
import { useScrollPosition } from './hooks/useScrollPosition'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import ThemeMenu from './components/ThemeMenu'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import WorksPage from './pages/WorksPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import GalleryPage from './pages/GalleryPage'
import TimelinePage from './pages/TimelinePage'
import ResumePage from './pages/ResumePage'
import ArticlesPage from './pages/ArticlesPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import BooksPage from './pages/BooksPage'
import SkillsPage from './pages/SkillsPage'
import ContactPage from './pages/ContactPage'
import NotFound from './components/NotFound'

function App() {
  const [dark, toggleDark] = useDarkMode()
  const scrollY = useScrollPosition()

  return (
    <div className="min-h-screen transition-colors duration-400">
      <Navbar />
      <main>
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
      </main>
      <Footer />
      <ThemeMenu dark={dark} toggleDark={toggleDark} />
      <BackToTop />
    </div>
  )
}

export default App
