import { useId } from 'react'

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
  className?: string
  iconOnly?: boolean
}

/**
 * Jet-stream "SR": a forward-leaning monogram in molten orange with an electric
 * cyan edge, a swept wing that ends in a nose-cone point, and speed streaks
 * trailing behind. Echoes the original S R Freight jet emblem. Pure SVG.
 */
export function LogoMark({ px = 46 }: { px?: number }) {
  const id = useId().replace(/:/g, '')
  const S_PATH = 'M52 25H40a5.5 5.5 0 0 0 0 11h6a5.5 5.5 0 0 1 0 11H34'
  const R_PATH = 'M59 50V25h9.5a5.5 5.5 0 0 1 0 11H59M67.5 36l7.5 14'
  return (
    <svg width={px * 1.5} height={px} viewBox="0 0 96 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SR Freight">
      <defs>
        <linearGradient id={`or${id}`} x1="30" y1="50" x2="78" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff4d12" />
          <stop offset=".55" stopColor="#ff7a2e" />
          <stop offset="1" stopColor="#ffc46b" />
        </linearGradient>
        <linearGradient id={`cy${id}`} x1="30" y1="50" x2="78" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0891b2" />
          <stop offset="1" stopColor="#67e8f9" />
        </linearGradient>
        <linearGradient id={`wing${id}`} x1="18" y1="0" x2="95" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff5a1f" stopOpacity="0" />
          <stop offset=".3" stopColor="#ff6a24" />
          <stop offset="1" stopColor="#ffd08a" />
        </linearGradient>
        <linearGradient id={`wingc${id}`} x1="30" y1="0" x2="88" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" stopOpacity="0" />
          <stop offset=".4" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#a5f3fc" />
        </linearGradient>
        <linearGradient id={`so${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#ff6a24" stopOpacity="0" />
          <stop offset="1" stopColor="#ff8a3d" />
        </linearGradient>
        <linearGradient id={`sc${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#22d3ee" stopOpacity="0" />
          <stop offset="1" stopColor="#67e8f9" />
        </linearGradient>
      </defs>

      {/* swept wing ending in the nose cone */}
      <path d="M16 19C38 6 66 6 95 11 70 12.5 46 15 26 22Z" transform="translate(0 -3)" fill={`url(#wing${id})`} />
      <path d="M40 19.5C56 14.5 72 13.8 88 15.2 73 16.2 58 17.8 46 21.5Z" transform="translate(0 -3)" fill={`url(#wingc${id})`} />

      <g transform="translate(3 -7) scale(1.18) skewX(-14)">
        {/* speed streaks */}
        <rect x="14" y="25.5" width="15" height="2.6" rx="1.3" fill={`url(#sc${id})`} />
        <rect x="6" y="34.5" width="20" height="3.2" rx="1.6" fill={`url(#so${id})`} />
        <rect x="15" y="44.5" width="12" height="2.6" rx="1.3" fill={`url(#sc${id})`} />

        {/* cyan edge */}
        <g transform="translate(1.7 1.7)" stroke={`url(#cy${id})`} strokeWidth="6.2" strokeLinejoin="round">
          <path d={S_PATH} />
          <path d={R_PATH} />
        </g>
        {/* monogram */}
        <g stroke={`url(#or${id})`} strokeWidth="6.2" strokeLinejoin="round">
          <path d={S_PATH} />
          <path d={R_PATH} />
        </g>
      </g>

      {/* ground swoosh */}
      <path d="M14 58C36 53 62 52.5 88 55 62 55.5 40 57 22 61Z" transform="translate(0 1.5)" fill={`url(#wing${id})`} opacity=".85" />
    </svg>
  )
}

export default function BrandLogo({
  size = 'md',
  showTagline = true,
  className = '',
  iconOnly = false,
}: BrandLogoProps) {
  const px = { sm: 40, md: 50, lg: 76 }[size]
  const titleSizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' }[size]

  return (
    <div className={`inline-flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3 drop-shadow-[0_8px_18px_rgba(240,90,40,0.28)] group-hover:drop-shadow-[0_10px_26px_rgba(240,90,40,0.55)]">
        <LogoMark px={px} />
      </div>

      {!iconOnly && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1.5 leading-none" style={{ fontFamily: 'var(--font-display)' }}>
            <span className={`font-extrabold italic text-white tracking-tight ${titleSizes}`}>SR</span>
            <span
              className={`font-extrabold italic tracking-[0.1em] pr-1 bg-gradient-to-r from-[#ffb36b] via-[#ff6a1f] to-[#f05a28] bg-clip-text text-transparent ${titleSizes}`}
            >
              FREIGHT
            </span>
          </div>

          {showTagline && (
            <div className="hidden min-[360px]:flex items-center gap-2 mt-1.5">
              <span className="h-px w-5 bg-gradient-to-r from-orange-500 to-transparent" />
              <span className="text-[10px] font-semibold tracking-[0.28em] text-ink-3 uppercase">
                Global Logistics
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
