import Link from 'next/link'

// ---------- Icons ----------
const PlaySm = ({ size = 10 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true">
    <path d="M3 1.5v9l8-4.5L3 1.5Z" fill="currentColor" />
  </svg>
)

const ArrowRight = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
)

const ChatIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6.5C4 5.12 5.12 4 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.36A.5.5 0 0 1 5 19.97V17H6.5A2.5 2.5 0 0 1 4 14.5v-8Z" fill="currentColor" />
  </svg>
)

// ---------- Logo ----------
const Logo = () => (
  <Link href="/" className="lp-logo">
    <span className="lp-logo-mark"><PlaySm size={10} /></span>
    <span>linkeplay</span>
  </Link>
)

// ---------- Nav ----------
const Nav = () => (
  <nav className="lp-nav">
    <Logo />
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <a href="#como-funciona" className="lp-nav-link hidden md:inline-flex">Cómo funciona</a>
      <a href="#ejemplo" className="lp-nav-link hidden md:inline-flex">Ejemplo</a>
      <Link href="/admin/login" className="lp-nav-link hidden md:inline-flex">Iniciar sesión</Link>
      <Link href="/admin/login" className="lp-nav-cta">
        <span className="hidden md:inline">Crear mi perfil</span>
        <span className="md:hidden">Crear perfil</span>
      </Link>
    </div>
  </nav>
)

// ---------- Profile peek components ----------
const ThumbArt = ({ colors, pattern }: { colors: string[], pattern: string }) => {
  const bg = colors.length >= 3
    ? `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`
    : `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`

  const overlay =
    pattern === 'dots'
      ? 'radial-gradient(rgba(0,0,0,0.25) 1.5px, transparent 1.5px)'
      : pattern === 'grid'
      ? 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)'
      : 'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 18px)'

  const overlaySize = pattern === 'dots' ? '12px 12px' : pattern === 'grid' ? '16px 16px, 16px 16px' : '100% 100%'

  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `${overlay}, ${bg}`,
      backgroundSize: `${overlaySize}, 100% 100%`,
    }} />
  )
}

const PeekBadge = ({ kind }: { kind: string }) => {
  const cls = kind === 'NUEVO' ? 'is-new' : kind === 'POPULAR' ? 'is-popular' : 'is-updated'
  return (
    <span className={`lp-badge ${cls}`} style={{ position: 'absolute', top: 8, left: 8, fontSize: 9, padding: '4px 8px' }}>
      {kind}
    </span>
  )
}

type PeekGame = {
  id: string
  title: string
  badge: string
  colors: string[]
  pattern: string
}

