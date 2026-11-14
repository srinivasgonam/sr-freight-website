import { useState } from 'react'
import { Link } from 'react-router'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MagicRings from './components/MagicRings'
import ShipmentTracker from './components/ShipmentTracker'
import RateCalculator from './components/RateCalculator'
import QuoteForm from './components/QuoteForm'
import { Reveal, CountUp, spotlight } from './components/Effects'
import {
  Plane,
  Ship,
  PackageCheck,
  ShieldCheck,
  Warehouse,
  Boxes,
  ArrowRight,
  Star,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  ExternalLink,
  ChevronDown,
  MessageCircle,
  Award,
  FileText,
  Truck,
  Globe2,
  Headphones,
} from 'lucide-react'
import { COMPANY, SERVICES_LIST, REAL_REVIEWS, FAQS } from './data/companyInfo'

const ICONS_MAP: Record<string, any> = {
  Plane,
  Ship,
  PackageCheck,
  ShieldCheck,
  Warehouse,
  Boxes,
}

export default function App() {
  const [activeToolTab, setActiveToolTab] = useState<'track' | 'calculate'>('track')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-[#040e18] text-white flex flex-col selection:bg-orange-600 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* ================= HERO SECTION ================= */}
        <section className="hero relative overflow-hidden" id="home">
          {/* Unsplash Background & Radial Gradients */}
          <div className="heroImage" aria-hidden="true" />
          <div className="heroShade" />

          {/* Glowing Animated Radar Rings (MagicRings) */}
          <div className="heroRings" aria-hidden="true">
            <MagicRings
              color="#4cc2ff"
              colorTwo="#2f6fe4"
              ringCount={6}
              motion="pulse"
              speed={1.1}
              glow={1.4}
              lineThickness={2}
              followMouse={true}
              mouseInfluence={0.2}
              hoverScale={1.25}
              hoverIntensity={1.2}
              parallax={0.06}
              clickBurst={true}
              intro={true}
              theme="dark"
              className="w-full h-full"
            />
          </div>

          <div className="heroContent shell relative z-10 py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Hero Text */}
              <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white/10 border border-white/15 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-orange-300">
                  <span className="w-2 h-2 shrink-0 rounded-full bg-orange-500 animate-pulse" />
                  <span>Hyderabad’s Premier Freight & Cargo Forwarder · Est. 1995</span>
                </div>

                <h1 className="text-[2.6rem] sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.04] drop-shadow-[0_8px_40px_rgba(0,0,0,.45)]">
                  Your cargo. <br />
                  <em className="gradient-text not-italic font-semibold">Across borders.</em>
                </h1>

                <p className="text-base sm:text-lg text-ink-2 max-w-xl leading-relaxed">
                  Headquartered in Begumpet, Hyderabad, with{' '}
                  <strong className="font-bold text-orange-300">28+ years of proven logistics experience</strong>.
                  Seamless Air Cargo (RGIA), Ocean Container Shipping (ICD Sanathnagar), Customs Clearance & Worldwide Courier.
                </p>

                {/* Primary Hero Actions */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                  <a
                    href="#quote"
                    className="glass-btn-orange px-6 sm:px-7 py-3.5 text-white font-bold rounded-xl transition flex items-center gap-2 text-sm tracking-wide"
                  >
                    <span>Plan your shipment</span> <ArrowRight size={16} />
                  </a>
                  <Link
                    to="/services"
                    className="glass-btn-frosted px-5 sm:px-6 py-3.5 text-white font-semibold rounded-xl transition text-sm flex items-center gap-2"
                  >
                    <span>Explore services</span>
                  </Link>
                </div>

                {/* Quick Stats in Hero */}
                <div className="stat-row pt-7 mt-2 border-t border-white/10 max-w-xl">
                  <div>
                    <span className="stat-num"><CountUp to={28} /><em>+</em></span>
                    <span className="text-ink-3 text-xs sm:text-sm block mt-1">Years in freight, since 1995</span>
                  </div>
                  <div>
                    <span className="stat-num"><CountUp to={220} /><em>+</em></span>
                    <span className="text-ink-3 text-xs sm:text-sm block mt-1">Global destinations served</span>
                  </div>
                  <div>
                    <span className="stat-num flex items-center gap-1.5">5.0 <Star size={20} className="fill-amber-400 text-amber-400" /></span>
                    <span className="text-ink-3 text-xs sm:text-sm block mt-1">Google verified rating</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Shipment Card (Fitted & Next-Gen) */}
              <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
                <div className="shipmentCard relative w-full max-w-sm sm:max-w-[360px] rounded-3xl p-5 shadow-2xl backdrop-blur-2xl bg-[#061726]/90 text-white border border-white/15 hover:border-orange-500/40 transition-all duration-300 overflow-hidden group">
                  {/* Glowing Top Accent Strip */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-80" />

                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                    <span className="text-[11px] font-display font-bold tracking-widest text-ink-4 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      LIVE CONSIGNMENT
                    </span>
                    <span className="text-[12px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> In Transit
                    </span>
                  </div>

                  {/* Route Visual */}
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-3 my-4">
                    <div>
                      <strong className="text-xl sm:text-2xl font-black text-white font-display block tracking-tight">HYD</strong>
                      <small className="text-[11px] text-ink-4 block font-medium">Rajiv Gandhi Int’l</small>
                    </div>

                    <div className="flex flex-col items-center px-1 pt-3">
                      <div className="w-full relative flex items-center justify-center">
                        <div className="w-full border-t border-dashed border-white/20" />
                        <div className="absolute px-2 py-1 bg-[#0e2c47] border border-orange-500/40 rounded-full text-orange-400 text-xs shadow-md shadow-orange-500/20 transform group-hover:translate-x-1.5 transition-transform duration-300">
                          <Plane size={13} />
                        </div>
                      </div>
                      <span className="text-[10px] font-display font-bold text-orange-400/90 mt-4 uppercase tracking-wider whitespace-nowrap">
                        Air Express
                      </span>
                    </div>

                    <div className="text-right">
                      <strong className="text-xl sm:text-2xl font-black text-white font-display block tracking-tight">DXB</strong>
                      <small className="text-[11px] text-ink-4 block font-medium">Dubai Airport Hub</small>
                    </div>
                  </div>

                  {/* Consignment Metadata Grid */}
                  <div className="grid grid-cols-2 gap-2.5 py-3 border-t border-b border-white/10 text-xs">
                    <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                      <span className="text-[10px] text-ink-4 uppercase font-display font-bold block mb-0.5">AWB Number</span>
                      <span className="font-mono font-bold text-orange-300 text-xs block">SR-HYD-98241</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                      <span className="text-[10px] text-ink-4 uppercase font-display font-bold block mb-0.5">Flight Carrier</span>
                      <span className="font-bold text-white text-xs block truncate">EK-527 Cargo</span>
                    </div>
                  </div>

                  {/* Estimated Arrival Banner */}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-ink-3 text-[12px]">Estimated Arrival:</span>
                    <span className="font-bold text-emerald-400 text-xs font-mono">Tomorrow, 14:30 GST</span>
                  </div>

                  {/* Action Link */}
                  <Link
                    to="/track?id=SR-HYD-98241"
                    className="glass-btn-orange mt-3.5 w-full py-2.5 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <span>View Real-time Checkpoints</span> <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <a href="#trust" aria-label="Scroll down" className="scroll-cue hidden lg:flex" />
        </section>

        {/* ================= TRUST STRIP ================= */}
        <section id="trust" className="trust-glass py-7">
          <div className="shell">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-5 gap-y-6 text-left">
              {[
                ['Experience', '28+ Years', 'Est. 1995, Begumpet'],
                ['Air Cargo', 'RGIA Airside Hub', 'IATA standard freight'],
                ['Ocean Freight', 'ICD Sanathnagar', 'Direct rail to ports'],
                ['Compliance', 'Accredited CHA', 'Fast customs clearance'],
                ['Worldwide Courier', 'Australia & USA', 'Door pickup in Hyderabad'],
                ['Rating', '5.0 / 5.0 Stars', 'Google verified business'],
              ].map(([label, title, note]) => (
                <div key={label} className="trust-item">
                  <span className="text-[11px] font-display font-bold uppercase tracking-[0.14em] text-orange-400 block">{label}</span>
                  <b className="text-sm font-display font-bold text-white block mt-0.5">{title}</b>
                  <small className="text-[12px] text-ink-3 block">{note}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= INTERACTIVE TRACK & CALCULATOR TOOL SUITE ================= */}
        <section className="py-16 md:py-20 section-glow" id="tools">
          <div className="shell space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="eyebrow mb-3">
                  CUSTOMER SELF-SERVICE
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white">Live Logistics Command Center</h2>
              </div>

              {/* Tool Tab Switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/15 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => setActiveToolTab('track')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${activeToolTab === 'track'
                    ? 'glass-tab-active'
                    : 'glass-tab-inactive'
                    }`}
                >
                  Track Consignment
                </button>
                <button
                  type="button"
                  onClick={() => setActiveToolTab('calculate')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${activeToolTab === 'calculate'
                    ? 'glass-tab-active'
                    : 'glass-tab-inactive'
                    }`}
                >
                  Rate Calculator
                </button>
              </div>
            </div>

            {/* Render selected tool */}
            {activeToolTab === 'track' ? (
              <div className="pt-2 animate-in fade-in duration-200">
                <ShipmentTracker />
              </div>
            ) : (
              <div className="pt-2 animate-in fade-in duration-200">
                <RateCalculator />
              </div>
            )}
          </div>
        </section>

        {/* ================= CORE SERVICES ================= */}
        <section className="py-20 section-glow" id="services">
          <div className="shell space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="eyebrow mb-3">
                  WHAT WE MOVE
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Logistics that keeps your business moving.
                </h2>
              </div>
              <Link
                to="/services"
                className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1.5 transition"
              >
                View all capabilities <ArrowRight size={14} />
              </Link>
            </div>

            <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES_LIST.map((srv, idx) => {
                const Icon = ICONS_MAP[srv.icon] || Plane
                return (
                  <article
                    key={srv.id}
                    onMouseMove={spotlight} className="glass-card rounded-3xl p-7 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-md">
                          <Icon size={24} />
                        </div>
                        <span className="font-mono text-xs text-ink-4 font-bold">0{idx + 1}</span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition">
                        {srv.title}
                      </h3>
                      <p className="text-sm text-ink-3 leading-relaxed mb-5">{srv.shortDesc}</p>

                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {srv.badges.map((b) => (
                          <span
                            key={b}
                            className="text-[11px] px-2.5 py-1 bg-white/5 rounded-md text-ink-2 font-semibold border border-white/5"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[12px] text-amber-300/80 font-medium flex items-center gap-1">
                        <Clock size={11} /> {srv.transitTime}
                      </span>
                      <Link
                        to={`/services/${srv.slug}`}
                        className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition"
                      >
                        Learn more <ArrowRight size={13} />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </Reveal>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="py-20 section-glow" id="process">
          <div className="shell space-y-12">
            <Reveal className="text-center max-w-2xl mx-auto space-y-2">
              <span className="eyebrow mb-3">HOW IT WORKS</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                From first call to <span className="gradient-text">final delivery</span>
              </h2>
              <p className="text-xs sm:text-sm text-ink-3">Four simple steps, one accountable team in Begumpet.</p>
            </Reveal>
            <Reveal className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="step-line" aria-hidden="true" />
              {[
                { Icon: Headphones, t: 'Share Requirements', d: 'Tell us cargo, route and timeline — we reply with a binding quote fast.' },
                { Icon: FileText, t: 'Documentation', d: 'Invoice, packing list, IEC/AWB and customs paperwork handled by our CHA desk.' },
                { Icon: Truck, t: 'Pickup & Movement', d: 'Door pickup in Hyderabad, then air via RGIA or rail via ICD Sanathnagar.' },
                { Icon: Globe2, t: 'Clearance & Delivery', d: 'Customs cleared and cargo delivered, with tracking at every checkpoint.' },
              ].map(({ Icon, t, d }, i) => (
                <div key={t} onMouseMove={spotlight} className="glass-card rounded-3xl p-6 text-center relative">
                  <div className="mx-auto mb-4 w-14 h-14 rounded-2xl glass-btn-orange flex items-center justify-center">
                    <Icon size={24} />
                  </div>
                  <span className="font-display text-[11px] font-bold text-orange-400 tracking-widest">STEP 0{i + 1}</span>
                  <h3 className="text-base font-bold text-white mt-1 mb-2">{t}</h3>
                  <p className="text-sm text-ink-3 leading-relaxed">{d}</p>
                </div>
              ))}
            </Reveal>
            <div className="marquee" aria-label="Popular destinations">
              <div className="marquee-track">
                {[...Array(2)].flatMap((_, k) =>
                  ['Australia','USA','United Kingdom','UAE / Dubai','Singapore','Germany','Canada','Saudi Arabia','Malaysia','New Zealand','France','Qatar'].map((c) => (
                    <span key={c + k} className="glass-chip px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap"><i className="chip-dot" />{c}</span>
                  )),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================= HERITAGE & EXPERIENCE SECTION ================= */}
        <section className="py-20 section-glow" id="experience">
          <div className="shell">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-orange-500/10 border border-orange-500/25 rounded-full text-xs font-semibold text-orange-400">
                  <Award size={14} className="text-orange-400 shrink-0" />
                  <span>ESTABLISHED 1995 • 28+ YEARS OF INDUSTRY EXPERIENCE</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Guided by <span className="gradient-text">28+ Years</span> of Practical Logistics Experience
                </h2>

                <p className="text-sm text-ink-2 leading-relaxed">
                  Since 1995, S.R. Freight has operated continuously from Bharani Complex on Minister Road, Begumpet, accumulating over <strong className="text-white font-semibold">28 years of verified freight forwarding and customs clearance experience</strong> across Hyderabad and Secunderabad. While international shipping can often be plagued by automated call centers and hidden demurrage, S R Freight guarantees direct access to seasoned freight specialists who manage your cargo with precision.
                </p>

                {/* Experience Key Highlights Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="glass-card glass-flat rounded-xl p-3.5 space-y-1">
                    <span className="text-xl font-black font-display text-orange-400 block">1995</span>
                    <strong className="text-xs font-bold text-white block">Est. in Begumpet</strong>
                    <span className="text-[12px] text-ink-3">28+ years continuous service</span>
                  </div>
                  <div className="glass-card glass-flat rounded-xl p-3.5 space-y-1">
                    <span className="text-xl font-black font-display text-emerald-400 block"><CountUp to={10000} suffix="+" /></span>
                    <strong className="text-xs font-bold text-white block">Shipments Cleared</strong>
                    <span className="text-[12px] text-ink-3">Air cargo, ocean & courier</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-ink-2">
                  <div className="flex items-start gap-3 glass-card glass-flat p-4 rounded-xl">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Direct Customs Coordination:</strong> Decades of operational familiarity with Air Cargo customs at Rajiv Gandhi Int’l Airport (RGIA).</span>
                  </div>
                  <div className="flex items-start gap-3 glass-card glass-flat p-4 rounded-xl">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Rail & Port Mastery:</strong> Seamless container railing through ICD Sanathnagar to Nhava Sheva and Chennai Port with zero detention surprises.</span>
                  </div>
                  <div className="flex items-start gap-3 glass-card glass-flat p-4 rounded-xl">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Worldwide Express Network:</strong> Specialized door-to-door courier to Australia (Melbourne, Sydney), USA, UK, and European hubs.</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 hover:text-orange-300 transition"
                  >
                    Read our complete 28-year story <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-5">
                {/* Experience Trust Banner Card */}
                <div className="glass-card rounded-3xl p-6 sm:p-7 flex items-center gap-5 ring-1 ring-orange-500/30">
                  <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white flex flex-col items-center justify-center font-display font-black shrink-0 shadow-lg shadow-orange-500/30">
                    <span className="text-2xl leading-none">28+</span>
                    <span className="text-[10px] uppercase tracking-wider font-sans font-bold">Years</span>
                  </div>
                  <div>
                    <span className="text-xs font-display font-bold uppercase tracking-wider text-orange-400 block mb-0.5">
                      PROVEN TRACK RECORD
                    </span>
                    <h3 className="text-lg font-bold text-white">Three Decades of Freight Trust</h3>
                    <p className="text-xs text-ink-2 mt-1">
                      Serving Hyderabad’s exporters, importers, pharma manufacturers, and overseas families with personal accountability.
                    </p>
                  </div>
                </div>

                <div className="glass-card glass-flat rounded-3xl p-8 sm:p-10 space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div>
                      <b className="text-white text-lg block font-bold">Begumpet Head Office</b>
                      <span className="text-xs text-ink-4">Secunderabad / Hyderabad — 500003</span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
                      Open Mon - Sat
                    </span>
                  </div>

                  <div className="space-y-3 text-xs text-ink-2">
                    <p className="flex items-start gap-2.5">
                      <MapPin size={16} className="text-orange-400 shrink-0 mt-0.5" />
                      <span>{COMPANY.address.full}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Phone size={15} className="text-emerald-400 shrink-0" />
                      <a href={`tel:${COMPANY.phoneRaw}`} className="font-bold text-white hover:text-orange-400">
                        {COMPANY.phone} (Direct Desk)
                      </a>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Phone size={15} className="text-ink-4 shrink-0" />
                      <span>{COMPANY.landline} (Office)</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3">
                    <a
                      href={`https://wa.me/919391032794?text=Hi%20SR%20Freight,%20inquiring%20about%20cargo%20services`}
                      target="_blank"
                      rel="noreferrer"
                      className="glass-btn-emerald px-5 py-2.5 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <MessageCircle size={14} /> <span>Chat on WhatsApp</span>
                    </a>
                    <a
                      href={COMPANY.address.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="glass-btn-frosted px-4 py-2.5 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <span>Directions</span> <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= REVIEWS SECTION ================= */}
        <section className="py-20 section-glow">
          <div className="shell space-y-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow mb-3">
                  CLIENT EXPERIENCES
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Verified Ratings from Indian & Overseas Shippers
                </h2>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-white">5.0 / 5.0</span>
                <span className="text-ink-4">• Google Review Score</span>
              </div>
            </div>

            <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {REAL_REVIEWS.map((rev, idx) => (
                <div
                  key={idx}
                  onMouseMove={spotlight} className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className="fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-ink-2 italic leading-relaxed">"{rev.text}"</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-xs">
                    <b className="text-white block font-bold">{rev.author}</b>
                    <span className="text-[12px] text-ink-4">{rev.role}</span>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className="py-20 section-glow">
          <div className="shell space-y-12 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <span className="eyebrow mb-3">
                FREIGHT, EXPLAINED
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Frequently Asked Questions</h2>
              <p className="text-xs sm:text-sm text-ink-3">
                Essential information for Hyderabad businesses and individuals planning a consignment.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className={`glass-card glass-flat rounded-2xl overflow-hidden ${openFaq === idx ? "ring-1 ring-orange-500/40" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-orange-400 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-orange-400 transition-transform duration-200 shrink-0 ml-4 ${openFaq === idx ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  {openFaq === idx && (
                    <div className="px-5 pb-5 text-sm text-ink-2 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= QUOTE REQUEST FORM SECTION ================= */}
        <section className="py-20 section-glow" id="quote">
          <div className="shell space-y-10">
            <div className="text-center max-w-xl mx-auto">
              <span className="eyebrow mb-3">
                ONLINE SHIPMENT ENQUIRY
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Request Your Freight Quote
              </h2>
              <p className="text-xs sm:text-sm text-ink-3 mt-2">
                Share a few shipment details and our Begumpet team will identify the right routing and binding tariff.
              </p>
            </div>

            <Reveal><QuoteForm /></Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
