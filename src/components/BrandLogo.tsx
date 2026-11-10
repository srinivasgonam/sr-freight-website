import { useId } from 'react'

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
  className?: string
  iconOnly?: boolean
}

/** Glass-style SR monogram with a forward-moving cargo arrow. Pure SVG, scales crisply. */
export function LogoMark({ px = 46 }: { px?: number }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={px} height={px} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SR Freight">
      <defs>
        <linearGradient id={`bg${id}`} x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1b4a73" />
          <stop offset=".55" stopColor="#0c2338" />
          <stop offset="1" stopColor="#06121f" />
        </linearGradient>
        <linearGradient id={`or${id}`} x1="10" y1="0" x2="58" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffb36b" />
          <stop offset=".5" stopColor="#ff6a1f" />
          <stop offset="1" stopColor="#f05a28" />
        </linearGradient>
        <linearGradient id={`gl${id}`} x1="32" y1="2" x2="32" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity=".34" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`glow${id}`} cx="50" cy="52" r="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f05a28" stopOpacity=".5" />
          <stop offset="1" stopColor="#f05a28" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`clip${id}`}><rect x="2" y="2" width="60" height="60" rx="17" /></clipPath>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="17" fill={`url(#bg${id})`} />
      <g clipPath={`url(#clip${id})`}>
        <circle cx="50" cy="52" r="26" fill={`url(#glow${id})`} />
        {/* orbit ring */}
        <ellipse cx="32" cy="34" rx="34" ry="13" transform="rotate(-24 32 34)" stroke="#fff" strokeOpacity=".12" strokeWidth="1" />
        {/* glass highlight */}
        <path d="M2 2h60v26C44 36 20 36 2 26Z" fill={`url(#gl${id})`} />
      </g>
      <rect x="2.5" y="2.5" width="59" height="59" rx="16.5" stroke="#fff" strokeOpacity=".3" />

      <g transform="translate(0 3)" strokeLinecap="round" strokeLinejoin="round">
        {/* S */}
        <path d="M30 22H19a6.5 6.5 0 0 0 0 13h7a6.5 6.5 0 0 1 0 13H12" stroke="#fff" strokeWidth="5" />
        {/* R */}
        <path d="M37 48V22h9a6.5 6.5 0 0 1 0 13h-9M45 35l8 13" stroke="#fff" strokeWidth="5" />
        {/* cargo arrow */}
        <path d="M11 13h40" stroke={`url(#or${id})`} strokeWidth="4" />
        <path d="M45 7l10 6-10 6Z" fill={`url(#or${id})`} stroke={`url(#or${id})`} strokeWidth="2" />
      </g>
    </svg>
  )
}

export default function BrandLogo({
  size = 'md',
  showTagline = true,
  className = '',
  iconOnly = false,
}: BrandLogoProps) {
  const px = { sm: 38, md: 46, lg: 62 }[size]
  const titleSizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' }[size]

  return (
    <div className={`inline-flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3 drop-shadow-[0_8px_18px_rgba(240,90,40,0.28)] group-hover:drop-shadow-[0_10px_26px_rgba(240,90,40,0.55)]">
        <LogoMark px={px} />
      </div>

      {!iconOnly && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1.5 leading-none" style={{ fontFamily: "'Manrope', sans-serif" }}>
            <span className={`font-extrabold text-white tracking-tight ${titleSizes}`}>SR</span>
            <span
              className={`font-extrabold tracking-[0.14em] bg-gradient-to-r from-[#ffb36b] via-[#ff6a1f] to-[#f05a28] bg-clip-text text-transparent ${titleSizes}`}
            >
              FREIGHT
            </span>
          </div>

          {showTagline && (
            <div className="flex items-center gap-2 mt-1.5">
              <span className="h-px w-5 bg-gradient-to-r from-orange-500 to-transparent" />
              <span className="text-[9px] font-semibold tracking-[0.28em] text-white/55 uppercase">
                Global Logistics
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
