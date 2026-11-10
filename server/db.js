import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(__dirname, './data')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbFilePath = path.join(dataDir, 'srfreight.db')

let db = null
let useSqlite = false

// Try initializing node:sqlite
try {
  const { DatabaseSync } = await import('node:sqlite')
  db = new DatabaseSync(dbFilePath)
  db.exec('PRAGMA foreign_keys = ON;')
  db.exec('PRAGMA journal_mode = WAL;')
  useSqlite = true
  console.log('[DB] Initialized SQLite via node:sqlite at', dbFilePath)
} catch (err) {
  console.warn('[DB] node:sqlite not available, falling back to JSON storage:', err.message)
}

// Fallback JSON DB Implementation in case node:sqlite is unavailable
const jsonDbPath = path.join(dataDir, 'srfreight.json')
let jsonData = {
  quotes: [],
  shipments: [],
  shipment_checkpoints: [],
  contact_messages: [],
}

function loadJsonDb() {
  if (fs.existsSync(jsonDbPath)) {
    try {
      jsonData = JSON.parse(fs.readFileSync(jsonDbPath, 'utf-8'))
    } catch {
      saveJsonDb()
    }
  } else {
    saveJsonDb()
  }
}

function saveJsonDb() {
  fs.writeFileSync(jsonDbPath, JSON.stringify(jsonData, null, 2), 'utf-8')
}