const ProfilePeek = ({ showCards = 2, frame = 'browser' }: { showCards?: number, frame?: 'browser' | 'phone' }) => {
  const games: PeekGame[] = [
    { id: 'sc', title: 'Space Chaos', badge: 'NUEVO', colors: ['#3a0ca3', '#FF3EA8', '#FFB03E'], pattern: 'rays' },
    { id: 'pl', title: 'Plataformas Locas', badge: 'POPULAR', colors: ['#0ea5e9', '#84cc16'], pattern: 'dots' },
    { id: 'pd', title: 'Pixel Dungeon', badge: 'ACTUALIZADO', colors: ['#7f1d1d', '#581c87', '#0a0a10'], pattern: 'grid' },
  ].slice(0, showCards)

  const inner = (
    <div style={{
      background: 'var(--ink-950)', padding: '24px 20px 28px',
      position: 'relative', isolation: 'isolate',
    }}>
      {/* Background texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(60% 50% at 50% 0%, rgba(194,255,62,0.06), transparent 60%), linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 28px 28px, 28px 28px',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
        <div className="lp-avatar" style={{ width: 64, height: 64, fontSize: 28 }}>
          <span className="lp-avatar-label">M</span>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: 'var(--fg)' }}>Marta García</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            <span className="lp-handle-dot" />@marta
          </div>
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.4, maxWidth: 280 }}>
          Hago juegos web raros y coloridos.
        </div>
        <button className="lp-peek-discord" style={{ maxWidth: 320, marginTop: 4 }}>
          <ChatIcon size={16} />
          <span>Únete a mi Discord</span>
        </button>
      </div>

      <div style={{
        marginTop: 18, position: 'relative', zIndex: 1,
        display: 'grid',
        gridTemplateColumns: showCards >= 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
        gap: 12,
      }}>
        {games.map((g) => (
          <div key={g.id} style={{
            background: 'var(--ink-900)', border: '1px solid var(--line)',
            borderRadius: 12, overflow: 'hidden',
          }}>
            <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#000' }}>
              <ThumbArt colors={g.colors} pattern={g.pattern} />
              <PeekBadge kind={g.badge} />
            </div>
            <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 13, color: 'var(--fg)', letterSpacing: '-0.01em' }}>{g.title}</div>
              <button style={{
                background: 'var(--lime)', color: 'var(--ink-950)',
                fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 11,
                padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}>
                <PlaySm size={9} /> Jugar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (frame === 'browser') {
    return (
      <div className="lp-browser" style={{ width: '100%' }}>
        <div className="lp-browser-bar">
          <div className="lp-traffic"><span /><span /><span /></div>
          <div className="lp-browser-url">
            <span className="lock" />
            linkeplay.com/<span className="path">marta</span>
          </div>
        </div>
        {inner}
      </div>
    )
  }

  return (
    <div className="lp-phone" style={{ width: '100%', maxWidth: 300, margin: '0 auto' }}>
      <div className="lp-phone-notch" />
      <div style={{ paddingTop: 24 }}>{inner}</div>
    </div>
  )
}

// ---------- Mini visuals (steps) ----------
const MiniProfileChip = () => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    background: 'var(--ink-900)', border: '1px solid var(--line)',
    borderRadius: 12, padding: '10px 14px',
  }}>
    <div className="lp-avatar" style={{ width: 36, height: 36, fontSize: 16 }}>
      <span className="lp-avatar-label">M</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 14, color: 'var(--fg)', letterSpacing: '-0.01em' }}>Marta García</div>
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: 'var(--muted)' }}>@marta</div>
    </div>
  </div>
)

const MiniGameCard = () => (
  <div style={{
    width: '100%', maxWidth: 220,
    background: 'var(--ink-900)', border: '1px solid var(--line)',
    borderRadius: 12, overflow: 'hidden',
  }}>
    <div style={{
      aspectRatio: '16/9', position: 'relative',
      backgroundImage: 'radial-gradient(rgba(0,0,0,0.25) 1.5px, transparent 1.5px), linear-gradient(135deg, #0ea5e9, #84cc16)',
      backgroundSize: '12px 12px, 100% 100%',
      display: 'grid', placeItems: 'center',
      fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, color: '#fff',
      fontSize: 14, letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.4)',
    }}>
      Plataformas Locas
      <span className="lp-badge is-popular" style={{ top: 8, left: 8, fontSize: 9, padding: '4px 8px' }}>POPULAR</span>
    </div>
    <div style={{ padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 600, fontSize: 12, color: 'var(--fg)' }}>Plataformas Locas</span>
      <span style={{
        background: 'var(--lime)', color: 'var(--ink-950)',
        fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 11,
        padding: '4px 10px', borderRadius: 6,
      }}>Jugar</span>
    </div>
  </div>
)

const MiniLinkPill = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
    <div style={{
      fontFamily: 'ui-monospace, monospace', fontSize: 14,
      background: 'var(--ink-950)', border: '1px solid var(--line)',
      color: 'var(--fg)', padding: '10px 16px', borderRadius: 10,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--lime)', flexShrink: 0 }} />
      linkeplay.com/<span style={{ color: 'var(--lime)' }}>marta</span>
    </div>
    <div style={{
      fontFamily: 'var(--font-space-grotesk)', fontWeight: 600, fontSize: 11,
      color: 'var(--muted-2)', letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>↑ Pega esto en tu bio de TikTok</div>
  </div>
)

// ---------- Hero ----------
const Hero = () => (
  <section className="lp-hero">
    <div style={{
      maxWidth: 1160, margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 28,
      alignItems: 'center',
    }} className="md:grid-cols-[1.05fr_1fr] md:gap-16">
      <div>
        <div className="lp-hero-eyebrow">
          <span className="lp-pulse" /> Para devs de juegos web
        </div>
        <h1 className="lp-hero-h1" style={{ fontSize: 'clamp(40px, 8vw, 72px)' }}>
          Tu juego va a Poki.<br />
          <span className="lp-hero-h1-accent">Tus jugadores se quedan contigo.</span>
        </h1>
        <p className="lp-hero-sub" style={{ fontSize: 'clamp(15px, 2vw, 19px)', maxWidth: 540 }}>
          Linkeplay es el link en bio para devs de juegos web. Crea un perfil, sube tus juegos y convierte el tráfico de TikTok en seguidores tuyos.
        </p>
        <div className="lp-hero-ctas">
          <Link href="/admin/login" className="lp-cta-primary">
            Crear mi perfil — es gratis <ArrowRight />
          </Link>
          <a href="#ejemplo" className="lp-cta-ghost">Ver un ejemplo</a>
        </div>
        <div className="lp-hero-meta">
          <span>Sin tarjeta · 2 min de setup</span>
          <span className="lp-url-pill">linkeplay.com/<span className="var">tunombre</span></span>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        {/* Phone: visible solo en móvil */}
        <div className="md:hidden">
          <ProfilePeek showCards={2} frame="phone" />
        </div>
        {/* Browser: visible solo en desktop */}
        <div className="hidden md:block" style={{ position: 'relative' }}>
          <ProfilePeek showCards={3} frame="browser" />
          <div style={{
            position: 'absolute', top: -16, right: -16,
            background: 'var(--lime)', color: 'var(--ink-950)',
            padding: '8px 14px', borderRadius: 10,
            fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 12,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            boxShadow: '0 12px 32px -10px rgba(194,255,62,0.5)',
            transform: 'rotate(4deg)',
          }}>
            ⚡ jugable al instante
          </div>
        </div>
      </div>
    </div>
  </section>
)

// ---------- Cómo funciona ----------
const steps = [
  {
    n: '01', title: 'Crea tu perfil',
    desc: 'Handle, avatar, bio y tu link a Discord. 30 segundos. Sin formularios infinitos.',
    visual: <MiniProfileChip />,
  },
  {
    n: '02', title: 'Sube tus juegos',
    desc: 'Pega un iframe o una URL. Linkeplay genera la card y los jugadores le dan a "Jugar".',
    visual: <MiniGameCard />,
  },
  {
    n: '03', title: 'Comparte el link',
    desc: 'Tu URL corta —linkeplay.com/tunombre— va directa a tu bio de TikTok. Ya está.',
    visual: <MiniLinkPill />,
  },
]

const HowItWorks = () => (
  <section id="como-funciona" style={{ borderTop: '1px solid var(--line)' }}
    className="px-5 py-10 md:px-8 md:py-24">
    <div style={{ maxWidth: 1160, margin: '0 auto' }}>
      <div className="mb-7 md:mb-12 md:text-center" style={{ maxWidth: 700, margin: '0 auto 28px' }}>
        <div className="lp-eyebrow-section">Cómo funciona</div>
        <h2 className="lp-section-title" style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}>
          Tres pasos. Cinco minutos.<br />
          <span style={{ color: 'var(--muted)' }}>Cero código.</span>
        </h2>
        <p className="lp-section-sub" style={{ fontSize: 'clamp(14px, 2vw, 17px)' }}>
          No es un editor de portfolios. Es la página de tu juego, lista para enviarse desde TikTok.
        </p>
      </div>
      <div style={{ display: 'grid', gap: 14 }} className="md:grid-cols-3 md:gap-5">
        {steps.map((s) => (
          <article key={s.n} className="lp-step">
            <div className="lp-step-num">{s.n}</div>
            <h3 className="lp-step-title">{s.title}</h3>
            <p className="lp-step-desc">{s.desc}</p>
            <div className="lp-step-visual">{s.visual}</div>
          </article>
        ))}
      </div>
    </div>
  </section>
)

