'use client'

import {
  siVercel, siGooglecloud, siRailway, siSupabase, siUpstash,
  siAnthropic, siGithub, siJira, siMailchimp, siBackblaze, siDeepseek,
  siPostgresql, siAuth0, siFirebase, siAppstore, siGoogleplay,
} from 'simple-icons'

// ─── Custom SVG paths for brands not in simple-icons ─────────────────────────

const CUSTOM_ICONS: Record<string, { path: string; viewBox?: string }> = {
  openai: {
    viewBox: '0 0 24 24',
    path: 'M22.28 9.28a6.1 6.1 0 0 0-.52-5.01 6.17 6.17 0 0 0-6.64-2.97A6.1 6.1 0 0 0 10.5 0 6.17 6.17 0 0 0 4.6 4.2a6.1 6.1 0 0 0-4.08 2.97 6.17 6.17 0 0 0 .76 7.25A6.1 6.1 0 0 0 1.8 19.5a6.17 6.17 0 0 0 6.64 2.97A6.1 6.1 0 0 0 13.5 24a6.17 6.17 0 0 0 5.88-4.28 6.1 6.1 0 0 0 4.08-2.97 6.17 6.17 0 0 0-.76-7.25zM13.5 22.5a4.67 4.67 0 0 1-3-.78l.15-.08 4.98-2.88a.83.83 0 0 0 .41-.71v-7.03l2.1 1.21a.08.08 0 0 1 .04.06v5.82a4.69 4.69 0 0 1-4.68 4.39zm-10.05-4.3a4.67 4.67 0 0 1-.56-3.13l.15.09 4.98 2.88a.83.83 0 0 0 .82 0l6.08-3.51v2.42a.08.08 0 0 1-.03.07L9.8 20.1a4.69 4.69 0 0 1-6.35-1.9zm-1.3-10.86A4.67 4.67 0 0 1 4.6 5.02v5.92a.83.83 0 0 0 .41.71l6.08 3.51-2.1 1.21a.08.08 0 0 1-.08 0L3.84 13.3a4.69 4.69 0 0 1-.69-6zm17.22 4.01-6.08-3.51 2.1-1.21a.08.08 0 0 1 .08 0l5.07 2.93a4.69 4.69 0 0 1-.73 8.46V12.1a.83.83 0 0 0-.44-.75zm2.09-3.15-.15-.09-4.98-2.87a.83.83 0 0 0-.82 0L9.43 9.25V6.83a.08.08 0 0 1 .03-.07l5.07-2.93a4.69 4.69 0 0 1 6.93 4.87zm-13.15 4.32-2.1-1.21a.08.08 0 0 1-.04-.06V5.93a4.69 4.69 0 0 1 7.69-3.6l-.15.08-4.98 2.88a.83.83 0 0 0-.41.71l-.01 7.03zm1.14-2.46 2.71-1.56 2.71 1.56v3.12l-2.71 1.56-2.71-1.56V10.06z',
  },
  slack: {
    viewBox: '0 0 24 24',
    path: 'M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z',
  },
  azure: {
    viewBox: '0 0 24 24',
    path: 'M13.05 4.24L6.56 18.05l5.86.09-1.09 1.62H17.5l-4.45-15.52zM8.89 6.78L3.6 18.18l2.95.04-2.05 3.04h5.72L13.9 6.78H8.89z',
  },
  cursor: {
    viewBox: '0 0 24 24',
    path: 'M4 0l16 12-7 2-4 8z',
  },
  claude: {
    viewBox: '0 0 24 24',
    path: 'M4.255 11.085C4.255 7.219 7.34 4.08 11.13 4.08c2.198 0 4.154 1.037 5.44 2.664l1.776-1.313C16.55 3.257 14.002 1.872 11.13 1.872 6.12 1.872 2.048 6.003 2.048 11.085c0 5.083 4.073 9.213 9.083 9.213 2.872 0 5.42-1.385 7.216-3.56l-1.776-1.313c-1.286 1.628-3.242 2.665-5.44 2.665-3.79 0-6.876-3.139-6.876-7.005zm11.23-1.104-1.56 1.59 3.245 3.367h-6.34v2.208h6.34L13.924 20.5l1.56 1.59 5.515-5.606-5.515-5.503z',
  },
  gather: {
    viewBox: '0 0 24 24',
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  },
  sqlserver: {
    viewBox: '0 0 24 24',
    path: 'M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5zm0 2c4.42 0 8 1.57 8 3s-3.58 3-8 3-8-1.57-8-3 3.58-3 8-3zm0 16c-4.42 0-8-1.57-8-3v-2.23C5.61 15.84 8.65 16.5 12 16.5s6.39-.66 8-1.73V17c0 1.43-3.58 3-8 3zm0-5.5c-4.42 0-8-1.57-8-3v-2.23C5.61 10.34 8.65 11 12 11s6.39-.66 8-1.73V11.5c0 1.43-3.58 3-8 3z',
  },
}

// ─── Brand definitions ────────────────────────────────────────────────────────
interface Brand {
  name: string
  category: string
  color: string
  si?: typeof siVercel
  custom?: string
}

