import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import BrandLogo from './BrandLogo'
import { Phone, Mail, MapPin, ChevronDown, Menu, X, ArrowUpRight, Search, Calculator } from 'lucide-react'
import { COMPANY } from '../data/companyInfo'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Notification & Contact Strip */}
      <div className="bg-[#040e18] text-white/80 text-[11px] font-medium border-b border-white/10 hidden md:block">
        <div className="shell flex justify-between items-center py-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-orange-400 font-semibold tracking-wide">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Begumpet, Hyderabad Hub — 28+ Years Trusted Service
            </span>
            <span className="text-white/40">|</span>
            <span className="flex items-center gap-1.5 hover:text-white transition">
              <MapPin size={12} className="text-orange-400" />
              Bharani Complex, Minister Road, Begumpet
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href={`tel:${COMPANY.phoneRaw}`} className="flex items-center gap-1.5 text-white hover:text-orange-400 font-semibold transition">
              <Phone size={12} className="text-orange-400" />
              {COMPANY.phone}
            </a>
            <span className="text-white/40">|</span>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-1.5 hover:text-white transition">
              <Mail size={12} className="text-orange-400" />
              {COMPANY.email}
            </a>
            <span className="text-white/40">|</span>
            <Link to="/admin" className="text-white/50 hover:text-white text-[10px] tracking-wider uppercase font-bold transition">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="nav shell" aria-label="Main Navigation">
        <Link to="/" aria-label="SR Freight Home" className="transition hover:opacity-95">
          <BrandLogo size="md" />
        </Link>

        {/* Desktop Links */}
        <div className="navlinks hidden lg:flex items-center gap-7">
          <Link to="/" className={isActive('/') ? 'text-white font-bold' : ''}>Home</Link>

          {/* Services Menu */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <Link
              to="/services"
              className={`flex items-center gap-1 py-2 ${location.pathname.startsWith('/services') ? 'text-white font-bold' : ''}`}
            >
              Services <ChevronDown size={14} className={`transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
            </Link>

            {servicesDropdownOpen && (
              <div className="absolute top-full left-0 w-64 bg-[#0a1c2e] border border-white/15 rounded-xl shadow-2xl p-2.5 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                <Link to="/services" className="block px-3 py-2 text-xs font-bold text-orange-400 hover:bg-white/5 rounded-lg mb-1">
                  All Logistics Capabilities →
                </Link>
                <div className="h-[1px] bg-white/10 my-1" />
                <Link to="/services/air-freight" className="block px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-lg">
                  ✈ International Air Cargo (RGIA)
                </Link>
                <Link to="/services/ocean-freight" className="block px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-lg">
                  🚢 Ocean Freight FCL & LCL (ICD)
                </Link>
                <Link to="/services/door-to-door" className="block px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-lg">
                  📦 Worldwide Courier (Australia/USA)
                </Link>
                <Link to="/services/customs-clearance" className="block px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-lg">
                  📋 Customs Clearance (CHA)
                </Link>
                <Link to="/services/warehousing" className="block px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-lg">
                  🏢 3PL Warehousing & Distribution
                </Link>
              </div>
            )}
          </div>

          <Link to="/track" className={`flex items-center gap-1.5 ${isActive('/track') ? 'text-white font-bold' : ''}`}>
            <Search size={14} className="text-orange-400" />
            Track Shipment
          </Link>

          <Link to="/calculator" className={`flex items-center gap-1.5 ${isActive('/calculator') ? 'text-white font-bold' : ''}`}>
            <Calculator size={14} className="text-orange-400" />
            Rate Calculator
          </Link>

          <Link to="/about" className={isActive('/about') ? 'text-white font-bold' : ''}>About Us</Link>
          <Link to="/contact" className={isActive('/contact') ? 'text-white font-bold' : ''}>Contact</Link>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${COMPANY.phoneRaw}`}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white/90 rounded-xl transition glass-btn-frosted"
            title="Call Begumpet Operations Desk"
          >
            <Phone size={13} className="text-emerald-400" />
            <span>Call Now</span>
          </a>

          <Link className="navCta" to="/contact#quote">
            Get a quote <ArrowUpRight size={16} />
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden p-2 text-white/80 hover:text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#071524] border-b border-white/15 shadow-2xl px-6 py-5 text-sm space-y-3 animate-in fade-in duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-white font-medium hover:text-orange-400"
          >
            Home
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-white font-medium hover:text-orange-400"
          >
            All Services
          </Link>
          <div className="pl-4 space-y-2 border-l border-white/15 text-xs text-white/70">
            <Link to="/services/air-freight" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-white">
              ✈ International Air Freight (RGIA)
            </Link>
            <Link to="/services/ocean-freight" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-white">
              🚢 Ocean Container Cargo (ICD Sanathnagar)
            </Link>
            <Link to="/services/door-to-door" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-white">
              📦 Worldwide Courier (Australia / USA)
            </Link>
            <Link to="/services/customs-clearance" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-white">
              📋 Customs Clearance (CHA)
            </Link>
            <Link to="/services/warehousing" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-white">
              🏢 Warehousing & Distribution
            </Link>
          </div>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-white font-medium hover:text-orange-400"
          >
            <Search size={16} className="text-orange-400" />
            Track Shipment
          </Link>
          <Link
            to="/calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-white font-medium hover:text-orange-400"
          >
            <Calculator size={16} className="text-orange-400" />
            Rate Calculator
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-white font-medium hover:text-orange-400"
          >
            About S R Freight
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-white font-medium hover:text-orange-400"
          >
            Contact & Office Map
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs text-white/40 uppercase tracking-widest font-bold"
          >
            Staff Dashboard →
          </Link>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <a href={`tel:${COMPANY.phoneRaw}`} className="flex items-center gap-2 py-2 text-orange-400 font-bold">
              <Phone size={15} /> {COMPANY.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
