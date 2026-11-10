import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RateCalculator from '../components/RateCalculator'
import QuoteForm from '../components/QuoteForm'
import { CheckCircle2, ShieldCheck, Clock } from 'lucide-react'

export default function CalculatorPage() {
  const [prefilledQuote, setPrefilledQuote] = useState<{
    service_type: string
    origin: string
    destination: string
    weight_kg: number
    cargo_type: string
    dimensions: string
  } | null>(null)

  const handleApplyToQuote = (data: any) => {
    setPrefilledQuote(data)
    const quoteEl = document.getElementById('formal-quote')
    if (quoteEl) {
      quoteEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#040e18] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="shell space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400 mb-2 inline-block">
              INSTANT FREIGHT ESTIMATOR
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              International Freight Tariff Calculator
            </h1>
            <p className="text-sm md:text-base text-white/60 mt-3">
              Calculate indicative air cargo, ocean container, and express courier costs from Hyderabad to key global destinations with zero hidden charges.
            </p>
          </div>

          {/* Calculator Tool */}
          <RateCalculator onApplyToQuote={handleApplyToQuote} />

          {/* Tariff Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div className="bg-[#071726] border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-3">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-bold text-base text-white mb-1">Volumetric Formula Compliance</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Standard IATA divisor (L×W×H / 5000 or 6000) for air and IMO standard 1 CBM = 1000 kg for maritime shipments ensures accurate billing.
              </p>
            </div>

            <div className="bg-[#071726] border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <CheckCircle2 size={20} />
              </div>
              <h4 className="font-bold text-base text-white mb-1">Direct Airline & Carrier Contracts</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                28+ years of carrier partnerships enable S R Freight to provide preferred spot rates and protected cargo space out of Hyderabad.
              </p>
            </div>

            <div className="bg-[#071726] border border-white/10 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
                <Clock size={20} />
              </div>
              <h4 className="font-bold text-base text-white mb-1">Formal Quotation within 2 Hours</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Submit your shipment details below and our Begumpet operations desk will provide an official route plan and binding tariff sheet.
              </p>
            </div>
          </div>

          {/* Formal Quote Section */}
          <div id="formal-quote" className="pt-8">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                STEP 2: BINDING QUOTATION
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">Request Your Formal Route Tariff</h3>
              <p className="text-xs text-white/60 mt-2">
                Need door-to-door customs assistance, duty drawback, or hazardous cargo certification? Submit below for immediate review.
              </p>
            </div>

            <QuoteForm
              initialService={prefilledQuote?.service_type || 'air-freight'}
              initialOrigin={prefilledQuote?.origin || 'Hyderabad, India'}
              initialDestination={prefilledQuote?.destination || ''}
              initialWeight={prefilledQuote?.weight_kg || 0}
              initialCargoType={prefilledQuote?.cargo_type || 'general'}
              initialDimensions={prefilledQuote?.dimensions || ''}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
