import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Hub from './pages/Hub'
import Mentorship from './pages/Mentorship'
import Coaching from './pages/Coaching'
import About from './pages/About'
import ResourcePage from './pages/ResourcePage'
import NotFound from './pages/NotFound'
import MentorPortal from './pages/MentorPortal'
import Admin from './pages/Admin'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hub" element={<Hub />} />
            <Route path="/resources/:slug" element={<ResourcePage />} />
            <Route path="/mentorship" element={<Mentorship />} />
            <Route path="/coaching" element={<Coaching />} />
            <Route path="/about" element={<About />} />
            <Route path="/mentor-portal" element={<MentorPortal />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
