import { useSearchParams, Link } from 'react-router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ShipmentTracker from '../components/ShipmentTracker'
import { ShieldCheck, Phone, MapPin, ArrowRight } from 'lucide-react'
import { COMPANY } from '../data/companyInfo'

export default function TrackPage() {
  const [searchParams] = useSearchParams()
  const initialId = searchParams.get('id') || ''

  return (
    <div className="min-h-screen bg-[#040e18] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="shell space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400 mb-2 inline-block">
              LIVE CARGO VISIBILITY
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Track Your Consignment
            </h1>
            <p className="text-sm md:text-base text-white/60 mt-3">
              Real-time milestone tracking for International Air Cargo (RGIA), Ocean Freight (ICD Sanathnagar), and Express Courier shipments.
            </p>
          </div>

          {/* Tracker Component */}
          <ShipmentTracker initialTrackingId={initialId} />

          {/* Helpful Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div className="bg-[#071726] border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-3">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-bold text-base text-white mb-1">Authentic AWB Milestones</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Checkpoints are synchronized directly from RGIA Air Cargo Terminal, ICD Sanathnagar Dry Port, and destination partner carriers.
              </p>
            </div>

            <div className="bg-[#071726] border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Phone size={20} />
              </div>
              <h4 className="font-bold text-base text-white mb-1">24/7 Operations Desk</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Require urgent re-routing or customs assistance? Call our Begumpet operations desk directly at{' '}
                <a href={`tel:${COMPANY.phoneRaw}`} className="text-white font-bold underline">
                  {COMPANY.phone}
                </a>
                .
              </p>
            </div>

            <div className="bg-[#071726] border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
                <MapPin size={20} />
              </div>
              <h4 className="font-bold text-base text-white mb-1">Begumpet Head Office</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Drop in at Bharani Complex, Minister Road, Begumpet (near KIMS Hospital) for physical document submissions or booking receipt collection.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
