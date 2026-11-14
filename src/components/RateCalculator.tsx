import { useState } from 'react'
import { Calculator, Plane, Ship, Package, Check, ArrowRight, Info, ShieldAlert } from 'lucide-react'
import { apiFetch } from '../lib/api'

interface RateEstimate {
  mode: string
  origin: string
  destination: string
  laneZone: string
  actualWeightKg: number
  volumetricWeightKg: number
  chargeableWeightKg: number
  volumeCbm: number
  estimatedDays: string
  breakdown: {
    freightCharges: number
    fuelSurcharge: number
    customsDocumentation: number
    terminalHandling: number
    commodityNotes: string
  }
  totalEstimateInr: number
  totalEstimateUsd: number
  disclaimer: string
}

interface RateCalculatorProps {
  onApplyToQuote?: (data: {
    service_type: string
    origin: string
    destination: string
    weight_kg: number
    cargo_type: string
    dimensions: string
  }) => void
}

export default function RateCalculator({ onApplyToQuote }: RateCalculatorProps) {
  const [mode, setMode] = useState<'air' | 'ocean_lcl' | 'ocean_fcl' | 'courier'>('air')
  const [origin, setOrigin] = useState('Hyderabad (RGIA Airport), India')
  const [destination, setDestination] = useState('Dubai (DXB), UAE')
  const [weight, setWeight] = useState('25')
  const [length, setLength] = useState('50')
  const [width, setWidth] = useState('40')
  const [height, setHeight] = useState('30')
  const [cargoType, setCargoType] = useState('general')
  const [containerType, setContainerType] = useState('20ft')

  const [loading, setLoading] = useState(false)
  const [estimate, setEstimate] = useState<RateEstimate | null>(null)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          origin,
          destination,
          weight: parseFloat(weight) || 1,
          length: parseFloat(length) || 0,
          width: parseFloat(width) || 0,
          height: parseFloat(height) || 0,
          cargoType,
          containerType,
        }),
      })
      const data = await res.json()
      if (data.success && data.estimate) {
        setEstimate(data.estimate)
      }
    } catch (err) {
      console.error('Calculation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const popularDestinations = [
    'Dubai (DXB), UAE',
    'Melbourne (MEL), Australia',
    'Chicago (ORD), USA',
    'London Heathrow (LHR), UK',
    'Frankfurt (FRA), Germany',
    'Singapore Changi (SIN)',
  ]

  const handleBookWithDetails = () => {
    if (onApplyToQuote) {
      onApplyToQuote({
        service_type: mode === 'air' ? 'air-freight' : mode === 'courier' ? 'courier' : 'ocean-freight',
        origin,
        destination,
        weight_kg: parseFloat(weight) || 0,
        cargo_type: cargoType,
        dimensions: `${length}x${width}x${height} cm`,
      })
    } else {
      const quoteEl = document.getElementById('quote')
      if (quoteEl) {
        quoteEl.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#081829] border border-white/15 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-[12px] font-bold uppercase tracking-widest text-orange-400 mb-2 inline-flex items-center gap-1.5">
          <Calculator size={13} /> Transparent International Tariff
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Instant Freight Rate Estimator</h3>
        <p className="text-xs sm:text-sm text-ink-3 mt-2">
          Calculate estimated charges from Hyderabad to global trade destinations with volumetric weight and fuel index.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-[#05111d]/90 backdrop-blur-md rounded-2xl border border-white/10 mb-8">
        <button
          type="button"
          onClick={() => {
            setMode('air')
            setEstimate(null)
          }}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
            mode === 'air'
              ? 'glass-tab-active'
              : 'glass-tab-inactive'
          }`}
        >
          <Plane size={15} /> <span>Air Cargo</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('courier')
            setEstimate(null)
          }}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
            mode === 'courier'
              ? 'glass-tab-active'
              : 'glass-tab-inactive'
          }`}
        >
          <Package size={15} /> <span>Express Courier</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('ocean_lcl')
            setEstimate(null)
          }}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
            mode === 'ocean_lcl'
              ? 'glass-tab-active'
              : 'glass-tab-inactive'
          }`}
        >
          <Ship size={15} /> <span>Ocean LCL (Shared)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('ocean_fcl')
            setEstimate(null)
          }}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
            mode === 'ocean_fcl'
              ? 'glass-tab-active'
              : 'glass-tab-inactive'
          }`}
        >
          <Ship size={15} /> <span>Ocean FCL (Full Container)</span>
        </button>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div>
          <label className="block text-xs font-bold text-ink-2 uppercase tracking-wider mb-2">
            Origin Point (Hyderabad Hub)
          </label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-ink-2 uppercase tracking-wider mb-2">
            Destination City / Port
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
          />
          {/* Quick Picks */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {popularDestinations.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDestination(d)}
                className={`text-[11px] px-2.5 py-1 rounded-lg transition ${
                  destination === d ? 'glass-chip-active font-bold' : 'glass-chip'
                }`}
              >
                {d.split(',')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dimensions & Weight */}
      {mode !== 'ocean_fcl' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-[12px] font-bold text-ink-2 uppercase tracking-wider mb-1.5">
              Weight (KG)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="0.5"
              step="0.5"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-ink-2 uppercase tracking-wider mb-1.5">
              Length (CM)
            </label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              min="0"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-ink-2 uppercase tracking-wider mb-1.5">
              Width (CM)
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              min="0"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-ink-2 uppercase tracking-wider mb-1.5">
              Height (CM)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min="0"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-ink-2 uppercase tracking-wider mb-1.5">
              Container Specification
            </label>
            <select
              value={containerType}
              onChange={(e) => setContainerType(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a1c2e] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
            >
              <option value="20ft">20ft Standard Dry Container (28-30 CBM)</option>
              <option value="40ft">40ft High Cube Container (68-76 CBM)</option>
              <option value="reefer">40ft Temperature-Controlled Reefer</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-ink-2 uppercase tracking-wider mb-1.5">
              Payload Gross Weight (KG)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 18000"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>
        </div>
      )}

      {/* Commodity Type */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-ink-2 uppercase tracking-wider mb-2">
          Cargo Commodity Profile
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {[
            { id: 'general', label: 'General Merchandise' },
            { id: 'pharma', label: 'Pharma Cold Chain' },
            { id: 'dgr', label: 'Dangerous Goods (DGR)' },
            { id: 'machinery', label: 'Industrial Machinery' },
            { id: 'documents', label: 'Express Documents' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCargoType(cat.id)}
              className={`p-2.5 rounded-xl border text-center transition font-semibold cursor-pointer ${
                cargoType === cat.id
                  ? 'glass-chip-active font-bold'
                  : 'glass-chip'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calculate CTA */}
      <button
        type="button"
        onClick={handleCalculate}
        disabled={loading}
        className="glass-btn-orange w-full py-4 text-white font-bold rounded-xl text-sm tracking-wide cursor-pointer gap-2"
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Calculator size={18} />
        )}
        <span>{loading ? 'Calculating Tariff Rates...' : 'Calculate Estimated Freight'}</span>
      </button>

      {/* Estimate Result Card */}
      {estimate && (
        <div className="mt-8 p-6 bg-[#040e18] border border-orange-500/30 rounded-2xl animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-[11px] font-display text-orange-400 font-bold uppercase tracking-widest block">
                INDICATIVE TARIFF QUOTE
              </span>
              <h4 className="text-xl font-black text-white mt-0.5">
                {estimate.origin.split(',')[0]} → {estimate.destination.split(',')[0]}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400">
                ₹{estimate.totalEstimateInr.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-ink-3 block font-mono">
                (~${estimate.totalEstimateUsd.toLocaleString()} USD)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-white/10 text-xs">
            <div>
              <span className="text-ink-4 block">Chargeable Weight</span>
              <span className="text-white font-bold">{estimate.chargeableWeightKg} KG</span>
            </div>
            <div>
              <span className="text-ink-4 block">Volumetric Weight</span>
              <span className="text-white font-bold">{estimate.volumetricWeightKg} KG</span>
            </div>
            <div>
              <span className="text-ink-4 block">Estimated Transit</span>
              <span className="text-amber-300 font-bold">{estimate.estimatedDays}</span>
            </div>
            <div>
              <span className="text-ink-4 block">Lane Route</span>
              <span className="text-white font-bold capitalize">{estimate.laneZone}</span>
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="py-4 space-y-2 text-xs">
            <div className="flex justify-between text-ink-2">
              <span>Base Freight Charges:</span>
              <span className="text-white font-medium">₹{estimate.breakdown.freightCharges.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-ink-2">
              <span>Fuel & Security Surcharges:</span>
              <span className="text-white font-medium">₹{estimate.breakdown.fuelSurcharge.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-ink-2">
              <span>Customs Documentation (Begumpet / RGIA):</span>
              <span className="text-white font-medium">₹{estimate.breakdown.customsDocumentation.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-ink-2">
              <span>Terminal Handling Charges (THC):</span>
              <span className="text-white font-medium">₹{estimate.breakdown.terminalHandling.toLocaleString('en-IN')}</span>
            </div>
            {estimate.breakdown.commodityNotes && (
              <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10 text-[12px] text-amber-300/90 flex items-start gap-2">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span>{estimate.breakdown.commodityNotes}</span>
              </div>
            )}
          </div>

          {/* Conversion CTA */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[12px] text-ink-4">{estimate.disclaimer}</span>
            <button
              type="button"
              onClick={handleBookWithDetails}
              className="glass-btn-emerald w-full sm:w-auto px-6 py-2.5 text-white font-bold rounded-xl text-xs gap-2 whitespace-nowrap cursor-pointer"
            >
              <span>Request Formal Rate Sheet</span> <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
