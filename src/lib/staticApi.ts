// Browser-side stand-in for the Express API, used only by the static (GitHub Pages) build.
// - Rate calculator: same engine as the server.
// - Tracking: the demo consignments the server seeds.
// - Quote / contact forms: there is no database, so the enquiry is handed to WhatsApp.
// - Staff portal: needs the real server, so sign-in is refused.
// @ts-ignore -- plain JS module shared with the server
import { calculateFreightRate } from '../../server/rateEngine.js'
// @ts-ignore -- plain JS module shared with the server
import { seedShipments } from '../../server/seedShipments.js'

const WHATSAPP_NUMBER = '919391032794'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

const openWhatsApp = (lines: string[]) => {
  const text = encodeURIComponent(lines.filter(Boolean).join('\n'))
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener')
}

export async function staticApi(url: string, init: RequestInit = {}): Promise<Response> {
  const method = (init.method || 'GET').toUpperCase()
  const path = url.split('?')[0]
  const body = typeof init.body === 'string' ? JSON.parse(init.body) : {}

  if (method === 'POST' && path === '/api/calculate') {
    return json({ success: true, estimate: calculateFreightRate(body) })
  }

  if (method === 'GET' && path.startsWith('/api/track/')) {
    const id = decodeURIComponent(path.slice('/api/track/'.length)).trim().toUpperCase()
    const shipment = (seedShipments as Array<{ tracking_number: string }>).find(
      (s) => s.tracking_number.toUpperCase() === id,
    )
    if (!shipment) {
      return json(
        {
          success: false,
          error: `No consignment found for tracking ID "${id}". Please verify your Air Waybill (AWB) or Container number or contact SR Freight Begumpet at +91 93910 32794.`,
        },
        404,
      )
    }
    return json({ success: true, shipment })
  }

  if (method === 'POST' && path === '/api/quotes') {
    const { name, email, phone, origin, destination } = body
    if (!name || !email || !phone || !origin || !destination) {
      return json({ success: false, error: 'Name, email, phone, origin, and destination are required fields.' }, 400)
    }
    const ref_code = `SRQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    openWhatsApp([
      `New quote enquiry ${ref_code}`,
      `Name: ${name}`,
      body.company && `Company: ${body.company}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      body.service_type && `Service: ${body.service_type}`,
      `Route: ${origin} → ${destination}`,
      body.weight_kg ? `Weight: ${body.weight_kg} kg` : '',
      body.cargo_type && `Cargo: ${body.cargo_type}`,
      body.dimensions && `Dimensions: ${body.dimensions}`,
      body.message && `Notes: ${body.message}`,
    ])
    return json({ success: true, quote: { ...body, ref_code } }, 201)
  }

  if (method === 'POST' && path === '/api/contact') {
    const { name, email, message } = body
    if (!name || !email || !message) {
      return json({ success: false, error: 'Name, email, and message are required.' }, 400)
    }
    openWhatsApp([
      `Message from ${name}`,
      body.subject && `Subject: ${body.subject}`,
      body.phone && `Phone: ${body.phone}`,
      `Email: ${email}`,
      message,
    ])
    return json({ success: true }, 201)
  }

  if (path === '/api/admin/login') {
    return json(
      { success: false, error: 'The staff portal is not available on this preview site. It requires the hosted server version.' },
      503,
    )
  }

  return json({ success: false, error: 'Not available on the static site.' }, 404)
}
