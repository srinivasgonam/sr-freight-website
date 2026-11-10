import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BrandLogo from '../components/BrandLogo'
import { Link } from 'react-router'
import {
  ShieldCheck,
  Award,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
  Star,
} from 'lucide-react'
import { COMPANY, REAL_REVIEWS } from '../data/companyInfo'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#040e18] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="shell space-y-16">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400 mb-2 inline-block">
              28+ YEARS OF LOGISTICS INTEGRITY (EST. 1995)
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              About S R Freight
            </h1>
            <p className="text-sm md:text-base text-white/60 mt-4 leading-relaxed">
              Founded and spearheaded by <b>Mr. C.N. Rajendra Kumar</b>, S R Freight is Hyderabad’s trusted partner for international air cargo, ocean container shipping, customs clearance, and global express courier.
            </p>
          </div>

          {/* Founder & Heritage Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#071726] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="lg:col-span-5 space-y-4">
              <div className="aspect-square bg-gradient-to-tr from-[#0a253d] to-[#123658] border border-white/15 rounded-2xl flex flex-col items-center justify-center text-center p-8 relative overflow-hidden shadow-inner">
                <div className="mb-4">
                  <BrandLogo iconOnly size="lg" />
                </div>
                <h3 className="text-xl font-black text-white">{COMPANY.founder}</h3>
                <span className="text-xs text-orange-400 font-bold uppercase tracking-wider mt-1">
                  Managing Director & Founder
                </span>
                <p className="text-xs text-white/60 mt-3 max-w-xs">
                  28+ years steering international cargo logistics across Begumpet, Hyderabad, and overseas destinations.
                </p>

                <div className="mt-4 pt-4 border-t border-white/10 w-full flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold">
                  <Star size={14} className="fill-emerald-400" />
                  <span>5.0 Star Customer Service Rating</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400 block mb-1">
                  THE S R FREIGHT STORY
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Built on Reliability, Personal Accountability & Local Expertise
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                In 1995, Mr. C.N. Rajendra Kumar established S.R. Freight in Begumpet with a clear mission: to provide Hyderabad businesses and residents with reliable, transparent, and personally managed international shipping solutions.
              </p>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Over the past nearly three decades, Hyderabad transformed into India’s pharmaceutical and technology powerhouse. Throughout this evolution, S R Freight expanded its capabilities—establishing priority cold-chain air allocations at Rajiv Gandhi International Airport (RGIA), container operations via ICD Sanathnagar, and a dedicated worldwide express courier network serving Australia, the USA, the UK, and the Middle East.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="text-2xl font-black text-orange-400 font-mono block">1995</span>
                  <span className="text-white/60 text-[11px]">Year Established</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-emerald-400 font-mono block">28+</span>
                  <span className="text-white/60 text-[11px]">Years of Service</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-sky-400 font-mono block">220+</span>
                  <span className="text-white/60 text-[11px]">Global Destinations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 bg-[#071726] border border-white/10 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-bold text-lg text-white">Strict Regulatory Compliance</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                We manage complete Custom House Agent (CHA) compliance, HS code validation, ICEGATE e-filing, and DGFT licensing to eliminate customs holds or demurrage fees.
              </p>
            </div>

            <div className="p-7 bg-[#071726] border border-white/10 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Clock size={24} />
              </div>
              <h4 className="font-bold text-lg text-white">Guaranteed Punctuality</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Time-critical pharma shipments, university courier packages, and scheduled container sailings are tracked 24/7 with proactive milestone updates.
              </p>
            </div>

            <div className="p-7 bg-[#071726] border border-white/10 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Users size={24} />
              </div>
              <h4 className="font-bold text-lg text-white">Personal Client Care</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Unlike impersonal multinational mega-forwarders, every client at S R Freight has direct telephone and WhatsApp access to our Begumpet leadership and operations desk.
              </p>
            </div>
          </div>

          {/* Real Reviews & Testimonials */}
          <div className="bg-[#071726] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                  CLIENT SATISFACTION
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  What Our Shippers & Exporters Say
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-white">5.0 / 5.0</span>
                <span className="text-white/40">• Google Business Rating</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {REAL_REVIEWS.map((rev, idx) => (
                <div key={idx} className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">
                      {rev.highlight}
                    </span>
                    <span className="text-[10px] text-white/40">{rev.date}</span>
                  </div>
                  <p className="text-xs text-white/80 italic leading-relaxed">"{rev.text}"</p>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <b className="text-white font-bold block">{rev.author}</b>
                      <span className="text-[11px] text-white/50">{rev.role}</span>
                    </div>
                    {rev.verified && (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Verified Shipper
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Banner */}
          <div className="p-8 sm:p-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Ready to Ship with S R Freight?
              </h3>
              <p className="text-xs sm:text-sm text-white/90">
                Contact our Begumpet head office for personalized advice and immediate tariff quotes.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`tel:${COMPANY.phoneRaw}`}
                className="glass-btn-orange px-6 py-3.5 text-white font-bold rounded-xl text-xs flex items-center gap-2"
              >
                <Phone size={14} className="text-white" />
                <span>Call {COMPANY.phone}</span>
              </a>
              <Link
                to="/contact"
                className="glass-btn-frosted px-6 py-3.5 text-white font-bold rounded-xl text-xs flex items-center gap-2"
              >
                <span>Visit Office Map</span> <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
