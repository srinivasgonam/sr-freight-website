import express from 'express'
import cors from 'cors'
import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dbService, seedInitialData } from './db.js'
import { calculateFreightRate } from './rateEngine.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000

// Behind a hosting proxy (Render etc.) so req.ip reflects the real client
app.set('trust proxy', 1)

// Initialize database with realistic seed records
seedInitialData()

// Middlewares
app.use(cors())
app.use(express.json())

// Request logger for API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`)
  }
  next()
})

/* ==========================================================================
   API ROUTES
   ========================================================================== */

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    company: 'S R Freight Logistics & Transport (Begumpet, Hyderabad)',
    experience: '28+ Years Freight Operations (Est. 1995)',
    phone: '+91 93910 32794',
    email: 'info@srfreight.in',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

/* ==========================================================================
   ADMIN AUTHENTICATION
   Staff sign in with ADMIN_PASSKEY and receive a signed, expiring token that
   must accompany every admin API request as "Authorization: Bearer <token>".
   ========================================================================== */
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
// In production the passkey must come from the environment; the fallback is for local development only.
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || (IS_PRODUCTION ? '' : 'srfreight2025')
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const LOGIN_MAX_ATTEMPTS = 10
const loginAttempts = new Map()

if (!ADMIN_PASSKEY) {
  console.warn('[AUTH] ADMIN_PASSKEY is not set — the staff portal is disabled until it is configured.')
}

const safeEqual = (a, b) => {
  const ha = crypto.createHash('sha256').update(String(a)).digest()
  const hb = crypto.createHash('sha256').update(String(b)).digest()
  return crypto.timingSafeEqual(ha, hb)
}

const signExpiry = (expiry) => crypto.createHmac('sha256', ADMIN_PASSKEY).update(`admin:${expiry}`).digest('hex')

const issueAdminToken = () => {
  const expiry = Date.now() + TOKEN_TTL_MS
  return `${expiry}.${signExpiry(expiry)}`
}

const isValidAdminToken = (token) => {
  if (!ADMIN_PASSKEY || typeof token !== 'string') return false
  const [expiry, signature] = token.split('.')
  if (!expiry || !signature || !/^\d+$/.test(expiry)) return false
  if (Number(expiry) < Date.now()) return false
  return safeEqual(signature, signExpiry(expiry))
}

const requireAdmin = (req, res, next) => {
  const header = req.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!isValidAdminToken(token)) {
    return res.status(401).json({ success: false, error: 'Staff sign-in required.' })
  }
  next()
}

app.post('/api/admin/login', (req, res) => {
  if (!ADMIN_PASSKEY) {
    return res.status(503).json({ success: false, error: 'Staff portal is not configured on this server.' })
  }

  const now = Date.now()
  const key = req.ip || 'unknown'
  const entry = loginAttempts.get(key)
  const attempts = entry && now - entry.first < LOGIN_WINDOW_MS ? entry : { first: now, count: 0 }
  if (attempts.count >= LOGIN_MAX_ATTEMPTS) {
    return res.status(429).json({ success: false, error: 'Too many attempts. Please try again in 15 minutes.' })
  }

  if (!safeEqual(req.body?.passkey ?? '', ADMIN_PASSKEY)) {
    attempts.count += 1
    loginAttempts.set(key, attempts)
    return res.status(401).json({ success: false, error: 'Invalid passkey.' })
  }

  loginAttempts.delete(key)
  res.json({ success: true, token: issueAdminToken(), expiresInMs: TOKEN_TTL_MS })
})

// Endpoint to save generated emblem asset
app.post('/api/save-emblem', requireAdmin, (req, res) => {
  try {
    const { base64Data } = req.body
    if (!base64Data) return res.status(400).json({ error: 'No data' })
    const base64Image = base64Data.replace(/^data:image\/png;base64,/, '')
    const targetPath = path.join(__dirname, '..', 'public', 'brand', 'sr-emblem.png')
    fs.writeFileSync(targetPath, base64Image, 'base64')
    console.log('[ASSET] Saved transparent emblem to', targetPath)
    res.json({ success: true, path: '/brand/sr-emblem.png' })
  } catch (err) {
    console.error('Failed to save emblem:', err)
    res.status(500).json({ error: err.message })
  }
})

// 2. Metrics / Stats (for Admin Overview)
app.get('/api/stats', requireAdmin, (req, res) => {
  try {
    const stats = dbService.getStats()
    res.json({ success: true, stats })
  } catch (err) {
    console.error('Error fetching stats:', err)
    res.status(500).json({ success: false, error: 'Failed to retrieve stats' })
  }
})

// 3. Quotes API
app.get('/api/quotes', requireAdmin, (req, res) => {
  try {
    const { status, search } = req.query
    const quotes = dbService.getQuotes({ status, search })
    res.json({ success: true, quotes })
  } catch (err) {
    console.error('Error fetching quotes:', err)
    res.status(500).json({ success: false, error: 'Failed to retrieve quotes' })
  }
})

