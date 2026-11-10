import React from 'react'

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
  className?: string
  iconOnly?: boolean
}

export default function BrandLogo({
  size = 'md',
  showTagline = true,
  className = '',
  iconOnly = false,
}: BrandLogoProps) {
  // Proportional sizing
  const containerDimensions = {
    sm: 'w-[40px] h-[32px]',
    md: 'w-[48px] h-[38px]',
    lg: 'w-[60px] h-[48px]',
  }[size]

  const imgStyles = {
    sm: { width: '74px', height: '74px', top: '-13px', left: '-17px' },
    md: { width: '88px', height: '88px', top: '-16px', left: '-20px' },
    lg: { width: '110px', height: '110px', top: '-20px', left: '-25px' },
  }[size]

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  }[size]

  return (
    <div className={`inline-flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* ================= ICON EMBLEM ================= */}
      <div
        className={`${containerDimensions} relative rounded-xl bg-black border border-white/20 group-hover:border-orange-500/70 transition-all duration-300 shadow-xl shadow-black/50 group-hover:shadow-orange-500/30 group-hover:scale-105 overflow-hidden shrink-0`}
      >
        <img
          src="/brand/sr-logo.jpg"
          alt="SR Freight Emblem"
          className="max-w-none absolute object-cover filter contrast-125 group-hover:scale-105 transition-transform duration-300"
          style={imgStyles}
        />
      </div>

      {/* ================= BRAND TYPOGRAPHY ================= */}
      {!iconOnly && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black text-white tracking-tight ${titleSizes}`}>
              SR
            </span>
            <span
              className={`font-black tracking-wider text-orange-500 ${titleSizes}`}
            >
              FREIGHT
            </span>
          </div>

          {showTagline && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono font-bold tracking-widest text-white/50 uppercase">
                GLOBAL LOGISTICS • BEGUMPET
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
