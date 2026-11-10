import { useState } from 'react'
import { Send, CheckCircle2, AlertCircle, Phone, ArrowRight } from 'lucide-react'
import { COMPANY } from '../data/companyInfo'

interface QuoteFormProps {
  initialService?: string
  initialOrigin?: string
  initialDestination?: string
  initialWeight?: number
  initialCargoType?: string
  initialDimensions?: string
  compact?: boolean
}

export default function QuoteForm({
  initialService = 'air-freight',
  initialOrigin = '',
  initialDestination = '',
  initialWeight = 0,
  initialCargoType = 'general',
  initialDimensions = '',
  compact = false,
}: QuoteFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service_type: initialService,
    origin: initialOrigin,
    destination: initialDestination,
    weight_kg: initialWeight > 0 ? String(initialWeight) : '',
    cargo_type: initialCargoType,
    dimensions: initialDimensions,
    message: '',
  })

  const [loading, setLoading] = useState(false)
  const [successQuote, setSuccessQuote] = useState<{ ref_code: string; name: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          weight_kg: parseFloat(formData.weight_kg) || 0,
        }),
      })

      const data = await res.json()

      if (data.success && data.quote) {
        setSuccessQuote({
          ref_code: data.quote.ref_code,
          name: data.quote.name,
        })
      } else {
        setError(data.error || 'Failed to submit enquiry. Please check your inputs.')
      }
    } catch {
      setError('Unable to reach the SR Freight server. Please call us directly at +91 93910 32794.')
    } finally {
      setLoading(false)
    }
  }

  if (successQuote) {
    const waText = encodeURIComponent(
      `Hi SR Freight Begumpet, I just requested a quote with Reference Code ${successQuote.ref_code} for ${formData.origin} to ${formData.destination}. Please share the tariff.`
    )

    return (
      <div className="bg-[#061726] border border-emerald-500/30 rounded-3xl p-8 sm:p-10 text-center animate-in zoom-in-95 duration-300 shadow-2xl max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-500/30">
          <CheckCircle2 size={36} />
        </div>
        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-2">
          ENQUIRY REGISTERED SUCCESSFULLY
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">Thank you, {successQuote.name}!</h3>
        <p className="text-sm text-white/70 max-w-md mx-auto mb-6">
          Your quote request has been routed directly to our senior Begumpet operations desk with 28+ years of freight expertise.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 max-w-sm mx-auto">
          <span className="text-[10px] text-white/40 uppercase tracking-widest block font-bold mb-1">
            OFFICIAL REFERENCE NUMBER
          </span>
          <span className="text-2xl font-mono font-black text-orange-400">{successQuote.ref_code}</span>
          <span className="text-[11px] text-white/50 block mt-1">Please quote this reference in all correspondence</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/919391032794?text=${waText}`}
            target="_blank"
            rel="noreferrer"
            className="glass-btn-emerald w-full sm:w-auto px-6 py-3.5 text-white font-bold rounded-xl text-xs gap-2"
          >
            <span>Connect on WhatsApp for Faster Rate Sheet</span> <ArrowRight size={14} />
          </a>
          <button
            type="button"
            onClick={() => {
              setSuccessQuote(null)
              setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                service_type: initialService,
                origin: '',
                destination: '',
                weight_kg: '',
                cargo_type: 'general',
                dimensions: '',
                message: '',
              })
            }}
            className="glass-btn-frosted w-full sm:w-auto px-5 py-3.5 text-white/90 rounded-xl text-xs font-bold"
          >
            <span>Submit Another Consignment</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <form
      id="quote"
      onSubmit={handleSubmit}
      className={`bg-[#061726]/95 border border-white/15 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl ${
        compact ? '' : 'max-w-3xl mx-auto'
      }`}
    >
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 font-bold block">
            INTERNATIONAL FREIGHT ENQUIRY
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">Request Official Freight Quote</h3>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/60">
          <Phone size={13} className="text-emerald-400" />
          <span>Call: {COMPANY.phone}</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-200 text-xs">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Row 1: Contact details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
            Your Full Name *
          </label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Ramesh Chandra"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
            Work Email *
          </label>
          <input
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@company.com"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Row 2: Phone & Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
            Phone / Mobile Number *
          </label>
          <input
            required
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98490 12345"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
            Company / Organization
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g. Telangana Pharma / Individual"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Row 3: Service Type & Cargo Profile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
            Shipping Mode *
          </label>
          <select
            value={formData.service_type}
            onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
            className="w-full px-4 py-3 bg-[#0a1c2e] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
          >
            <option value="air-freight">✈ International Air Freight (RGIA Airport)</option>
            <option value="ocean-freight">🚢 Ocean Freight (FCL Container / LCL Consolidation)</option>
            <option value="courier">📦 Worldwide Express Courier (Australia, USA, UK, Gulf)</option>
            <option value="customs">📋 Customs Clearance / CHA Brokerage</option>
            <option value="warehousing">🏢 Warehousing & Distribution</option>
            <option value="door-to-door">🚚 End-to-End Door-to-Door Service</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
            Cargo Profile
          </label>
          <select
            value={formData.cargo_type}
            onChange={(e) => setFormData({ ...formData, cargo_type: e.target.value })}
            className="w-full px-4 py-3 bg-[#0a1c2e] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
          >
            <option value="general">General Commercial Cargo</option>
            <option value="pharma">Pharmaceuticals & Cold Chain Formulations</option>
            <option value="dgr">Dangerous Goods / Chemicals (DGR)</option>
            <option value="machinery">Heavy Industrial Machinery & Parts</option>
            <option value="documents">Official Documents & Courier Parcels</option>
            <option value="perishable">Perishables & Agricultural Products</option>
          </select>
        </div>
      </div>

      {/* Row 4: Origin & Destination */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
            Origin (Pickup Location) *
          </label>
          <input
            required
            type="text"
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            placeholder="e.g. Hyderabad / Begumpet / Sanathnagar"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
            Destination (Port / Airport / City) *
          </label>
          <input
            required
            type="text"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            placeholder="e.g. Dubai, Melbourne, Chicago, London"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Row 5: Weight & Dimensions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
            Estimated Weight (KG)
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={formData.weight_kg}
            onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
            placeholder="e.g. 150"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
            Dimensions / Packages Description
          </label>
          <input
            type="text"
            value={formData.dimensions}
            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
            placeholder="e.g. 4 boxes (60x40x50 cm) or 1x 20ft container"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Row 6: Message / Instructions */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
          Special Handling, Timeline or Customs Notes
        </label>
        <textarea
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Mention temperature requirements, target delivery date, or custom clearance assistance needed..."
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="glass-btn-orange w-full py-4 disabled:opacity-50 text-white font-bold rounded-xl text-sm tracking-wide cursor-pointer gap-2"
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Send size={16} />
        )}
        <span>{loading ? 'Submitting to Begumpet Desk...' : 'Request Formal Quote & Route Plan'}</span>
      </button>

      <p className="text-center text-[11px] text-white/40 mt-4">
        Your enquiry is strictly private. We never share your cargo or contact information.
      </p>
    </form>
  )
}
