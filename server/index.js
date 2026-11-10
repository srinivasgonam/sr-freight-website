import express from 'express'
import cors from 'cors'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dbService, seedInitialData } from './db.js'
import { calculateFreightRate } from './rateEngine.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000

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

// Endpoint to save generated emblem asset
app.post('/api/save-emblem', (req, res) => {
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
app.get('/api/stats', (req, res) => {
  try {
    const stats = dbService.getStats()
    res.json({ success: true, stats })
  } catch (err) {
    console.error('Error fetching stats:', err)
    res.status(500).json({ success: false, error: 'Failed to retrieve stats' })
  }
})

// 3. Quotes API
app.get('/api/quotes', (req, res) => {
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

app.patch('/api/quotes/:id', (req, res) => {
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

app.delete('/api/quotes/:id', (req, res) => {
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

app.get('/api/shipments', (req, res) => {
  try {
    const shipments = dbService.getAllShipments()
    res.json({ success: true, shipments })
  } catch (err) {
    console.error('Error fetching shipments:', err)
    res.status(500).json({ success: false, error: 'Failed to retrieve shipments' })
  }
})

app.post('/api/track', (req, res) => {
  try {
    const created = dbService.createShipment(req.body)
    res.status(201).json({ success: true, shipment: created })
  } catch (err) {
    console.error('Error creating shipment:', err)
    res.status(500).json({ success: false, error: 'Failed to create shipment record' })
  }
})

app.patch('/api/track/:trackingId', (req, res) => {
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

app.get('/api/contact', (req, res) => {
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
