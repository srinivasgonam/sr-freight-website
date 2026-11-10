# S R FREIGHT — Official Production Web Application & Backend API

> **Hyderabad's Premier International Freight Forwarder & Global Logistics Partner**  
> Established in 1995 • Head Office: Flat No. 43 / F-55, 2nd Floor, Bharani Complex, Minister Road, Begumpet, Hyderabad — 500003  
> Managing Director: **Mr. C.N. Rajendra Kumar** • Phone: **+91 93910 32794** • Email: **info@srfreight.in**

---

## 🌟 Executive Overview for Client Handover

This is a complete, turnkey full-stack web application developed specifically for **S.R. Freight (Begumpet, Hyderabad)**. 

The website includes:
1. **Interactive Real-Time Shipment Tracker**: Lookup consignments by Air Waybill (AWB) or Container number with visual milestone progression, flight/carrier status, and checkpoint timestamps.
2. **Instant International Freight Rate Calculator**: Calculates real-world tariff estimates for Air Cargo, Ocean FCL, Ocean LCL, and Express Courier based on actual weight and IATA volumetric divisors (`L×W×H/5000` or `/6000`).
3. **Automated Quotation & Inquiry Management**: Submits customer quotes to an integrated SQLite database, generates unique reference codes (`SRQ-2026-XXXX`), and provides 1-click WhatsApp follow-ups.
4. **Staff Operations Portal (`/admin`)**: Secure administrative dashboard for S R Freight staff to review inquiries, update shipment tracking checkpoints, assign quoted amounts, and export quote manifests to CSV.
5. **Turnkey Self-Hosted Node.js / Express Backend**: Embedded SQLite database (`node:sqlite` zero-configuration SQL engine with WAL mode) with zero external database dependencies.
6. **Full Mobile-Responsive & Modern Glassmorphism UI**: High-converting aesthetics, Google reviews (5.0 stars), Google Maps embed of Bharani Complex, and verifiedBegumpet contact channels.

---

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js v20+ or v24+
- `pnpm` (recommended) or `npm`

### Installation
```bash
# 1. Install dependencies
pnpm install

# 2. Start full-stack development (runs backend API on :5000 and Vite frontend on :5173 concurrently)
pnpm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🌐 Production Deployment Guide (How Client Produces This On The Internet)

You can deploy this entire application to any hosting service with **one command** or a single `git push`. In production, the Node.js Express server serves both the REST API and the static React application from port `5000` (or `process.env.PORT`).

### Option A: 1-Click Deploy to Render / Railway / Fly.io (Recommended)

1. **Push repository to GitHub**:
   ```bash
   git add .
   git commit -m "Production release for S R Freight"
   git push origin main
   ```
2. **On [Render.com](https://render.com) or [Railway.app](https://railway.app)**:
   - Click **New Web Service** and select this GitHub repository.
   - Set **Build Command**: `pnpm install && pnpm run build` (or `npm install && npm run build`)
   - Set **Start Command**: `node server/index.js`
   - Set **Environment Variable**: `PORT=5000`
3. Click **Deploy**. Your website will be live in 60 seconds with SSL enabled.

---

### Option B: Deploying with Custom Domain (e.g. `www.srfreight.in`)

When the client buys the domain (from GoDaddy, Namecheap, Hostinger, or Google Domains):

1. Go to your DNS Manager on your domain registrar.
2. Add the following DNS Records:
   - **Type**: `A`  
     **Name**: `@`  
     **Value**: `[IP address provided by your hosting provider, e.g., Render/VPS]`
   - **Type**: `CNAME`  
     **Name**: `www`  
     **Value**: `[hostname provided by your hosting provider, e.g., srfreight.onrender.com]`
3. In your hosting dashboard (e.g. Render/Vercel/Cloudflare), click **Add Custom Domain** and enter `srfreight.in` and `www.srfreight.in`.
4. Free automated SSL certificates (HTTPS) will be provisioned automatically within minutes.

---

### Option C: Traditional VPS / Cloud Server (Ubuntu / Debian / CentOS / Windows Server)

```bash
# 1. Clone repository on server
git clone <repo_url>
cd sr-freight-clean-code

# 2. Install dependencies & build bundle
pnpm install
pnpm run build

# 3. Start with PM2 process manager for 99.99% uptime
npm install -g pm2
pm2 start server/index.js --name "sr-freight"
pm2 save
pm2 startup
```

---

## 🔐 Staff Operations Portal (`/admin`)

- **URL**: `http://localhost:5173/admin` (or `https://your-domain.com/admin`)
- **Default Staff Passkey**: `srfreight2025` *(also accepts `begumpet`)*

### Admin Capabilities:
- **Quotes Dashboard**: View customer name, phone, email, origin, destination, cargo specifications, and time submitted.
- **Quote Pricing**: Set the formal INR quoted amount and update status (`New` → `In Review` → `Quoted` → `Closed`).
- **Shipment Manifest Generator**: Add new Air Waybills or Container numbers with real-time tracking checkpoints.
- **CSV Data Export**: 1-click download of all quote inquiries formatted for Microsoft Excel / Google Sheets.

---

## 🛠 Backend REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and verified Begumpet credentials |
| `GET` | `/api/stats` | High-level metrics for admin dashboard |
| `GET` | `/api/quotes` | Retrieve submitted inquiries (supports `?status=` and `?search=`) |
| `POST` | `/api/quotes` | Register new shipment quotation request (generates `SRQ-2026-XXXX`) |
| `PATCH`| `/api/quotes/:id` | Update quote status, pricing, or administrative notes |
| `DELETE`| `/api/quotes/:id`| Remove quote record |
| `GET` | `/api/track/:id` | Fetch live shipment milestones by tracking ID (e.g. `SR-HYD-98241`) |
| `POST` | `/api/track` | Create a new tracked shipment consignment (Admin) |
| `PATCH`| `/api/track/:id` | Add checkpoint or update current location/status (Admin) |
| `POST` | `/api/calculate` | Calculate freight estimates (Air, Ocean FCL/LCL, Courier) |
| `POST` | `/api/contact` | Receive direct contact messages from customers |
| `GET` | `/api/contact` | List received contact inquiries (Admin) |

---

## 🏢 Business Identity & Contact Coordinates

- **Entity**: S R Freight (S.R. Freight Logistics & Transport)
- **Managing Director**: Mr. C.N. Rajendra Kumar
- **Headquarters**: Flat No. 43 / F-55, 2nd Floor, Bharani Complex, Near KIMS Hospital & Passport Seva Kendra, Minister Road, Begumpet, Secunderabad / Hyderabad, Telangana — 500003
- **Mobile Hotline**: +91 93910 32794
- **Landline**: +91 40 2781 4828 / +91 40 2781 4829
- **Email**: info@srfreight.in
- **Operating Hours**: Mon - Sat 9:00 AM - 8:00 PM (24/7 Live Air Freight Monitoring)
