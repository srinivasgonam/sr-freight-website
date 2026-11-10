import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import QuoteForm from '../components/QuoteForm'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { COMPANY } from '../data/companyInfo'

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'quote' | 'message'>('quote')

  // Direct Contact message form state
  const [msgData, setMsgData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [msgLoading, setMsgLoading] = useState(false)
  const [msgSuccess, setMsgSuccess] = useState(false)
  const [msgError, setMsgError] = useState<string | null>(null)

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsgLoading(true)
    setMsgError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData),
      })
      const data = await res.json()
      if (data.success) {
        setMsgSuccess(true)
        setMsgData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setMsgError(data.error || 'Failed to send message.')
      }
    } catch {
      setMsgError('Could not send message. Please contact via phone or WhatsApp.')
    } finally {
      setMsgLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#040e18] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="shell space-y-16">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400 mb-2 inline-block">
              BEGUMPET HEADQUARTERS & GLOBAL NETWORK
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Contact S R Freight
            </h1>
            <p className="text-sm md:text-base text-white/60 mt-3 leading-relaxed">
              Visit our Begumpet office or get in touch for instant cargo tariffs, customs guidance, and pickup requests across Hyderabad.
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-[#071726] border border-white/10 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <MapPin size={22} />
              </div>
              <h4 className="font-bold text-base text-white">Office Location</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Flat No. 43 / F-55, 2nd Floor, Bharani Complex, Near KIMS Hospital, Minister Road, Begumpet, Hyderabad — 500003
              </p>
              <a
                href={COMPANY.address.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-orange-400 hover:text-orange-300 inline-flex items-center gap-1 transition pt-1"
              >
                View on Google Maps <ExternalLink size={12} />
              </a>
            </div>

            <div className="p-6 bg-[#071726] border border-white/10 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Phone size={22} />
              </div>
              <h4 className="font-bold text-base text-white">Telephone & Mobile</h4>
              <div className="space-y-1 text-xs">
                <a
                  href={`tel:${COMPANY.phoneRaw}`}
                  className="block font-bold text-white hover:text-orange-400 transition"
                >
                  Mobile: {COMPANY.phone}
                </a>
                <span className="block text-white/60">Office: {COMPANY.landline}</span>
                <span className="block text-emerald-400 font-semibold text-[11px]">Direct Operations Desk</span>
              </div>
            </div>

            <div className="p-6 bg-[#071726] border border-white/10 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Mail size={22} />
              </div>
              <h4 className="font-bold text-base text-white">Email Addresses</h4>
              <div className="space-y-1 text-xs">
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="block font-bold text-white hover:text-orange-400 transition"
                >
                  {COMPANY.email}
                </a>
                <span className="block text-white/60">ops@srfreight.in</span>
                <span className="block text-white/40 text-[11px]">Response within 2 business hours</span>
              </div>
            </div>

            <div className="p-6 bg-[#071726] border border-white/10 rounded-3xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Clock size={22} />
              </div>
              <h4 className="font-bold text-base text-white">Working Hours</h4>
              <div className="space-y-1 text-xs text-white/70">
                <span className="block font-bold text-white">{COMPANY.workingHours.weekdays}</span>
                <span className="block text-white/60">Sunday: On-Duty Dispatch</span>
                <span className="block text-emerald-400 font-medium text-[11px]">24/7 Live Air Freight Monitoring</span>
              </div>
            </div>
          </div>

          {/* Form and Map Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Form Tabs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('quote')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'quote'
                      ? 'glass-tab-active'
                      : 'glass-tab-inactive'
                  }`}
                >
                  Request Freight Quote
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('message')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'message'
                      ? 'glass-tab-active'
                      : 'glass-tab-inactive'
                  }`}
                >
                  General Message / Inquiry
                </button>
              </div>

              {activeTab === 'quote' ? (
                <QuoteForm compact />
              ) : (
                <form
                  onSubmit={handleMessageSubmit}
                  className="bg-[#071726] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl"
                >
                  <h3 className="text-xl font-bold text-white mb-2">Send a Message to Begumpet Desk</h3>

                  {msgSuccess ? (
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
                      <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                      <h4 className="text-lg font-bold text-white">Message Sent Successfully!</h4>
                      <p className="text-xs text-white/70">
                        Thank you for reaching out to S R Freight. Our operations team will respond to you shortly.
                      </p>
                      <button
                        type="button"
                        onClick={() => setMsgSuccess(false)}
                        className="glass-btn-frosted px-4 py-2 text-white text-xs font-bold rounded-xl"
                      >
                        <span>Send Another Note</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      {msgError && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl flex items-center gap-2">
                          <AlertCircle size={15} /> {msgError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-white/70 mb-1">Your Name *</label>
                          <input
                            required
                            type="text"
                            value={msgData.name}
                            onChange={(e) => setMsgData({ ...msgData, name: e.target.value })}
                            placeholder="Full name"
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-white/70 mb-1">Email Address *</label>
                          <input
                            required
                            type="email"
                            value={msgData.email}
                            onChange={(e) => setMsgData({ ...msgData, email: e.target.value })}
                            placeholder="name@example.com"
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-white/70 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            value={msgData.phone}
                            onChange={(e) => setMsgData({ ...msgData, phone: e.target.value })}
                            placeholder="+91 98490 12345"
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-white/70 mb-1">Subject</label>
                          <input
                            type="text"
                            value={msgData.subject}
                            onChange={(e) => setMsgData({ ...msgData, subject: e.target.value })}
                            placeholder="e.g. Rate negotiation / Pickup inquiry"
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-white/70 mb-1">Message *</label>
                        <textarea
                          required
                          rows={4}
                          value={msgData.message}
                          onChange={(e) => setMsgData({ ...msgData, message: e.target.value })}
                          placeholder="How can we assist your consignment requirements?"
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 resize-y"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={msgLoading}
                        className="glass-btn-orange w-full py-3.5 text-white font-bold rounded-xl text-xs cursor-pointer gap-2"
                      >
                        {msgLoading ? (
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send size={15} />
                        )}
                        <span>{msgLoading ? 'Sending...' : 'Transmit Message'}</span>
                      </button>
                    </>
                  )}
                </form>
              )}
            </div>

            {/* Right 5 cols: Interactive Map & WhatsApp card */}
            <div className="lg:col-span-5 space-y-6">
              {/* Google Map Embed */}
              <div className="bg-[#071726] border border-white/10 rounded-3xl p-6 shadow-xl overflow-hidden space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <MapPin size={16} className="text-orange-400" />
                    Office Map — Minister Road, Begumpet
                  </h4>
                  <a
                    href={COMPANY.address.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1"
                  >
                    Open App <ExternalLink size={12} />
                  </a>
                </div>

                <div className="w-full h-64 rounded-2xl overflow-hidden border border-white/10 relative">
                  <iframe
                    title="SR Freight Begumpet Google Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.477747803623!2d78.48421867493593!3d17.436848183457585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9a038d17227d%3A0xe5a3bb4ff346d0a7!2sBharani%20Complex%2C%20Minister%20Rd%2C%20near%20KIMS%20Hospital%2C%20Ramgopalpet%2C%20Secunderabad%2C%20Telangana%20500003!5e0!3m2!1sen!2sin!4v1730175000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'contrast(1.05) brightness(0.95)' }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="text-xs text-white/60 space-y-1">
                  <b className="text-white block">Landmark Directions:</b>
                  <p>
                    Located directly on Minister Road, approximately 250 meters from KIMS Hospital, Begumpet, and opposite Passport Seva Kendra. Ample visitor parking available.
                  </p>
                </div>
              </div>

              {/* Direct WhatsApp Action Box */}
              <div className="p-6 bg-gradient-to-br from-emerald-950/60 to-[#071726] border border-emerald-500/30 rounded-3xl space-y-3">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  INSTANT MESSAGING
                </span>
                <h4 className="font-bold text-base text-white">Direct WhatsApp with Managing Director</h4>
                <p className="text-xs text-white/70">
                  Send packing photos, cargo manifests, or AWB tracking queries directly on WhatsApp for swift answers.
                </p>
                <a
                  href={`https://wa.me/919391032794?text=Hello%20SR%20Freight%20Begumpet,%20I%20have%20an%20urgent%20shipment%20inquiry`}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-btn-emerald w-full py-3 text-white font-bold rounded-xl text-xs gap-2 block text-center"
                >
                  <MessageCircle size={15} /> <span>Chat on WhatsApp (+91 93910 32794)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
