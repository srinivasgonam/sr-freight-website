import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type MouseEvent } from 'react'
import { ArrowUp, MessageCircle, Phone } from 'lucide-react'

/** Fade/slide-in on scroll. */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: any
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') return setShown(true)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'reveal-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}

/** Animated number counter, e.g. <CountUp to={28} suffix="+" />. */
export function CountUp({ to, suffix = '', prefix = '', decimals = 0, duration = 1600 }: {
  to: number; suffix?: string; prefix?: string; decimals?: number; duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const run = () => {
      const t0 = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration)
        setVal(to * (1 - Math.pow(1 - p, 3)))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect() } }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to, duration])
  return <span ref={ref}>{prefix}{val.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>
}

/** Mouse-following spotlight handler for .glass-card elements. */
export function spotlight(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

/** Top scroll-progress bar + floating action buttons + ambient aurora background. */
export function GlobalEffects() {
  const [pct, setPct] = useState(0)
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const on = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setPct(max > 0 ? (h.scrollTop / max) * 100 : 0)
      setShowTop(h.scrollTop > 600)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <>
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <div className="scroll-progress" style={{ width: `${pct}%` }} aria-hidden="true" />
      <div className="fab-stack">
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fab fab-glass ${showTop ? 'fab-show' : ''}`}
        >
          <ArrowUp size={18} />
        </button>
        <a href="tel:+919391032794" aria-label="Call us" className="fab fab-glass fab-show"><Phone size={18} /></a>
        <a
          href="https://wa.me/919391032794?text=Hi%20SR%20Freight,%20inquiring%20about%20cargo%20services"
          target="_blank" rel="noreferrer" aria-label="WhatsApp"
          className="fab fab-wa fab-show"
        >
          <MessageCircle size={20} />
        </a>
      </div>
    </>
  )
}
