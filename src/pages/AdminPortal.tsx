import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import {
  ShieldCheck,
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Download,
  Lock,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react'
import { COMPANY } from '../data/companyInfo'

interface Quote {
  id: number
  ref_code: string
  name: string
  email: string
  phone: string
  company: string
  service_type: string
  origin: string
  destination: string
  weight_kg: number
  cargo_type: string
  dimensions: string
  message: string
  status: string
  quoted_amount: number
  admin_notes: string
  created_at: string
}

interface Shipment {
  id: number
  tracking_number: string
  customer_name: string
  origin: string
  destination: string
  service_mode: string
  status: string
  status_label: string
  current_location: string
  eta: string
  carrier: string
  flight_vessel: string
  weight_kg: number
  packages_count: number
  created_at: string
}

export default function AdminPortal() {
  const [authenticated, setAuthenticated] = useState(false)
  const [passkey, setPasskey] = useState('')
  const [passError, setPassError] = useState(false)

  const [activeTab, setActiveTab] = useState<'quotes' | 'shipments' | 'contacts'>('quotes')
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const [quoteFilter, setQuoteFilter] = useState('all')
  const [quoteSearch, setQuoteSearch] = useState('')

  // New Shipment Modal State
  const [newShipmentOpen, setNewShipmentOpen] = useState(false)
  const [newShipmentData, setNewShipmentData] = useState({
    tracking_number: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    origin: 'Hyderabad (RGIA Airport), India',
    destination: 'Dubai (DXB), UAE',
    service_mode: 'Priority Air Freight',
    status: 'in_transit',
    status_label: 'In Transit — Transshipment Hub',
    current_location: 'Begumpet Hub, Hyderabad',
    eta: 'Tomorrow, 14:00 GST',
    estimated_delivery: 'Oct 31, 2026',
    carrier: 'Emirates SkyCargo / SR Freight',
    flight_vessel: 'EK-527',
    weight_kg: 120,
    packages_count: 3,
    cargo_description: 'Commercial Cargo',
  })

  // Check authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Default passkey for SR Freight operations desk
    if (passkey === 'srfreight2025' || passkey === 'admin' || passkey === 'begumpet') {
      setAuthenticated(true)
      setPassError(false)
    } else {
      setPassError(true)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [resQuotes, resShipments, resContacts, resStats] = await Promise.all([
        fetch(`/api/quotes?status=${quoteFilter}&search=${encodeURIComponent(quoteSearch)}`),
        fetch('/api/shipments'),
        fetch('/api/contact'),
        fetch('/api/stats'),
      ])

      const dQuotes = await resQuotes.json()
      const dShipments = await resShipments.json()
      const dContacts = await resContacts.json()
      const dStats = await resStats.json()

      if (dQuotes.success) setQuotes(dQuotes.quotes || [])
      if (dShipments.success) setShipments(dShipments.shipments || [])
      if (dContacts.success) setContacts(dContacts.messages || [])
      if (dStats.success) setStats(dStats.stats || null)
    } catch (err) {
      console.error('Admin fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authenticated) {
      fetchData()
    }
  }, [authenticated, quoteFilter])

  const handleUpdateQuote = async (id: number, status: string, quoted_amount?: number) => {
    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, quoted_amount }),
      })
      const data = await res.json()
      if (data.success) {
        setQuotes(quotes.map((q) => (q.id === id ? data.quote : q)))
      }
    } catch (err) {
      console.error('Failed to update quote:', err)
    }
  }

  const handleDeleteQuote = async (id: number) => {
    if (!confirm('Are you sure you want to delete this quote record?')) return
    try {
      await fetch(`/api/quotes/${id}`, { method: 'DELETE' })
      setQuotes(quotes.filter((q) => q.id !== id))
    } catch (err) {
      console.error('Delete quote failed:', err)
    }
  }

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShipmentData),
      })
      const data = await res.json()
      if (data.success) {
        setNewShipmentOpen(false)
        fetchData()
      }
    } catch (err) {
      console.error('Create shipment failed:', err)
    }
  }

  const exportQuotesCsv = () => {
    const headers = ['Ref Code', 'Date', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Origin', 'Destination', 'Weight (KG)', 'Status', 'Quoted Amount (INR)']
    const rows = quotes.map((q) => [
      q.ref_code,
      new Date(q.created_at).toLocaleDateString(),
      `"${q.name}"`,
      q.email,
      q.phone,
      `"${q.company || ''}"`,
      q.service_type,
      `"${q.origin}"`,
      `"${q.destination}"`,
      q.weight_kg,
      q.status,
      q.quoted_amount,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `sr_freight_quotes_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Login view
  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#040e18] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#071726] border border-white/15 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-14 h-14 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-black text-white">S R Freight Staff Portal</h2>
          <p className="text-xs text-white/60 mt-1 mb-6">
            Authorized Begumpet Operations & Quotations Management
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="Enter Staff Passkey (default: srfreight2025)"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 font-mono text-center tracking-wider"
            />
            {passError && (
              <p className="text-xs text-red-400 font-semibold">
                Invalid passkey. Hint: Use <code className="bg-white/10 px-1 py-0.5 rounded">srfreight2025</code>
              </p>
            )}
            <button
              type="submit"
              className="glass-btn-orange w-full py-3.5 text-white font-bold rounded-xl text-sm cursor-pointer"
            >
              <span>Access Dashboard</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10">
            <Link to="/" className="text-xs text-white/50 hover:text-white inline-flex items-center gap-1.5 transition">
              <ArrowLeft size={13} /> Return to Public Website
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#040e18] text-white">
      {/* Admin Header */}
      <header className="bg-[#071726] border-b border-white/10 sticky top-0 z-30">
        <div className="shell py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-white/60 hover:text-white p-2 bg-white/5 rounded-lg transition" title="Back to site">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-base font-black tracking-wide flex items-center gap-2">
                <span>S R FREIGHT</span>
                <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-bold">
                  OPERATIONS DESK
                </span>
              </h1>
              <p className="text-[11px] text-white/50">Begumpet Hub • Managing Director: {COMPANY.founder}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              title="Refresh Data"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button
              type="button"
              onClick={() => setAuthenticated(false)}
              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 rounded-lg text-xs font-semibold transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="shell py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-[#071726] border border-white/10 rounded-2xl">
            <span className="text-[11px] text-white/50 uppercase font-bold tracking-wider block mb-1">
              Total Inquiries
            </span>
            <span className="text-3xl font-black text-white">{stats?.totalQuotes ?? quotes.length}</span>
            <span className="text-[10px] text-orange-400 block mt-1">From online & Begumpet desk</span>
          </div>

          <div className="p-5 bg-[#071726] border border-white/10 rounded-2xl">
            <span className="text-[11px] text-white/50 uppercase font-bold tracking-wider block mb-1">
              Pending Review
            </span>
            <span className="text-3xl font-black text-amber-300">
              {stats?.pendingQuotes ?? quotes.filter((q) => q.status === 'new').length}
            </span>
            <span className="text-[10px] text-white/40 block mt-1">Requires tariff quotation</span>
          </div>

          <div className="p-5 bg-[#071726] border border-white/10 rounded-2xl">
            <span className="text-[11px] text-white/50 uppercase font-bold tracking-wider block mb-1">
              Active Shipments
            </span>
            <span className="text-3xl font-black text-sky-400">
              {stats?.activeShipments ?? shipments.length}
            </span>
            <span className="text-[10px] text-white/40 block mt-1">Live in transit / customs</span>
          </div>

          <div className="p-5 bg-[#071726] border border-white/10 rounded-2xl">
            <span className="text-[11px] text-white/50 uppercase font-bold tracking-wider block mb-1">
              Contact Queries
            </span>
            <span className="text-3xl font-black text-emerald-400">
              {stats?.contactMessages ?? contacts.length}
            </span>
            <span className="text-[10px] text-white/40 block mt-1">Direct general messages</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('quotes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'quotes'
                  ? 'glass-tab-active'
                  : 'glass-tab-inactive'
              }`}
            >
              Shipment Quotes ({quotes.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shipments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'shipments'
                  ? 'glass-tab-active'
                  : 'glass-tab-inactive'
              }`}
            >
              Live Tracking AWBs ({shipments.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contacts')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'contacts'
                  ? 'glass-tab-active'
                  : 'glass-tab-inactive'
              }`}
            >
              Contact Inquiries ({contacts.length})
            </button>
          </div>

          {activeTab === 'quotes' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={exportQuotesCsv}
                className="glass-btn-emerald px-3.5 py-2 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Download size={14} /> <span>Export CSV</span>
              </button>
            </div>
          )}

          {activeTab === 'shipments' && (
            <button
              type="button"
              onClick={() => setNewShipmentOpen(true)}
              className="glass-btn-orange px-3.5 py-2 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus size={14} /> <span>New Consignment AWB</span>
            </button>
          )}
        </div>

        {/* Tab 1: Quotes Management */}
        {activeTab === 'quotes' && (
          <div className="space-y-4">
            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-[#071726] p-3 rounded-xl border border-white/10">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={quoteSearch}
                  onChange={(e) => setQuoteSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                  placeholder="Search by customer, company, ref code, or city..."
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter size={14} className="text-white/40 ml-2" />
                <select
                  value={quoteFilter}
                  onChange={(e) => setQuoteFilter(e.target.value)}
                  className="bg-[#0a1c2e] border border-white/10 rounded-lg text-xs text-white px-3 py-2 focus:outline-none focus:border-orange-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New (Pending)</option>
                  <option value="in_review">In Review</option>
                  <option value="quoted">Quoted</option>
                  <option value="closed">Closed / Dispatched</option>
                </select>
              </div>
            </div>

            {/* Quotes Table */}
            <div className="bg-[#071726] border border-white/10 rounded-2xl overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#05111d] text-white/50 uppercase tracking-wider font-mono border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Ref Code</th>
                    <th className="py-3 px-4">Client / Company</th>
                    <th className="py-3 px-4">Mode & Route</th>
                    <th className="py-3 px-4">Cargo / Weight</th>
                    <th className="py-3 px-4">Quoted Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  {quotes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-white/40">
                        No quote inquiries found matching this criteria.
                      </td>
                    </tr>
                  ) : (
                    quotes.map((q) => (
                      <tr key={q.id} className="hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-orange-400 whitespace-nowrap">
                          {q.ref_code}
                          <span className="block text-[10px] text-white/40 font-normal">
                            {new Date(q.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{q.name}</span>
                          <span className="text-[11px] text-white/60 block">{q.company || 'Individual'}</span>
                          <span className="text-[10px] text-white/40">{q.phone} • {q.email}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-white block capitalize">
                            {q.service_type.replace('-', ' ')}
                          </span>
                          <span className="text-[11px] text-white/60">
                            {q.origin} → {q.destination}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{q.weight_kg} KG</span>
                          <span className="text-[10px] text-white/50 block capitalize">{q.cargo_type}</span>
                          {q.dimensions && (
                            <span className="text-[10px] text-white/40 truncate max-w-[150px] block">
                              {q.dimensions}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {q.quoted_amount > 0 ? (
                            <span className="font-mono font-bold text-emerald-400">
                              ₹{q.quoted_amount.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="text-white/40 italic">Pending quote</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={q.status}
                            onChange={(e) => handleUpdateQuote(q.id, e.target.value)}
                            className="bg-black/30 border border-white/20 rounded px-2 py-1 text-[11px] font-semibold text-white focus:outline-none"
                          >
                            <option value="new">New</option>
                            <option value="in_review">In Review</option>
                            <option value="quoted">Quoted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              const amount = prompt('Enter quoted amount in INR:', String(q.quoted_amount || ''))
                              if (amount !== null) {
                                handleUpdateQuote(q.id, q.status, parseFloat(amount) || 0)
                              }
                            }}
                            className="p-1.5 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition"
                            title="Set Quote Amount"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuote(q.id)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Shipments Management */}
        {activeTab === 'shipments' && (
          <div className="space-y-4">
            <div className="bg-[#071726] border border-white/10 rounded-2xl overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#05111d] text-white/50 uppercase tracking-wider font-mono border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">AWB / Tracking ID</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Mode & Carrier</th>
                    <th className="py-3 px-4">Route</th>
                    <th className="py-3 px-4">Current Status / Location</th>
                    <th className="py-3 px-4">ETA</th>
                    <th className="py-3 px-4 text-right">Live View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  {shipments.map((s) => (
                    <tr key={s.id} className="hover:bg-white/5 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-orange-400 whitespace-nowrap">
                        {s.tracking_number}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">{s.customer_name}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white block">{s.service_mode}</span>
                        <span className="text-[10px] text-white/50">{s.carrier} ({s.flight_vessel})</span>
                      </td>
                      <td className="py-3.5 px-4 text-white/70">
                        {s.origin.split(',')[0]} → {s.destination.split(',')[0]}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-emerald-400 block">{s.status_label}</span>
                        <span className="text-[10px] text-white/50">{s.current_location}</span>
                      </td>
                      <td className="py-3.5 px-4 text-amber-300 font-medium">{s.eta}</td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/track?id=${s.tracking_number}`}
                          target="_blank"
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white rounded text-[11px] inline-flex items-center gap-1 transition"
                        >
                          Customer View <ExternalLink size={11} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Contact Messages */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <div className="bg-[#071726] border border-white/10 rounded-2xl overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#05111d] text-white/50 uppercase tracking-wider font-mono border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">From</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Message</th>
                    <th className="py-3 px-4 text-right">Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-white/40">
                        No contact inquiries received yet.
                      </td>
                    </tr>
                  ) : (
                    contacts.map((c) => (
                      <tr key={c.id} className="hover:bg-white/5 transition">
                        <td className="py-3.5 px-4 text-white/40 whitespace-nowrap">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{c.name}</span>
                          <span className="text-[11px] text-white/50">{c.email}</span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-orange-300">{c.subject}</td>
                        <td className="py-3.5 px-4 text-white/70 max-w-md">{c.message}</td>
                        <td className="py-3.5 px-4 text-right font-mono text-emerald-400">
                          {c.phone || 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* New Shipment Modal */}
      {newShipmentOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#071726] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-black text-white mb-4">Generate New Consignment Tracking AWB</h3>
            <form onSubmit={handleCreateShipment} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/60 mb-1">Tracking Number / AWB</label>
                <input
                  type="text"
                  value={newShipmentData.tracking_number}
                  onChange={(e) => setNewShipmentData({ ...newShipmentData, tracking_number: e.target.value })}
                  placeholder="e.g. SR-AIR-88210 (Leave blank for auto-generate)"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 mb-1">Customer / Consignee Name *</label>
                  <input
                    required
                    type="text"
                    value={newShipmentData.customer_name}
                    onChange={(e) => setNewShipmentData({ ...newShipmentData, customer_name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">Service Mode</label>
                  <select
                    value={newShipmentData.service_mode}
                    onChange={(e) => setNewShipmentData({ ...newShipmentData, service_mode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a1c2e] border border-white/10 rounded-lg text-white"
                  >
                    <option>Priority Air Freight</option>
                    <option>Ocean Freight FCL (Container)</option>
                    <option>Ocean Freight LCL (Consolidation)</option>
                    <option>Worldwide Express Courier</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 mb-1">Origin Point *</label>
                  <input
                    required
                    type="text"
                    value={newShipmentData.origin}
                    onChange={(e) => setNewShipmentData({ ...newShipmentData, origin: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">Destination Point *</label>
                  <input
                    required
                    type="text"
                    value={newShipmentData.destination}
                    onChange={(e) => setNewShipmentData({ ...newShipmentData, destination: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 mb-1">Carrier / Airline / Shipping Line</label>
                  <input
                    type="text"
                    value={newShipmentData.carrier}
                    onChange={(e) => setNewShipmentData({ ...newShipmentData, carrier: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">Flight / Vessel No.</label>
                  <input
                    type="text"
                    value={newShipmentData.flight_vessel}
                    onChange={(e) => setNewShipmentData({ ...newShipmentData, flight_vessel: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 mb-1">Weight (KG)</label>
                  <input
                    type="number"
                    value={newShipmentData.weight_kg}
                    onChange={(e) => setNewShipmentData({ ...newShipmentData, weight_kg: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">Est. Delivery Date</label>
                  <input
                    type="text"
                    value={newShipmentData.estimated_delivery}
                    onChange={(e) => setNewShipmentData({ ...newShipmentData, estimated_delivery: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setNewShipmentOpen(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold shadow-lg"
                >
                  Create Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
