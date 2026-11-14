import { Link } from 'react-router'
import BrandLogo from './BrandLogo'
import { Phone, Mail, MapPin, Clock, ArrowUpRight, MessageCircle, ShieldCheck } from 'lucide-react'
import { COMPANY } from '../data/companyInfo'

export default function Footer() {
  return (
    <footer className="bg-[#040c16] text-white pt-16 pb-10 border-t border-white/10">
      <div className="shell">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-b border-white/10">
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 transition hover:opacity-95">
              <BrandLogo size="md" />
            </Link>

            <p className="text-sm text-ink-3 leading-relaxed">
              Established in 1995 with over 28+ years of dedicated freight experience. Operating as Hyderabad’s premier international freight forwarder, customs broker, and global courier partner.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-semibold">
              <ShieldCheck size={16} />
              <span>5.0 / 5.0 Google Verified Business</span>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/919391032794?text=Hi%20SR%20Freight,%20I%20would%20like%20to%20inquire%20about%20cargo%20services"
                target="_blank"
                rel="noreferrer"
                className="glass-btn-emerald inline-flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold"
              >
                <MessageCircle size={14} /> <span>WhatsApp Support Desk</span>
              </a>
            </div>
          </div>

          {/* Column 2: Core Services */}
          <div>
            <h4 className="text-xs font-display font-bold tracking-widest text-orange-400 uppercase mb-4">
              Services & Operations
            </h4>
            <ul className="space-y-2.5 text-xs text-ink-2">
              <li>
                <Link to="/services/air-freight" className="hover:text-white transition flex items-center justify-between">
                  <span>International Air Cargo (RGIA)</span>
                  <ArrowUpRight size={12} className="text-white/30" />
                </Link>
              </li>
              <li>
                <Link to="/services/ocean-freight" className="hover:text-white transition flex items-center justify-between">
                  <span>Ocean FCL & LCL (ICD Sanathnagar)</span>
                  <ArrowUpRight size={12} className="text-white/30" />
                </Link>
              </li>
              <li>
                <Link to="/services/door-to-door" className="hover:text-white transition flex items-center justify-between">
                  <span>Worldwide Express Courier</span>
                  <ArrowUpRight size={12} className="text-white/30" />
                </Link>
              </li>
              <li>
                <Link to="/services/customs-clearance" className="hover:text-white transition flex items-center justify-between">
                  <span>Customs House Agent (CHA)</span>
                  <ArrowUpRight size={12} className="text-white/30" />
                </Link>
              </li>
              <li>
                <Link to="/services/warehousing" className="hover:text-white transition flex items-center justify-between">
                  <span>Warehousing & Distribution</span>
                  <ArrowUpRight size={12} className="text-white/30" />
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="text-orange-400 hover:text-orange-300 font-semibold transition flex items-center justify-between">
                  <span>Instant Freight Rate Estimator</span>
                  <ArrowUpRight size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Begumpet Office & Contacts */}
          <div>
            <h4 className="text-xs font-display font-bold tracking-widest text-orange-400 uppercase mb-4">
              Begumpet Head Office
            </h4>
            <address className="not-italic text-xs text-ink-2 space-y-3">
              <p className="flex items-start gap-2.5">
                <MapPin size={16} className="text-orange-400 shrink-0 mt-0.5" />
                <span>
                  Flat No. 43 / F-55, 2nd Floor, Bharani Complex, Near KIMS Hospital & Passport Seva Kendra, Minister Road, Begumpet, Hyderabad — 500003
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone size={15} className="text-emerald-400 shrink-0" />
                <a href={`tel:${COMPANY.phoneRaw}`} className="text-white font-bold hover:text-orange-400 transition">
                  {COMPANY.phone}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone size={15} className="text-ink-4 shrink-0" />
                <span>Office: {COMPANY.landline}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail size={15} className="text-orange-400 shrink-0" />
                <a href={`mailto:${COMPANY.email}`} className="hover:text-white transition">
                  {COMPANY.email}
                </a>
              </p>
            </address>
          </div>

          {/* Column 4: Operational Hubs & Timings */}
          <div>
            <h4 className="text-xs font-display font-bold tracking-widest text-orange-400 uppercase mb-4">
              Timings & Key Hubs
            </h4>
            <div className="space-y-3 text-xs text-ink-2">
              <div className="flex items-start gap-2">
                <Clock size={15} className="text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">{COMPANY.workingHours.weekdays}</span>
                  <span className="text-[12px] text-emerald-400 font-medium">24/7 Operations Desk for Live Air Cargo</span>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                <span className="text-[11px] text-ink-4 uppercase tracking-widest font-bold block">
                  Hyderabad Logistics Gateways
                </span>
                <span className="text-white font-medium block text-[12px]">• Air Cargo: RGIA Airport (HYD)</span>
                <span className="text-white font-medium block text-[12px]">• Ocean Dry Port: ICD Sanathnagar</span>
                <span className="text-white font-medium block text-[12px]">• Gateway Seaports: JNPT & Chennai</span>
              </div>

              <div className="pt-1">
                <Link
                  to="/admin"
                  className="text-[12px] text-ink-4 hover:text-white transition flex items-center gap-1 font-display uppercase tracking-wider"
                >
                  Admin / Operations Portal
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-4">
          <p>© {new Date().getFullYear()} S R Freight (S.R. Freight Logistics & Transport). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white transition">About</Link>
            <Link to="/services" className="hover:text-white transition">Services</Link>
            <Link to="/track" className="hover:text-white transition">Track</Link>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
            <a href={COMPANY.address.googleMapsUrl} target="_blank" rel="noreferrer" className="text-orange-400 hover:text-orange-300 transition">
              Google Maps
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