// Initialize tables if using SQLite
if (useSqlite) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ref_code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      company TEXT,
      service_type TEXT NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      weight_kg REAL DEFAULT 0,
      cargo_type TEXT DEFAULT 'general',
      dimensions TEXT,
      message TEXT,
      status TEXT DEFAULT 'new',
      quoted_amount REAL DEFAULT 0,
      admin_notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shipments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tracking_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      customer_phone TEXT,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      service_mode TEXT NOT NULL,
      status TEXT NOT NULL,
      status_label TEXT NOT NULL,
      current_location TEXT NOT NULL,
      eta TEXT,
      estimated_delivery TEXT,
      carrier TEXT,
      flight_vessel TEXT,
      weight_kg REAL DEFAULT 0,
      packages_count INTEGER DEFAULT 1,
      cargo_description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shipment_checkpoints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tracking_number TEXT NOT NULL,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT,
      timestamp TEXT NOT NULL,
      is_completed INTEGER DEFAULT 1,
      order_index INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      created_at TEXT NOT NULL
    );
  `)
} else {
  loadJsonDb()
}

// Seed initial data if database is empty
export function seedInitialData() {
  const seedShipments = [
    {
      tracking_number: 'SR-HYD-98241',
      customer_name: 'Dr. Reddy Pharma Exports',
      customer_email: 'logistics@drreddy-sample.com',
      customer_phone: '+91 98490 12345',
      origin: 'Hyderabad (RGIA Airport), India',
      destination: 'Dubai (DXB Air Cargo), UAE',
      service_mode: 'Priority Air Freight',
      status: 'in_transit',
      status_label: 'In Transit — Transshipment En Route',
      current_location: 'Air Cargo Bay, Muscat Aviation Hub',
      eta: 'Tomorrow, 14:30 GST',
      estimated_delivery: 'Oct 30, 2026',
      carrier: 'Emirates SkyCargo / SR Freight Charter',
      flight_vessel: 'EK-527',
      weight_kg: 840,
      packages_count: 14,
      cargo_description: 'Temperature-Controlled Pharma Formulations (Cold Chain 15-25°C)',
      created_at: '2026-10-27T10:00:00Z',
      updated_at: '2026-10-29T04:15:00Z',
      checkpoints: [
        {
          title: 'Consignment Collected',
          location: 'Begumpet Hub, Hyderabad',
          description: 'Shipment received, verified, and packed in temperature-controlled thermal shipper.',
          timestamp: 'Oct 27, 2026 - 11:30 AM',
          is_completed: 1,
          order_index: 1,
        },
        {
          title: 'Customs Cleared at Hyderabad RGIA',
          location: 'Rajiv Gandhi Int. Airport (HYD)',
          description: 'Export shipping bill processed and passed through Air Customs.',
          timestamp: 'Oct 28, 2026 - 02:45 PM',
          is_completed: 1,
          order_index: 2,
        },
        {
          title: 'Departed Origin Flight',
          location: 'HYD Air Cargo Terminal',
          description: 'Flight EK-527 departed for Dubai International Airport.',
          timestamp: 'Oct 28, 2026 - 09:20 PM',
          is_completed: 1,
          order_index: 3,
        },
        {
          title: 'In Flight / Transit Hub',
          location: 'Gulf Aviation Corridor',
          description: 'Cargo currently in flight corridor. Sensors reporting optimal 19.4°C.',
          timestamp: 'Oct 29, 2026 - 07:10 AM',
          is_completed: 1,
          order_index: 4,
        },
        {
          title: 'Arrival & Final Mile Delivery',
          location: 'Dubai Airport Freezone (DAFZA), UAE',
          description: 'Scheduled for destination customs clearance and direct consignee door delivery.',
          timestamp: 'Estimated: Oct 30, 2026 - 02:30 PM',
          is_completed: 0,
          order_index: 5,
        },
      ],
    },
    {
      tracking_number: 'SR-AIR-10492',
      customer_name: 'Ananya Rao',
      customer_email: 'ananya.melb@example.com',
      customer_phone: '+61 412 345 678',
      origin: 'Begumpet, Hyderabad, India',
      destination: 'Melbourne (VIC 3000), Australia',
      service_mode: 'Worldwide Express Courier',
      status: 'customs_cleared',
      status_label: 'Customs Cleared — Destination Sorting',
      current_location: 'Tullamarine Courier Hub, Melbourne',
      eta: 'Oct 31, 2026, 11:00 AM AEST',
      estimated_delivery: 'Oct 31, 2026',
      carrier: 'SR Global Courier Express partner',
      flight_vessel: 'SQ-218 Express',
      weight_kg: 18.5,
      packages_count: 2,
      cargo_description: 'Personal Care, Traditional Medicines & High-Value Educational Documents',
      created_at: '2026-10-26T08:30:00Z',
      updated_at: '2026-10-29T02:00:00Z',
      checkpoints: [
        {
          title: 'Door Pickup in Hyderabad',
          location: 'Begumpet, Secunderabad',
          description: 'Complimentary door pickup and specialized multi-layer waterproof courier packing.',
          timestamp: 'Oct 26, 2026 - 09:00 AM',
          is_completed: 1,
          order_index: 1,
        },
        {
          title: 'Export Documentation & Despatch',
          location: 'HYD Air Courier Terminal',
          description: 'Indian export customs clearance completed with medicine doctor prescription check.',
          timestamp: 'Oct 27, 2026 - 04:30 PM',
          is_completed: 1,
          order_index: 2,
        },
        {
          title: 'Australian Border Force Clearance',
          location: 'Melbourne Airport (MEL), Australia',
          description: 'Australian quarantine (DAFF) and customs inspection completed with zero duties pending.',
          timestamp: 'Oct 29, 2026 - 06:15 AM',
          is_completed: 1,
          order_index: 3,
        },
        {
          title: 'Out for Final Delivery',
          location: 'Melbourne CBD Delivery Depot',
          description: 'Courier agent scheduled for direct delivery to residential address.',
          timestamp: 'Estimated: Oct 31, 2026 - 11:00 AM',
          is_completed: 0,
          order_index: 4,
        },
      ],
    },
    {
      tracking_number: 'SR-SEA-55201',
      customer_name: 'Telangana Precision Engineering',
      customer_email: 'exports@telanganaprecision.com',
      customer_phone: '+91 94401 55678',
      origin: 'ICD Sanathnagar (Hyderabad), India',
      destination: 'Rotterdam Port, Netherlands',
      service_mode: 'Ocean Freight FCL (40ft High Cube)',
      status: 'out_for_delivery',
      status_label: 'Vessel Berthed — Final Port Dispatch',
      current_location: 'Maasvlakte Terminal, Port of Rotterdam',
      eta: 'Today, 18:00 CET',
      estimated_delivery: 'Oct 29, 2026',
      carrier: 'Maersk Line / SR Sea Logistics',
      flight_vessel: 'Vessel MAERSK MC-KINNEY / V.2610W',
      weight_kg: 21500,
      packages_count: 24,
      cargo_description: 'Precision CNC Castings & Industrial Valve Components',
      created_at: '2026-10-02T12:00:00Z',
      updated_at: '2026-10-29T06:00:00Z',
      checkpoints: [
        {
          title: 'Container Loaded & Customs Passed',
          location: 'ICD Sanathnagar, Hyderabad',
          description: '40ft HC container stuffed, factory-sealed, and cleared at Hyderabad inland container depot.',
          timestamp: 'Oct 02, 2026 - 03:00 PM',
          is_completed: 1,
          order_index: 1,
        },
        {
          title: 'Rail Freight Transit to Gateway Port',
          location: 'JNPT Nhava Sheva, Mumbai',
          description: 'CONCOR express rake arrived at Nhava Sheva container terminal.',
          timestamp: 'Oct 06, 2026 - 08:00 AM',
          is_completed: 1,
          order_index: 2,
        },
        {
          title: 'Ocean Voyage via Suez Corridor',
          location: 'Mediterranean / North Sea Route',
          description: 'Smooth passage through maritime lanes under continuous satellite tracking.',
          timestamp: 'Oct 24, 2026 - 12:00 PM',
          is_completed: 1,
          order_index: 3,
        },
        {
          title: 'Berthed at Rotterdam Port',
          location: 'Port of Rotterdam, Netherlands',
          description: 'Container discharged, EU import declaration submitted by SR Freight partner agent.',
          timestamp: 'Oct 28, 2026 - 04:30 PM',
          is_completed: 1,
          order_index: 4,
        },
        {
          title: 'Truck Dispatched to Consignee Facility',
          location: 'Eindhoven Industrial Park, Netherlands',
          description: 'Intermodal container chassis on route to final delivery warehouse.',
          timestamp: 'Oct 29, 2026 - 09:30 AM',
          is_completed: 1,
          order_index: 5,
        },
      ],
    },
  ]

  const seedQuotes = [
    {
      ref_code: 'SRQ-2026-101',
      name: 'Venkatesh Rao',
      email: 'venkat@hyderabadagro.com',
      phone: '+91 98499 88776',
      company: 'Hyderabad Agro Commodities',
      service_type: 'ocean-freight',
      origin: 'Hyderabad ICD Sanathnagar',
      destination: 'Jebel Ali Port, Dubai',
      weight_kg: 24000,
      cargo_type: 'general',
      dimensions: '1x 20ft Standard Container',
      message: 'Need prompt FCL quote for premium quality turmeric finger export.',
      status: 'quoted',
      quoted_amount: 142000,
      admin_notes: 'Quoted INR 1,42,000 all-in including ocean freight, terminal handling, and customs clearance.',
      created_at: '2026-10-28T09:20:00Z',
      updated_at: '2026-10-28T11:45:00Z',
    },
    {
      ref_code: 'SRQ-2026-102',
      name: 'Pooja Reddy',
      email: 'pooja.r@biotechsol.in',
      phone: '+91 99887 76655',
      company: 'Genome Valley Biotech Pvt Ltd',
      service_type: 'air-freight',
      origin: 'RGIA Airport, Hyderabad',
      destination: 'Frankfurt (FRA), Germany',
      weight_kg: 160,
      cargo_type: 'pharma',
      dimensions: '4 boxes (60x50x45 cm each)',
      message: 'Urgent bio-active compounds requiring dry ice (+2 to +8°C monitoring).',
      status: 'in_review',
      quoted_amount: 0,
      admin_notes: 'Validating DGR Dangerous Goods declaration and airline slot availability.',
      created_at: '2026-10-29T02:15:00Z',
      updated_at: '2026-10-29T03:00:00Z',
    },
    {
      ref_code: 'SRQ-2026-103',
      name: 'Mohammed Kareem',
      email: 'kareem.it@secunderabad.net',
      phone: '+91 93910 11223',
      company: 'CloudMatrix Networks',
      service_type: 'courier',
      origin: 'Begumpet, Hyderabad',
      destination: 'Sydney, Australia',
      weight_kg: 8.5,
      cargo_type: 'general',
      dimensions: 'Server replacement motherboard and encrypted test drives',
      message: 'Need door to door international courier within 4 business days.',
      status: 'new',
      quoted_amount: 0,
      admin_notes: null,
      created_at: '2026-10-29T06:40:00Z',
      updated_at: '2026-10-29T06:40:00Z',
    },
  ]

  if (useSqlite) {
    const shipmentCount = db.prepare('SELECT COUNT(*) as count FROM shipments').get().count
    if (shipmentCount === 0) {
      console.log('[DB] Seeding default shipments and checkpoints...')
      const insertShipment = db.prepare(`
        INSERT INTO shipments (
          tracking_number, customer_name, customer_email, customer_phone,
          origin, destination, service_mode, status, status_label,
          current_location, eta, estimated_delivery, carrier, flight_vessel,
          weight_kg, packages_count, cargo_description, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?
        )
      `)

      const insertCheckpoint = db.prepare(`
        INSERT INTO shipment_checkpoints (
          tracking_number, title, location, description, timestamp, is_completed, order_index
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `)

      for (const s of seedShipments) {
        insertShipment.run(
          s.tracking_number, s.customer_name, s.customer_email, s.customer_phone,
          s.origin, s.destination, s.service_mode, s.status, s.status_label,
          s.current_location, s.eta, s.estimated_delivery, s.carrier, s.flight_vessel,
          s.weight_kg, s.packages_count, s.cargo_description, s.created_at, s.updated_at
        )

        for (const cp of s.checkpoints) {
          insertCheckpoint.run(
            s.tracking_number, cp.title, cp.location, cp.description,
            cp.timestamp, cp.is_completed, cp.order_index
          )
        }
      }
    }

    const quoteCount = db.prepare('SELECT COUNT(*) as count FROM quotes').get().count
    if (quoteCount === 0) {
      console.log('[DB] Seeding default quotes...')
      const insertQuote = db.prepare(`
        INSERT INTO quotes (
          ref_code, name, email, phone, company,
          service_type, origin, destination, weight_kg, cargo_type,
          dimensions, message, status, quoted_amount, admin_notes, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?
        )
      `)

      for (const q of seedQuotes) {
        insertQuote.run(
          q.ref_code, q.name, q.email, q.phone, q.company,
          q.service_type, q.origin, q.destination, q.weight_kg, q.cargo_type,
          q.dimensions, q.message, q.status, q.quoted_amount, q.admin_notes, q.created_at, q.updated_at
        )
      }
    }
  } else {
    if (!jsonData.shipments || jsonData.shipments.length === 0) {
      jsonData.shipments = seedShipments.map((s, idx) => ({ id: idx + 1, ...s }))
      jsonData.shipment_checkpoints = []
      let cpId = 1
      for (const s of seedShipments) {
        for (const cp of s.checkpoints) {
          jsonData.shipment_checkpoints.push({
            id: cpId++,
            tracking_number: s.tracking_number,
            ...cp,
          })
        }
      }
      jsonData.quotes = seedQuotes.map((q, idx) => ({ id: idx + 1, ...q }))
      saveJsonDb()
    }
  }
}

// Queries wrapper
export const dbService = {
  // Quotes
  getQuotes(filter = {}) {
    if (useSqlite) {
      let query = 'SELECT * FROM quotes'
      const conditions = []
      const params = []

      if (filter.status && filter.status !== 'all') {
        conditions.push('status = ?')
        params.push(filter.status)
      }

      if (filter.search) {
        conditions.push('(name LIKE ? OR ref_code LIKE ? OR email LIKE ? OR origin LIKE ? OR destination LIKE ?)')
        const s = `%${filter.search}%`
        params.push(s, s, s, s, s)
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ')
      }

      query += ' ORDER BY id DESC'
      return db.prepare(query).all(...params)
    } else {
      loadJsonDb()
      let result = [...jsonData.quotes]
      if (filter.status && filter.status !== 'all') {
        result = result.filter(q => q.status === filter.status)
      }
      if (filter.search) {
        const s = filter.search.toLowerCase()
        result = result.filter(q =>
          q.name.toLowerCase().includes(s) ||
          q.ref_code.toLowerCase().includes(s) ||
          q.email.toLowerCase().includes(s) ||
          q.origin.toLowerCase().includes(s) ||
          q.destination.toLowerCase().includes(s)
        )
      }
      return result.sort((a, b) => b.id - a.id)
    }
  },

  createQuote(data) {
    const now = new Date().toISOString()
    const rand = Math.floor(1000 + Math.random() * 9000)
    const ref_code = `SRQ-${new Date().getFullYear()}-${rand}`

    if (useSqlite) {
      const stmt = db.prepare(`
        INSERT INTO quotes (
          ref_code, name, email, phone, company,
          service_type, origin, destination, weight_kg, cargo_type,
          dimensions, message, status, quoted_amount, admin_notes, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, 'new', 0, NULL, ?, ?
        )
      `)

      const info = stmt.run(
        ref_code,
        data.name || '',
        data.email || '',
        data.phone || '',
        data.company || '',
        data.service_type || 'air-freight',
        data.origin || '',
        data.destination || '',
        parseFloat(data.weight_kg) || 0,
        data.cargo_type || 'general',
        data.dimensions || '',
        data.message || '',
        now,
        now
      )

      return db.prepare('SELECT * FROM quotes WHERE id = ?').get(info.lastInsertRowid)
    } else {
      loadJsonDb()
      const newQuote = {
        id: (jsonData.quotes.length > 0 ? Math.max(...jsonData.quotes.map(q => q.id)) + 1 : 1),
        ref_code,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        company: data.company || '',
        service_type: data.service_type || 'air-freight',
        origin: data.origin || '',
        destination: data.destination || '',
        weight_kg: parseFloat(data.weight_kg) || 0,
        cargo_type: data.cargo_type || 'general',
        dimensions: data.dimensions || '',
        message: data.message || '',
        status: 'new',
        quoted_amount: 0,
        admin_notes: null,
        created_at: now,
        updated_at: now,
      }
      jsonData.quotes.push(newQuote)
      saveJsonDb()
      return newQuote
    }
  },

  updateQuote(id, updates) {
    const now = new Date().toISOString()
    if (useSqlite) {
      const current = db.prepare('SELECT * FROM quotes WHERE id = ?').get(id)
      if (!current) return null

      const status = updates.status !== undefined ? updates.status : current.status
      const quoted_amount = updates.quoted_amount !== undefined ? parseFloat(updates.quoted_amount) : current.quoted_amount
      const admin_notes = updates.admin_notes !== undefined ? updates.admin_notes : current.admin_notes

      db.prepare(`
        UPDATE quotes
        SET status = ?, quoted_amount = ?, admin_notes = ?, updated_at = ?
        WHERE id = ?
      `).run(status, quoted_amount, admin_notes, now, id)

      return db.prepare('SELECT * FROM quotes WHERE id = ?').get(id)
    } else {
      loadJsonDb()
      const quote = jsonData.quotes.find(q => q.id === parseInt(id))
      if (!quote) return null

      if (updates.status !== undefined) quote.status = updates.status
      if (updates.quoted_amount !== undefined) quote.quoted_amount = parseFloat(updates.quoted_amount)
      if (updates.admin_notes !== undefined) quote.admin_notes = updates.admin_notes
      quote.updated_at = now
      saveJsonDb()
      return quote
    }
  },

  deleteQuote(id) {
    if (useSqlite) {
      db.prepare('DELETE FROM quotes WHERE id = ?').run(id)
      return true
    } else {
      loadJsonDb()
      jsonData.quotes = jsonData.quotes.filter(q => q.id !== parseInt(id))
      saveJsonDb()
      return true
    }
  },

  // Shipments & Tracking
  getShipmentByTracking(trackingNumber) {
    const cleanId = String(trackingNumber || '').trim().toUpperCase()
    if (useSqlite) {
      const shipment = db.prepare('SELECT * FROM shipments WHERE UPPER(tracking_number) = ?').get(cleanId)
      if (!shipment) return null

      const checkpoints = db.prepare(`
        SELECT * FROM shipment_checkpoints
        WHERE UPPER(tracking_number) = ?
        ORDER BY order_index ASC, id ASC
      `).all(cleanId)

      return {
        ...shipment,
        checkpoints,
      }
    } else {
      loadJsonDb()
      const shipment = jsonData.shipments.find(s => s.tracking_number.toUpperCase() === cleanId)
      if (!shipment) return null
      const checkpoints = jsonData.shipment_checkpoints
        .filter(cp => cp.tracking_number.toUpperCase() === cleanId)
        .sort((a, b) => a.order_index - b.order_index)

      return {
        ...shipment,
        checkpoints,
      }
    }
  },

  getAllShipments() {
    if (useSqlite) {
      const shipments = db.prepare('SELECT * FROM shipments ORDER BY id DESC').all()
      return shipments.map(s => {
        const checkpoints = db.prepare('SELECT * FROM shipment_checkpoints WHERE tracking_number = ? ORDER BY order_index ASC').all(s.tracking_number)
        return { ...s, checkpoints }
      })
    } else {
      loadJsonDb()
      return jsonData.shipments.map(s => {
        const checkpoints = jsonData.shipment_checkpoints
          .filter(cp => cp.tracking_number === s.tracking_number)
          .sort((a, b) => a.order_index - b.order_index)
        return { ...s, checkpoints }
      }).reverse()
    }
  },

  createShipment(data) {
    const now = new Date().toISOString()
    const tracking_number = data.tracking_number || `SR-${data.service_mode?.includes('Ocean') ? 'SEA' : 'AIR'}-${Math.floor(10000 + Math.random() * 90000)}`

    if (useSqlite) {
      db.prepare(`
        INSERT INTO shipments (
          tracking_number, customer_name, customer_email, customer_phone,
          origin, destination, service_mode, status, status_label,
          current_location, eta, estimated_delivery, carrier, flight_vessel,
          weight_kg, packages_count, cargo_description, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?
        )
      `).run(
        tracking_number,
        data.customer_name || 'Valued Customer',
        data.customer_email || '',
        data.customer_phone || '',
        data.origin || 'Hyderabad, India',
        data.destination || 'International Destination',
        data.service_mode || 'Air Freight',
        data.status || 'booked',
        data.status_label || 'Consignment Booked',
        data.current_location || 'Begumpet Hub, Hyderabad',
        data.eta || 'Pending Schedule',
        data.estimated_delivery || 'To be confirmed',
        data.carrier || 'SR Freight Global Network',
        data.flight_vessel || 'TBD',
        parseFloat(data.weight_kg) || 0,
        parseInt(data.packages_count) || 1,
        data.cargo_description || 'Commercial Freight',
        now,
        now
      )

      // Add default first checkpoint
      db.prepare(`
        INSERT INTO shipment_checkpoints (
          tracking_number, title, location, description, timestamp, is_completed, order_index
        ) VALUES (?, ?, ?, ?, ?, 1, 1)
      `).run(
        tracking_number,
        'Booking Confirmed & AWB Generated',
        'Begumpet Operations Desk, Hyderabad',
        'Consignment scheduled for dispatch and customs processing.',
        new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      )

      return this.getShipmentByTracking(tracking_number)
    } else {
      loadJsonDb()
      const newShipment = {
        id: (jsonData.shipments.length > 0 ? Math.max(...jsonData.shipments.map(s => s.id)) + 1 : 1),
        tracking_number,
        customer_name: data.customer_name || 'Valued Customer',
        customer_email: data.customer_email || '',
        customer_phone: data.customer_phone || '',
        origin: data.origin || 'Hyderabad, India',
        destination: data.destination || 'International Destination',
        service_mode: data.service_mode || 'Air Freight',
        status: data.status || 'booked',
        status_label: data.status_label || 'Consignment Booked',
        current_location: data.current_location || 'Begumpet Hub, Hyderabad',
        eta: data.eta || 'Pending Schedule',
        estimated_delivery: data.estimated_delivery || 'To be confirmed',
        carrier: data.carrier || 'SR Freight Global Network',
        flight_vessel: data.flight_vessel || 'TBD',
        weight_kg: parseFloat(data.weight_kg) || 0,
        packages_count: parseInt(data.packages_count) || 1,
        cargo_description: data.cargo_description || 'Commercial Freight',
        created_at: now,
        updated_at: now,
      }
      jsonData.shipments.push(newShipment)
      jsonData.shipment_checkpoints.push({
        id: (jsonData.shipment_checkpoints.length > 0 ? Math.max(...jsonData.shipment_checkpoints.map(cp => cp.id)) + 1 : 1),
        tracking_number,
        title: 'Booking Confirmed & AWB Generated',
        location: 'Begumpet Operations Desk, Hyderabad',
        description: 'Consignment scheduled for dispatch and customs processing.',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        is_completed: 1,
        order_index: 1,
      })
      saveJsonDb()
      return this.getShipmentByTracking(tracking_number)
    }
  },

  updateShipment(trackingNumber, updates) {
    const cleanId = String(trackingNumber || '').trim().toUpperCase()
    const now = new Date().toISOString()

    if (useSqlite) {
      const shipment = db.prepare('SELECT * FROM shipments WHERE UPPER(tracking_number) = ?').get(cleanId)
      if (!shipment) return null

      const status = updates.status !== undefined ? updates.status : shipment.status
      const status_label = updates.status_label !== undefined ? updates.status_label : shipment.status_label
      const current_location = updates.current_location !== undefined ? updates.current_location : shipment.current_location
      const eta = updates.eta !== undefined ? updates.eta : shipment.eta

      db.prepare(`
        UPDATE shipments
        SET status = ?, status_label = ?, current_location = ?, eta = ?, updated_at = ?
        WHERE UPPER(tracking_number) = ?
      `).run(status, status_label, current_location, eta, now, cleanId)

      if (updates.newCheckpoint) {
        const lastOrder = db.prepare(`
          SELECT MAX(order_index) as max_idx FROM shipment_checkpoints WHERE UPPER(tracking_number) = ?
        `).get(cleanId)?.max_idx || 0

        db.prepare(`
          INSERT INTO shipment_checkpoints (
            tracking_number, title, location, description, timestamp, is_completed, order_index
          ) VALUES (?, ?, ?, ?, ?, 1, ?)
        `).run(
          cleanId,
          updates.newCheckpoint.title || 'Checkpoint Update',
          updates.newCheckpoint.location || current_location,
          updates.newCheckpoint.description || '',
          updates.newCheckpoint.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          lastOrder + 1
        )
      }

      return this.getShipmentByTracking(cleanId)
    } else {
      loadJsonDb()
      const shipment = jsonData.shipments.find(s => s.tracking_number.toUpperCase() === cleanId)
      if (!shipment) return null

      if (updates.status !== undefined) shipment.status = updates.status
      if (updates.status_label !== undefined) shipment.status_label = updates.status_label
      if (updates.current_location !== undefined) shipment.current_location = updates.current_location
      if (updates.eta !== undefined) shipment.eta = updates.eta
      shipment.updated_at = now

      if (updates.newCheckpoint) {
        const existingCps = jsonData.shipment_checkpoints.filter(cp => cp.tracking_number.toUpperCase() === cleanId)
        const maxIdx = existingCps.length > 0 ? Math.max(...existingCps.map(c => c.order_index)) : 0

        jsonData.shipment_checkpoints.push({
          id: (jsonData.shipment_checkpoints.length > 0 ? Math.max(...jsonData.shipment_checkpoints.map(cp => cp.id)) + 1 : 1),
          tracking_number: cleanId,
          title: updates.newCheckpoint.title || 'Checkpoint Update',
          location: updates.newCheckpoint.location || shipment.current_location,
          description: updates.newCheckpoint.description || '',
          timestamp: updates.newCheckpoint.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          is_completed: 1,
          order_index: maxIdx + 1,
        })
      }

      saveJsonDb()
      return this.getShipmentByTracking(cleanId)
    }
  },

  // Contact Messages
  createContactMessage(data) {
    const now = new Date().toISOString()
    if (useSqlite) {
      const stmt = db.prepare(`
        INSERT INTO contact_messages (name, email, phone, subject, message, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'new', ?)
      `)
      const info = stmt.run(
        data.name || '',
        data.email || '',
        data.phone || '',
        data.subject || 'General Enquiry',
        data.message || '',
        now
      )
      return db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(info.lastInsertRowid)
    } else {
      loadJsonDb()
      const newMsg = {
        id: (jsonData.contact_messages.length > 0 ? Math.max(...jsonData.contact_messages.map(m => m.id)) + 1 : 1),
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        subject: data.subject || 'General Enquiry',
        message: data.message || '',
        status: 'new',
        created_at: now,
      }
      jsonData.contact_messages.push(newMsg)
      saveJsonDb()
      return newMsg
    }
  },

  getContactMessages() {
    if (useSqlite) {
      return db.prepare('SELECT * FROM contact_messages ORDER BY id DESC').all()
    } else {
      loadJsonDb()
      return [...jsonData.contact_messages].reverse()
    }
  },

  // Overview Stats
  getStats() {
    if (useSqlite) {
      const totalQuotes = db.prepare('SELECT COUNT(*) as c FROM quotes').get().c
      const pendingQuotes = db.prepare("SELECT COUNT(*) as c FROM quotes WHERE status = 'new'").get().c
      const activeShipments = db.prepare("SELECT COUNT(*) as c FROM shipments WHERE status IN ('booked', 'picked_up', 'in_transit', 'customs_cleared', 'out_for_delivery')").get().c
      const deliveredShipments = db.prepare("SELECT COUNT(*) as c FROM shipments WHERE status = 'delivered'").get().c
      const contactMessages = db.prepare('SELECT COUNT(*) as c FROM contact_messages').get().c

      return {
        totalQuotes,
        pendingQuotes,
        activeShipments,
        deliveredShipments,
        contactMessages,
      }
    } else {
      loadJsonDb()
      return {
        totalQuotes: jsonData.quotes.length,
        pendingQuotes: jsonData.quotes.filter(q => q.status === 'new').length,
        activeShipments: jsonData.shipments.filter(s => ['booked', 'picked_up', 'in_transit', 'customs_cleared', 'out_for_delivery'].includes(s.status)).length,
        deliveredShipments: jsonData.shipments.filter(s => s.status === 'delivered').length,
        contactMessages: jsonData.contact_messages.length,
      }
    }
  },
}
