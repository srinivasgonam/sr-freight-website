import { useState, useEffect } from 'react'
import { Search, Package, Plane, Ship, CheckCircle2, Clock, MapPin, AlertCircle, ArrowRight, Printer } from 'lucide-react'
import { apiFetch } from '../lib/api'

interface Checkpoint {
  id?: number
  title: string
  location: string
  description: string
  timestamp: string
  is_completed: number
  order_index?: number
}

interface ShipmentData {
  tracking_number: string
  customer_name: string
  origin: string
  destination: string
  service_mode: string
  status: string
  status_label: string
  current_location: string
  eta: string
  estimated_delivery: string
  carrier: string
  flight_vessel: string
  weight_kg: number
  packages_count: number
  cargo_description: string
  checkpoints: Checkpoint[]
}

interface ShipmentTrackerProps {
  initialTrackingId?: string
  compact?: boolean
}

export default function ShipmentTracker({ initialTrackingId = '', compact = false }: ShipmentTrackerProps) {
  const [trackingId, setTrackingId] = useState(initialTrackingId)
  const [shipment, setShipment] = useState<ShipmentData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTrack = async (idToTrack?: string) => {
    const query = (idToTrack || trackingId).trim().toUpperCase()
    if (!query) {
      setError('Please enter a tracking number or Air Waybill (AWB).')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await apiFetch(`/api/track/${encodeURIComponent(query)}`)
      const data = await res.json()

      if (data.success && data.shipment) {
        setShipment(data.shipment)
        setTrackingId(query)
      } else {
        setShipment(null)
        setError(data.error || `No consignment found for "${query}". Please check your tracking ID.`)
      }
    } catch {
      setError('Unable to connect to SR Freight tracking server. Please check your internet connection or call our Begumpet office directly.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialTrackingId) {
      handleTrack(initialTrackingId)
    }
  }, [initialTrackingId])

  const sampleIds = [
    { id: 'SR-HYD-98241', label: 'Air Freight: HYD → DXB' },
    { id: 'SR-AIR-10492', label: 'Express Courier: Begumpet → Melbourne' },
    { id: 'SR-SEA-55201', label: 'Ocean Container: ICD → Rotterdam' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'customs_cleared':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30'
      case 'in_transit':
      case 'out_for_delivery':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    }
  }

  return (
    <div className={`w-full ${compact ? '' : 'max-w-4xl mx-auto'}`}>
      {/* Search Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleTrack()
        }}
        className="relative flex flex-col sm:flex-row gap-3 bg-[#071726]/90 p-3 sm:p-4 rounded-2xl border border-white/15 shadow-2xl backdrop-blur-xl"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={20} />
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter AWB / Tracking ID (e.g. SR-HYD-98241)"
            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-orange-500 text-sm font-medium tracking-wide uppercase"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="glass-btn-orange px-7 py-3.5 disabled:opacity-50 text-white font-bold rounded-xl text-sm whitespace-nowrap gap-2"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search size={16} />
          )}
          <span>{loading ? 'Locating...' : 'Track Cargo'}</span>
        </button>
      </form>

      {/* Quick sample chips */}
      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-ink-3">
        <span className="font-medium text-ink-4">Try sample shipments:</span>
        {sampleIds.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTrackingId(item.id)
              handleTrack(item.id)
            }}
            className="glass-chip px-3 py-1 rounded-lg text-white/90 text-xs font-medium"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-200 text-sm animate-in fade-in">
          <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-semibold">{error}</p>
            <p className="text-xs text-red-300/80 mt-1">
              For immediate assistance with live manifests, please call our 24/7 Begumpet Desk at{' '}
              <a href="tel:+919391032794" className="underline font-bold text-white">
                +91 93910 32794
              </a>
              .
            </p>
          </div>
        </div>
      )}

      {/* Shipment Result Display */}
      {shipment && (
        <div className="mt-6 bg-[#0a1c2e] border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-bold text-orange-400 tracking-wider">
                  WAYBILL / TRACKING NO:
                </span>
                <span className="text-lg font-display font-black text-white bg-white/10 px-2.5 py-0.5 rounded">
                  {shipment.tracking_number}
                </span>
              </div>
              <p className="text-xs text-ink-3">
                Consignee: <span className="text-white font-medium">{shipment.customer_name}</span> • Service:{' '}
                <span className="text-white font-medium">{shipment.service_mode}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 ${getStatusColor(
                  shipment.status
                )}`}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                {shipment.status_label}
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 glass-btn-frosted rounded-lg text-xs"
                title="Print Waybill Summary"
              >
                <Printer size={13} /> <span>Print</span>
              </button>
            </div>
          </div>

          {/* Route Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 p-5 bg-[#061422] rounded-xl border border-white/10">
            <div>
              <span className="text-[11px] text-ink-4 uppercase tracking-widest block font-bold mb-1">
                ORIGIN (DISPATCHED)
              </span>
              <p className="text-sm font-bold text-white flex items-center gap-1.5">
                <MapPin size={15} className="text-orange-400 shrink-0" />
                {shipment.origin}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center text-center border-y md:border-y-0 md:border-x border-white/10 py-3 md:py-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 mb-1">
                {shipment.service_mode.includes('Ocean') ? (
                  <Ship size={16} className="animate-pulse" />
                ) : (
                  <Plane size={16} className="animate-pulse" />
                )}
                <span>{shipment.flight_vessel}</span>
              </div>
              <span className="text-[12px] text-ink-4">{shipment.carrier}</span>
            </div>

            <div className="text-left md:text-right">
              <span className="text-[11px] text-ink-4 uppercase tracking-widest block font-bold mb-1">
                DESTINATION / ETA
              </span>
              <p className="text-sm font-bold text-white flex items-center justify-start md:justify-end gap-1.5">
                <MapPin size={15} className="text-emerald-400 shrink-0" />
                {shipment.destination}
              </p>
              <span className="text-xs text-amber-300 font-medium">ETA: {shipment.eta}</span>
            </div>
          </div>

          {/* Cargo Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-xs bg-white/5 p-4 rounded-xl border border-white/5">
            <div>
              <span className="text-ink-4 block mb-1">Gross Weight</span>
              <span className="text-white font-bold text-sm">{shipment.weight_kg} KG</span>
            </div>
            <div>
              <span className="text-ink-4 block mb-1">Packages</span>
              <span className="text-white font-bold text-sm">{shipment.packages_count} Units</span>
            </div>
            <div>
              <span className="text-ink-4 block mb-1">Current Location</span>
              <span className="text-emerald-300 font-bold text-xs truncate block">{shipment.current_location}</span>
            </div>
            <div>
              <span className="text-ink-4 block mb-1">Est. Delivery</span>
              <span className="text-white font-bold text-xs">{shipment.estimated_delivery}</span>
            </div>
          </div>

          {/* Milestone Checkpoints Timeline */}
          <div>
            <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-orange-400" />
              Transit History & Milestones
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
              {shipment.checkpoints.map((cp, idx) => (
                <div key={idx} className="relative group">
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      cp.is_completed
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-white/10 border-2 border-white/30 text-transparent'
                    }`}
                  >
                    {cp.is_completed ? <CheckCircle2 size={13} /> : null}
                  </div>

                  <div className="bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/10 transition">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{cp.title}</span>
                      <span className="text-[12px] font-mono text-ink-4">{cp.timestamp}</span>
                    </div>
                    <p className="text-xs text-orange-400/90 font-medium mb-1.5 flex items-center gap-1">
                      <MapPin size={11} /> {cp.location}
                    </p>
                    {cp.description && <p className="text-sm text-ink-2 leading-relaxed">{cp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Strip */}
          <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-3">
            <span>Need modification or custom clearance paperwork?</span>
            <a
              href="https://wa.me/919391032794?text=Hi%20SR%20Freight,%20inquiring%20about%20tracking%20AWB%20"
              target="_blank"
              rel="noreferrer"
              className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 transition"
            >
              Contact Begumpet Operations on WhatsApp <ArrowRight size={13} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
