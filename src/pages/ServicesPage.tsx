import { useParams, Link } from 'react-router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import QuoteForm from '../components/QuoteForm'
import {
  Plane,
  Ship,
  PackageCheck,
  ShieldCheck,
  Warehouse,
  Boxes,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldAlert,
  MapPin,
  ExternalLink,
  Phone,
} from 'lucide-react'
import { SERVICES_LIST, COMPANY } from '../data/companyInfo'

const ICONS_MAP: Record<string, any> = {
  Plane,
  Ship,
  PackageCheck,
  ShieldCheck,
  Warehouse,
  Boxes,
}

export default function ServicesPage() {
  const { serviceSlug } = useParams<{ serviceSlug?: string }>()

  const currentService = serviceSlug
    ? SERVICES_LIST.find((s) => s.slug === serviceSlug)
    : null

  return (
    <div className="min-h-screen bg-[#040e18] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="shell space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400 mb-2 inline-block">
              {currentService ? 'GLOBAL LOGISTICS CAPABILITY' : 'COMPREHENSIVE LOGISTICS SOLUTIONS'}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              {currentService ? currentService.title : 'End-to-End International Freight Services'}
            </h1>
            <p className="text-sm md:text-base text-white/60 mt-3 leading-relaxed">
              {currentService
                ? currentService.shortDesc
                : 'Connecting Hyderabad businesses to 220+ international destinations through RGIA Air Cargo Terminal, ICD Sanathnagar, and global partner alliances.'}
            </p>
          </div>

          {/* If Single Service Detail View */}
          {currentService ? (
            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Cols: Service Specs */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-[#071726] border border-white/10 rounded-3xl p-6 sm:p-9 shadow-xl">
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                      {currentService.badges.map((b) => (
                        <span
                          key={b}
                          className="px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-xs font-bold"
                        >
                          {b}
                        </span>
                      ))}
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold flex items-center gap-1">
                        <Clock size={12} /> Transit: {currentService.transitTime}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white mb-4">
                      Operational Highlights & Infrastructure
                    </h3>

                    <ul className="space-y-4 text-xs sm:text-sm text-white/80">
                      {currentService.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                          <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs text-orange-200">
                      <b className="font-bold block mb-1">Recommended Cargo Fit:</b>
                      <p className="text-white/80">{currentService.idealFor}</p>
                    </div>
                  </div>

                  {/* Industry Specialization */}
                  <div className="bg-[#071726] border border-white/10 rounded-3xl p-6 sm:p-9 shadow-xl space-y-4">
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      Tailored for Hyderabad’s Key Export Industries
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <b className="text-orange-400 block mb-1 font-bold">Pharmaceuticals & Biotech</b>
                        <p className="text-white/70">
                          Active pharmaceutical ingredients (API) and temperature-monitored formulations out of Genome Valley and Bollaram to USA, EU, and Latin America.
                        </p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <b className="text-orange-400 block mb-1 font-bold">Aerospace & Precision Engineering</b>
                        <p className="text-white/70">
                          Custom wooden crating and expedited air charter for Adibatla aerospace corridor and Sanathnagar manufacturing units.
                        </p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <b className="text-orange-400 block mb-1 font-bold">Australia & USA Courier</b>
                        <p className="text-white/70">
                          Fast personal parcel delivery, traditional home food items, university documents, and prescribed medicines with prescription verification.
                        </p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <b className="text-orange-400 block mb-1 font-bold">Agro & Commodity Bulk Shipments</b>
                        <p className="text-white/70">
                          Full container load (FCL) turmeric, spices, and agricultural goods directly railed from ICD Sanathnagar to Nhava Sheva and Chennai Port.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Instant Booking & Other Services */}
                <div className="space-y-6">
                  <div className="bg-[#071726] border border-white/10 rounded-3xl p-6 shadow-xl">
                    <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
                      All Freight Capabilities
                    </h4>
                    <div className="space-y-2 text-xs">
                      {SERVICES_LIST.map((srv) => (
                        <Link
                          key={srv.slug}
                          to={`/services/${srv.slug}`}
                          className={`flex items-center justify-between p-3 rounded-xl border transition ${
                            srv.slug === currentService.slug
                              ? 'bg-orange-600/20 border-orange-500 text-white font-bold'
                              : 'bg-white/5 border-white/5 text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span className="truncate">{srv.title}</span>
                          <ArrowRight size={13} className="shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-[#0c2338] to-[#071726] border border-white/10 rounded-3xl space-y-3">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      DIRECT ASSISTANCE
                    </span>
                    <h4 className="font-bold text-base text-white">Begumpet Cargo Desk</h4>
                    <p className="text-xs text-white/60">
                      Need custom quotes or immediate airline space allotment? Talk directly with our senior Begumpet freight desk (28+ years experience).
                    </p>
                    <a
                      href={`tel:${COMPANY.phoneRaw}`}
                      className="glass-btn-orange w-full py-3 text-white font-bold rounded-xl text-xs gap-2 flex items-center justify-center"
                    >
                      <Phone size={14} /> <span>Call {COMPANY.phone}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Quote Form For This Service */}
              <div className="pt-8 border-t border-white/10">
                <div className="text-center max-w-xl mx-auto mb-8">
                  <h3 className="text-2xl font-black text-white">
                    Request a Tariff Quote for {currentService.title}
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Fill in your consignment origin, destination, and weight for an immediate response.
                  </p>
                </div>
                <QuoteForm initialService={currentService.id} />
              </div>
            </div>
          ) : (
            /* All Services Grid View */
            <div className="space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SERVICES_LIST.map((srv, idx) => {
                  const Icon = ICONS_MAP[srv.icon] || Plane
                  return (
                    <article
                      key={srv.id}
                      className="bg-[#071726] hover:bg-[#0a1e32] border border-white/10 hover:border-orange-500/40 rounded-3xl p-7 transition-all duration-300 flex flex-col justify-between shadow-xl group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-md">
                            <Icon size={24} />
                          </div>
                          <span className="font-mono text-xs text-white/40 font-bold">0{idx + 1}</span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition">
                          {srv.title}
                        </h3>
                        <p className="text-xs text-white/60 leading-relaxed mb-5">{srv.shortDesc}</p>

                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {srv.badges.map((b) => (
                            <span
                              key={b}
                              className="text-[10px] px-2.5 py-1 bg-white/5 rounded-md text-white/70 font-semibold border border-white/5"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[11px] text-amber-300/80 font-medium flex items-center gap-1">
                          <Clock size={11} /> {srv.transitTime}
                        </span>
                        <Link
                          to={`/services/${srv.slug}`}
                          className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition"
                        >
                          Explore Details <ArrowRight size={13} />
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>

              {/* Trade Hub Connections */}
              <div className="bg-[#071726] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
                <div className="max-w-2xl mb-8">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400 block mb-1">
                    HYDERABAD GATEWAY NETWORK
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Direct Infrastructure Links Across Telangana
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60 mt-2">
                    Our Begumpet operations desk coordinates real-time cargo movement through all primary commercial infrastructure nodes in the region.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
                  {COMPANY.keyHubs.map((hub, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <span className="text-orange-400 font-mono font-bold block mb-1 text-[11px]">
                        HUB 0{idx + 1}
                      </span>
                      <b className="text-white text-sm block mb-1 font-bold">{hub.name}</b>
                      <p className="text-white/60 text-[11px] flex items-start gap-1">
                        <MapPin size={12} className="shrink-0 mt-0.5 text-white/40" />
                        {hub.location}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* General Quote Request Form */}
              <div className="pt-4">
                <div className="text-center max-w-xl mx-auto mb-8">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block mb-1">
                    CONNECT WITH OUR LOGISTICS SPECIALIST
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">Get a Custom Shipping Quote</h3>
                  <p className="text-xs text-white/60 mt-2">
                    Fast response, transparent billing, and personalized service from our Hyderabad team.
                  </p>
                </div>
                <QuoteForm />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