// ---------- Ejemplo real ----------
const RealExample = () => (
  <section id="ejemplo" style={{ borderTop: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}
    className="px-5 py-10 md:px-8 md:py-24">
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div className="mb-7 md:mb-12 md:text-center" style={{ maxWidth: 700, margin: '0 auto 28px' }}>
        <div className="lp-eyebrow-section">Así se ve</div>
        <h2 className="lp-section-title" style={{ fontSize: 'clamp(26px, 4vw, 44px)' }}>
          Un perfil real.<br />
          <span style={{ color: 'var(--lime)' }}>Esto es lo que ven tus jugadores.</span>
        </h2>
      </div>

      <div style={{ position: 'relative', maxWidth: 820, margin: '0 auto' }}>
        {/* Mobile */}
        <div className="md:hidden">
          <ProfilePeek showCards={2} frame="phone" />
        </div>
        {/* Desktop + annotations */}
        <div className="hidden md:block" style={{ position: 'relative' }}>
          <ProfilePeek showCards={3} frame="browser" />
          <div style={{ position: 'absolute', left: -200, top: 250, width: 220 }}>
            <div className="lp-annot" style={{ position: 'static', justifyContent: 'flex-end' }}>
              <span>Tu Discord, ahí mismo</span>
              <span className="lp-annot-line" style={{ width: 36 }} />
              <span className="lp-annot-dot" />
            </div>
          </div>
          <div style={{ position: 'absolute', right: -210, top: 110, width: 220 }}>
            <div className="lp-annot" style={{ position: 'static' }}>
              <span className="lp-annot-dot" />
              <span className="lp-annot-line" style={{ width: 36 }} />
              <span>Tu URL pegable</span>
            </div>
          </div>
          <div style={{ position: 'absolute', right: -230, bottom: 80, width: 240 }}>
            <div className="lp-annot" style={{ position: 'static' }}>
              <span className="lp-annot-dot" />
              <span className="lp-annot-line" style={{ width: 36 }} />
              <span>Jugable sin descargas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

// ---------- Final CTA ----------
const FinalCTA = () => (
  <section style={{ borderTop: '1px solid var(--line)' }} className="px-5 py-10 md:px-8 md:py-20">
    <div style={{ maxWidth: 980, margin: '0 auto' }}>
      <div className="lp-finalcta" style={{ padding: 'clamp(36px, 5vw, 64px) clamp(22px, 4vw, 32px)' }}>
        <div className="lp-eyebrow-section">¿Haces juegos web?</div>
        <h2 className="lp-section-title" style={{ fontSize: 'clamp(32px, 6vw, 56px)', margin: 0 }}>
          Empieza gratis.<br />
          <span style={{ color: 'var(--muted)' }}>Mide cuánto creces tú,</span><br />
          <span style={{ color: 'var(--muted)' }}>no Poki.</span>
        </h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/admin/login" className="lp-cta-primary">
            Crear mi perfil <ArrowRight />
          </Link>
          <a href="mailto:hola@linkeplay.gg" className="lp-cta-ghost">Hablar con un humano</a>
        </div>
        <div style={{ color: 'var(--muted-2)', fontSize: 13, fontFamily: 'var(--font-space-grotesk)' }}>
          Sin tarjeta. Sin trial. Gratis.
        </div>
      </div>
    </div>
  </section>
)

// ---------- Footer ----------
const Footer = () => (
  <footer className="lp-footer">
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Logo />
      <span style={{ color: 'var(--muted-2)' }}>· 2025</span>
    </div>
    <nav className="lp-footer-links" aria-label="Footer">
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
      <a href="https://discord.gg" target="_blank" rel="noopener noreferrer">Discord</a>
      <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
      <Link href="/privacidad">Privacidad</Link>
    </nav>
  </footer>
)

// ---------- Page ----------
export default function Home() {
  return (
    <div className="lp-home lp-page">
      <Nav />
      <Hero />
      <HowItWorks />
      <RealExample />
      <FinalCTA />
      <Footer />
    </div>
  )
}