const BRANDS: Brand[] = [
  // Row 1
  { name: 'Vercel',       category: 'Deploy',    color: '#ffffff', si: siVercel },
  { name: 'Google Cloud', category: 'Cloud',     color: '#4285F4', si: siGooglecloud },
  { name: 'OpenAI',       category: 'AI',        color: '#412991', custom: 'openai' },
  { name: 'Anthropic',    category: 'AI',        color: '#D97757', si: siAnthropic },
  { name: 'Claude',       category: 'AI',        color: '#D97757', custom: 'claude' },
  { name: 'DeepSeek',     category: 'AI',        color: '#4D6BFE', si: siDeepseek },
  { name: 'GitHub',       category: 'Code',      color: '#ffffff', si: siGithub },
  { name: 'Cursor',       category: 'IDE',       color: '#ffffff', custom: 'cursor' },
  { name: 'Supabase',     category: 'Database',  color: '#3ECF8E', si: siSupabase },
  { name: 'PostgreSQL',   category: 'Database',  color: '#4169E1', si: siPostgresql },
  { name: 'SQL Server',   category: 'Database',  color: '#CC2927', custom: 'sqlserver' },
  { name: 'Firebase',     category: 'Backend',   color: '#DD2C00', si: siFirebase },
  // Row 2
  { name: 'Upstash',      category: 'Cache',     color: '#00E9A3', si: siUpstash },
  { name: 'Railway',      category: 'Deploy',    color: '#ffffff', si: siRailway },
  { name: 'Azure',        category: 'Cloud',     color: '#0078D4', custom: 'azure' },
  { name: 'Slack',        category: 'Comms',     color: '#4A154B', custom: 'slack' },
  { name: 'Jira',         category: 'Planning',  color: '#0052CC', si: siJira },
  { name: 'Auth0',        category: 'Auth',      color: '#EB5424', si: siAuth0 },
  { name: 'Mailchimp',    category: 'Marketing', color: '#FFE01B', si: siMailchimp },
  { name: 'Gather',       category: 'Remote',    color: '#3D9EFF', custom: 'gather' },
  { name: 'Bob Storage',  category: 'Storage',   color: '#FF5722', si: siBackblaze },
  { name: 'App Store',    category: 'Mobile',    color: '#0D96F6', si: siAppstore },
  { name: 'Google Play',  category: 'Mobile',    color: '#34A853', si: siGoogleplay },
]

// Split into two rows and duplicate for seamless loop
const ROW1 = BRANDS.slice(0, 12)
const ROW2 = BRANDS.slice(12)

// ─── Single brand card ────────────────────────────────────────────────────────
function BrandCard({ brand }: { brand: Brand }) {
  const iconData = brand.custom ? CUSTOM_ICONS[brand.custom] : null
  const svgPath = iconData?.path ?? brand.si?.path

  return (
    <div
      className="group flex items-center gap-3 px-5 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 cursor-default flex-shrink-0"
    >
      {/* Icon */}
      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
        {svgPath ? (
          <svg
            viewBox={iconData?.viewBox ?? '0 0 24 24'}
            className="w-full h-full transition-all duration-300"
            style={{ fill: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={e => { (e.currentTarget as SVGElement).style.fill = brand.color }}
            onMouseLeave={e => { (e.currentTarget as SVGElement).style.fill = 'rgba(255,255,255,0.35)' }}
          >
            <path d={svgPath} />
          </svg>
        ) : (
          <span className="text-[10px] font-bold text-white/40 font-mono">
            {brand.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Name */}
      <span className="text-sm font-medium text-white/50 group-hover:text-white/80 transition-colors whitespace-nowrap">
        {brand.name}
      </span>

      {/* Category badge */}
      <span className="text-[10px] font-mono tracking-wider uppercase text-white/20 group-hover:text-white/40 transition-colors">
        {brand.category}
      </span>
    </div>
  )
}

// ─── Marquee row ──────────────────────────────────────────────────────────────
function MarqueeRow({ brands, reverse = false }: { brands: Brand[]; reverse?: boolean }) {
  // Duplicate for seamless loop
  const items = [...brands, ...brands, ...brands]

  return (
    <div className="relative overflow-hidden">
      {/* Fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />

      <div
        className="flex gap-3 w-max"
        style={{
          animation: `marquee-${reverse ? 'right' : 'left'} ${brands.length * 4}s linear infinite`,
        }}
      >
        {items.map((brand, i) => (
          <BrandCard key={`${brand.name}-${i}`} brand={brand} />
        ))}
      </div>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function TechStack() {
  return (
    <section className="py-24 border-b border-white/[0.06] overflow-hidden" id="stack">
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0) }
          100% { transform: translateX(-33.333%) }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-33.333%) }
          100% { transform: translateX(0) }
        }
        @keyframes marquee-left:hover,
        @keyframes marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mx-auto max-w-[1200px] px-6 mb-12">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">Technology Stack</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] max-w-xl">
          Tools We Build With<span className="text-text-secondary"> Every Day</span>
        </h2>
      </div>

      <div className="space-y-4">
        <MarqueeRow brands={ROW1} />
        <MarqueeRow brands={ROW2} reverse />
      </div>
    </section>
  )
}
