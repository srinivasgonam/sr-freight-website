import { createBrowserRouter } from 'react-router'
import HomePage from '../pages/HomePage'
import ServicesPage from '../pages/ServicesPage'
import TrackPage from '../pages/TrackPage'
import CalculatorPage from '../pages/CalculatorPage'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import AdminPortal from '../pages/AdminPortal'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#040e18] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <span className="text-4xl font-black font-mono text-orange-400">404</span>
          <h1 className="text-2xl font-bold text-white">This Route Has Moved</h1>
          <p className="text-xs text-white/60">
            The page you requested is not available, but your next shipment can still start right here.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition"
            >
              <ArrowLeft size={14} /> Back to Homepage
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export const router = createBrowserRouter([
  { path: '/', Component: HomePage },
  { path: '/services', Component: ServicesPage },
  { path: '/services/:serviceSlug', Component: ServicesPage },
  { path: '/track', Component: TrackPage },
  { path: '/calculator', Component: CalculatorPage },
  { path: '/about', Component: AboutPage },
  { path: '/contact', Component: ContactPage },
  { path: '/admin', Component: AdminPortal },
  { path: '*', Component: NotFoundPage },
])