app.post('/api/quotes', (req, res) => {
  try {
    const { name, email, phone, company, service_type, origin, destination, weight_kg, cargo_type, dimensions, message } = req.body

    if (!name || !email || !phone || !origin || !destination) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, phone, origin, and destination are required fields.',
      })
    }

    const created = dbService.createQuote({
      name,
      email,
      phone,
      company,
      service_type,
      origin,
      destination,
      weight_kg,
      cargo_type,
      dimensions,
      message,
    })

    console.log(`[QUOTE] Created new quote ref: ${created.ref_code} for ${created.name} (${created.email})`)

    res.status(201).json({
      success: true,
      message: 'Your shipment enquiry has been registered successfully. Our Begumpet operations desk will review and contact you with optimal routing and tariff.',
      quote: created,
    })
  } catch (err) {
    console.error('Error creating quote:', err)
    res.status(500).json({ success: false, error: 'Failed to submit quote inquiry' })
  }
})

app.patch('/api/quotes/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params
    const updated = dbService.updateQuote(id, req.body)
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Quote not found' })
    }
    res.json({ success: true, quote: updated })
  } catch (err) {
    console.error('Error updating quote:', err)
    res.status(500).json({ success: false, error: 'Failed to update quote' })
  }
})

app.delete('/api/quotes/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params
    dbService.deleteQuote(id)
    res.json({ success: true, message: 'Quote deleted successfully' })
  } catch (err) {
    console.error('Error deleting quote:', err)
    res.status(500).json({ success: false, error: 'Failed to delete quote' })
  }
})

// 4. Shipment Tracking API
app.get('/api/track/:trackingId', (req, res) => {
  try {
    const { trackingId } = req.params
    const shipment = dbService.getShipmentByTracking(trackingId)

    if (!shipment) {
      return res.status(404).json({
        success: false,
        error: `No consignment found for tracking ID "${trackingId}". Please verify your Air Waybill (AWB) or Container number or contact SR Freight Begumpet at +91 93910 32794.`,
        sampleTrackingIds: ['SR-HYD-98241', 'SR-AIR-10492', 'SR-SEA-55201'],
      })
    }

    res.json({ success: true, shipment })
  } catch (err) {
    console.error('Error tracking shipment:', err)
    res.status(500).json({ success: false, error: 'Failed to fetch shipment tracking details' })
  }
})

app.get('/api/shipments', requireAdmin, (req, res) => {
  try {
    const shipments = dbService.getAllShipments()
    res.json({ success: true, shipments })
  } catch (err) {
    console.error('Error fetching shipments:', err)
    res.status(500).json({ success: false, error: 'Failed to retrieve shipments' })
  }
})

app.post('/api/track', requireAdmin, (req, res) => {
  try {
    const created = dbService.createShipment(req.body)
    res.status(201).json({ success: true, shipment: created })
  } catch (err) {
    console.error('Error creating shipment:', err)
    res.status(500).json({ success: false, error: 'Failed to create shipment record' })
  }
})

app.patch('/api/track/:trackingId', requireAdmin, (req, res) => {
  try {
    const { trackingId } = req.params
    const updated = dbService.updateShipment(trackingId, req.body)
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Shipment not found' })
    }
    res.json({ success: true, shipment: updated })
  } catch (err) {
    console.error('Error updating shipment:', err)
    res.status(500).json({ success: false, error: 'Failed to update shipment' })
  }
})

// 5. Rate Calculator API
app.post('/api/calculate', (req, res) => {
  try {
    const estimate = calculateFreightRate(req.body)
    res.json({ success: true, estimate })
  } catch (err) {
    console.error('Error calculating freight rate:', err)
    res.status(500).json({ success: false, error: 'Failed to calculate rate estimate' })
  }
})

// 6. Contact Form API
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required.',
      })
    }
    const created = dbService.createContactMessage({ name, email, phone, subject, message })
    console.log(`[CONTACT] Message received from ${name} (${email})`)
    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to S R Freight. A logistics specialist will respond to your query shortly.',
      contact: created,
    })
  } catch (err) {
    console.error('Error creating contact message:', err)
    res.status(500).json({ success: false, error: 'Failed to submit contact message' })
  }
})

app.get('/api/contact', requireAdmin, (req, res) => {
  try {
    const messages = dbService.getContactMessages()
    res.json({ success: true, messages })
  } catch (err) {
    console.error('Error fetching contact messages:', err)
    res.status(500).json({ success: false, error: 'Failed to retrieve messages' })
  }
})

/* ==========================================================================
   PRODUCTION STATIC HOSTING & SPA FALLBACK
   ========================================================================== */
const distPath = path.resolve(__dirname, '../dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))

  // Any unmatched non-API routes serve index.html for client-side routing
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'))
    } else {
      res.status(404).json({ error: 'API route not found' })
    }
  })
}

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`======================================================`)
  console.log(`  S R FREIGHT PRODUCTION BACKEND SERVER RUNNING       `)
  console.log(`  Local URL:        http://localhost:${PORT}          `)
  console.log(`  API Base:         http://localhost:${PORT}/api      `)
  console.log(`  Serving Frontend: ${fs.existsSync(distPath) ? 'Yes (dist/)' : 'No (run build)'}`)
  console.log(`======================================================`)
})
