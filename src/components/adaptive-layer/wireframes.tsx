'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import {
  ArrowUp,
  Bot,
  Check,
  GitBranch,
  MessageSquare,
  Paperclip,
  Plug,
  Plus,
  ShieldCheck,
} from 'lucide-react'
import { AnimatedMark } from '@/components/animated-mark'
import { FadeIn } from '@/components/fade-in'
import { WIRE } from './wireframes-data'

type ScreenId = (typeof WIRE.screens)[number]['id']

const ICONS: Record<ScreenId, typeof MessageSquare> = {
  console: MessageSquare,
  grafo: GitBranch,
  agentes: Bot,
  conectores: Plug,
  auditoria: ShieldCheck,
}

export function WireframesPage() {
  const locale = useLocale()
  const [screen, setScreen] = useState<ScreenId>('console')

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-neutral-900">
      <nav className="border-b border-black/[0.06] bg-[#fbfbfa]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <a href={`/${locale}/pixel`} className="flex items-center gap-2.5">
            <AnimatedMark className="h-7 w-7 flex-shrink-0" />
            <span className="text-[14px] font-semibold tracking-[-0.03em]">
              Adaptive Layer™
              <span className="ml-1.5 font-normal text-neutral-400">wireframes</span>
            </span>
          </a>
          <a href={`/${locale}/pixel`} className="text-[13px] text-neutral-400 hover:text-neutral-900">
            Voltar à LP
          </a>
        </div>
      </nav>

      <main className="mx-auto max-w-[1200px] px-6 pb-20 pt-12">
        <FadeIn>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            <span className="font-mono normal-case tracking-normal text-neutral-300">{'// '}</span>
            {WIRE.eyebrow}
          </p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <h1 className="max-w-3xl text-[30px] font-semibold tracking-[-0.03em] sm:text-[40px]">
            {WIRE.headline}
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-neutral-500">{WIRE.lede}</p>
        </FadeIn>

        <FadeIn delay={0.16}>
          <div className="mt-10 overflow-hidden rounded-3xl border border-black/[0.08] bg-white shadow-[0_32px_96px_-40px_rgba(0,0,0,0.35)]">
            {/* window title bar */}
            <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#171717] px-4 py-3">
              <span className="h-[8px] w-[8px] rounded-full bg-neutral-600" />
              <span className="h-[8px] w-[8px] rounded-full bg-neutral-600" />
              <span className="h-[8px] w-[8px] rounded-full bg-neutral-600" />
              <span className="ml-2 font-mono text-[11px] text-white/30">
                adaptive-layer — app · {WIRE.tenant}
              </span>
              <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-400/80">
                <span className="h-[6px] w-[6px] rounded-full bg-emerald-400" />
                os · online
              </span>
            </div>

            <div className="flex min-h-[620px]">
              {/* rail */}
              <aside className="flex w-14 flex-shrink-0 flex-col border-r border-black/[0.06] bg-[#fbfbfa] sm:w-[200px]">
                <div className="p-3">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/[0.08] bg-white px-2 py-2 text-[12.5px] font-medium text-neutral-700 hover:border-black/[0.16] sm:justify-start sm:px-3"
                  >
                    <Plus className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
                    <span className="hidden sm:inline">Nova conversa</span>
                  </button>
                </div>
                <div className="flex-1 px-3">
                  <p className="mb-1.5 hidden px-2 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400 sm:block">
                    espaço
                  </p>
                  {WIRE.screens.map(s => {
                    const Icon = ICONS[s.id]
                    const active = screen === s.id
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setScreen(s.id)}
                        className={`mb-0.5 flex w-full items-center justify-center gap-2.5 rounded-lg px-2 py-2 text-left text-[13px] sm:justify-start sm:px-2.5 ${
                          active
                            ? 'bg-neutral-900 font-medium text-white'
                            : 'text-neutral-600 hover:bg-black/[0.04]'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.8} />
                        <span className="hidden sm:inline">{s.label}</span>
                      </button>
                    )
                  })}
                </div>
                <div className="hidden border-t border-black/[0.06] p-4 sm:block">
                  <p className="text-[12px] font-medium text-neutral-700">Café Orfeu</p>
                  <p className="font-mono text-[10px] text-neutral-400">byoc · aws sa-east-1</p>
                </div>
              </aside>

              {/* content */}
              <div className="min-w-0 flex-1 bg-white">
                {screen === 'console' && <ConsoleScreen />}
                {screen === 'grafo' && <GraphScreen />}
                {screen === 'agentes' && <AgentsScreen />}
                {screen === 'conectores' && <ConnectorsScreen />}
                {screen === 'auditoria' && <AuditScreen />}
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-6 text-center font-mono text-[11px] text-neutral-400">
            wireframe de alta fidelidade — dados ilustrativos · a resposta sempre nasce do grafo, com fonte e permissão
          </p>
        </FadeIn>
      </main>
    </div>
  )
}

/* ---------------- Console (chat) ---------------- */

function ConsoleScreen() {
  const c = WIRE.console
  return (
    <div className="flex h-full min-h-[620px]">
      {/* history */}
      <aside className="hidden w-[220px] flex-shrink-0 border-r border-black/[0.05] px-3 py-4 lg:block">
        <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">
          recentes
        </p>
        {c.history.map((h, i) => (
          <p
            key={h}
            className={`mb-0.5 truncate rounded-lg px-2.5 py-2 text-[12.5px] ${
              i === 0 ? 'bg-black/[0.05] font-medium text-neutral-800' : 'text-neutral-500 hover:bg-black/[0.03]'
            }`}
          >
            {h}
          </p>
        ))}
      </aside>

      {/* thread */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10">
          <div className="mx-auto max-w-[640px]">
            {/* user */}
            <div className="flex justify-end">
              <p className="max-w-[80%] rounded-2xl rounded-br-md bg-neutral-900 px-4 py-2.5 text-[14px] text-white">
                {c.question}
              </p>
            </div>

            {/* assistant */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="mt-6 flex gap-3"
            >
              <AnimatedMark className="mt-0.5 h-6 w-6 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] leading-relaxed text-neutral-700">{c.answer.intro}</p>

                <div className="mt-4 overflow-hidden rounded-xl border border-black/[0.07]">
                  <p className="border-b border-black/[0.05] bg-[#fbfbfa] px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                    fato · knowledge graph
                  </p>
                  {c.answer.facts.map(f => (
                    <div
                      key={f.label}
                      className="flex items-baseline justify-between gap-3 border-b border-black/[0.04] px-3.5 py-2.5 last:border-b-0"
                    >
                      <p className="text-[13px]">
                        <span className="font-medium text-neutral-900">{f.label}</span>
                        <span className="text-neutral-500"> — {f.value}</span>
                      </p>
                      <p className="flex-shrink-0 font-mono text-[10px] text-neutral-400">{f.source}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 rounded-xl border border-black/[0.07] bg-[#fbfbfa] px-4 py-3.5">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                    fonte · documento
                  </p>
                  <p className="border-l-2 border-neutral-300 pl-3 text-[13px] italic leading-relaxed text-neutral-600">
                    “{c.answer.quote.text}”
                  </p>
                  <p className="mt-2 pl-3 text-[12px] font-medium text-neutral-500">{c.answer.quote.doc}</p>
                </div>

                <p className="mt-3 flex items-center gap-1.5 font-mono text-[10.5px] text-neutral-400">
                  <Check className="h-3 w-3 text-emerald-500" strokeWidth={2.5} />
                  {c.answer.footer}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* composer */}
        <div className="border-t border-black/[0.05] px-6 py-4 sm:px-10">
          <div className="mx-auto max-w-[640px]">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {c.outputChips.map(chip => (
                <button
                  key={chip}
                  type="button"
                  className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[11.5px] text-neutral-500 hover:border-black/[0.2] hover:text-neutral-800"
                >
                  {chip}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2 rounded-2xl border border-black/[0.1] bg-white px-4 py-3 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.25)]">
              <Paperclip className="mb-0.5 h-4 w-4 flex-shrink-0 text-neutral-300" strokeWidth={1.8} />
              <p className="flex-1 text-[14px] text-neutral-400">{c.placeholder}</p>
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900">
                <ArrowUp className="h-4 w-4 text-white" strokeWidth={2.2} />
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <p className="font-mono text-[10.5px] text-neutral-400">
                modelo:{' '}
                {c.models.map((m, i) => (
                  <span key={m} className={i === 0 ? 'text-neutral-700' : ''}>
                    {i > 0 && ' · '}
                    {m}
                  </span>
                ))}
                <span className="text-neutral-300"> — troque, o contexto fica</span>
              </p>
              <p className="font-mono text-[10.5px] text-neutral-300">acl ativa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Grafo ---------------- */

function GraphScreen() {
  const g = WIRE.graph
  const byId = Object.fromEntries(g.nodes.map(n => [n.id, n]))
  return (
    <div className="flex h-full min-h-[620px] flex-col lg:flex-row">
      <div className="flex-1 p-6 sm:p-8">
        <ScreenHeader title="Knowledge graph" hint={`foco: ${g.focus}`} />
        <div className="mt-6 rounded-2xl border border-black/[0.07] bg-[#fbfbfa]">
          <svg viewBox="0 0 600 230" className="w-full">
            {g.edges.map(e => {
              const a = byId[e.from]
              const b = byId[e.to]
              return (
                <g key={`${e.from}-${e.to}`}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#d4d4d4" strokeWidth="1.2" />
                  <text
                    x={(a.x + b.x) / 2}
                    y={(a.y + b.y) / 2 - 6}
                    textAnchor="middle"
                    className="fill-neutral-400"
                    style={{ fontSize: 9, fontFamily: 'var(--font-mono)' }}
                  >
                    {e.label}
                  </text>
                </g>
              )
            })}
            {g.nodes.map(n => {
              const w = n.main ? 128 : 118
              const h = n.main ? 46 : 42
              return (
                <g key={n.id}>
                  <motion.rect
                    x={n.x - w / 2}
                    y={n.y - h / 2}
                    width={w}
                    height={h}
                    rx={12}
                    fill={n.main ? '#171717' : '#ffffff'}
                    stroke={n.main ? '#171717' : '#d4d4d4'}
                    strokeWidth="1.2"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35 }}
                  />
                  <text
                    x={n.x}
                    y={n.y - 2}
                    textAnchor="middle"
                    fill={n.main ? '#ffffff' : '#171717'}
                    style={{ fontSize: 10.5, fontWeight: 600 }}
                  >
                    {n.label}
                  </text>
                  <text
                    x={n.x}
                    y={n.y + 11}
                    textAnchor="middle"
                    fill="#a3a3a3"
                    style={{ fontSize: 8, fontFamily: 'var(--font-mono)' }}
                  >
                    {n.hint}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
        <p className="mt-3 font-mono text-[10.5px] text-neutral-400">
          o dado entra uma vez · cada nó carrega os trechos de documento que apontam para ele
        </p>
      </div>

      <aside className="w-full flex-shrink-0 border-t border-black/[0.05] p-6 lg:w-[280px] lg:border-l lg:border-t-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">nó selecionado</p>
        <p className="mt-2 text-[15px] font-semibold">{g.panel.title}</p>
        <dl className="mt-4 space-y-3">
          {g.panel.rows.map(r => (
            <div key={r.k}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-400">{r.k}</dt>
              <dd className="mt-0.5 text-[12.5px] leading-relaxed text-neutral-600">{r.v}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  )
}

/* ---------------- Agentes ---------------- */

function AgentsScreen() {
  return (
    <div className="p-6 sm:p-8">
      <ScreenHeader title="Agentes" hint="cada agente tem dono, ferramentas e trilha" />
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {WIRE.agents.map(a => (
          <article key={a.name} className="rounded-2xl border border-black/[0.07] p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[13px] font-semibold text-neutral-900">{a.name}</p>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${
                  a.status === 'ativo'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-amber-50 text-amber-600'
                }`}
              >
                {a.status}
              </span>
            </div>
            <p className="mt-1.5 text-[12.5px] text-neutral-500">dono: {a.owner}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {a.tools.map(t => (
                <span
                  key={t}
                  className="rounded-md bg-black/[0.05] px-2 py-0.5 font-mono text-[11px] text-neutral-600"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-3 font-mono text-[10.5px] text-neutral-400">{a.runs}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Conectores ---------------- */

function ConnectorsScreen() {
  return (
    <div className="p-6 sm:p-8">
      <ScreenHeader title="Conectores" hint="cada sistema continua no seu lugar" />
      <div className="mt-6 overflow-hidden rounded-2xl border border-black/[0.07]">
        {WIRE.connectors.map(c => (
          <div
            key={c.name}
            className="grid grid-cols-[8px_130px_1fr] items-center gap-x-4 gap-y-1 border-b border-black/[0.05] px-5 py-4 last:border-b-0 md:grid-cols-[8px_130px_1fr_auto_auto]"
          >
            <span
              className={`h-[8px] w-[8px] rounded-full ${
                c.status === 'ok' ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
            <p className="text-[13.5px] font-semibold text-neutral-900">{c.name}</p>
            <p className="truncate text-[12.5px] text-neutral-500">{c.kind}</p>
            <p className="col-start-3 font-mono text-[11px] text-neutral-400 md:col-start-auto">
              sync {c.sync}
            </p>
            <p className="col-start-3 font-mono text-[11px] text-neutral-400 md:col-start-auto md:text-right">
              {c.events}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[10.5px] text-neutral-400">
        eventos entram uma vez · sem redigitar · sem planilha paralela
      </p>
    </div>
  )
}

/* ---------------- Auditoria ---------------- */

function AuditScreen() {
  return (
    <div className="p-6 sm:p-8">
      <ScreenHeader title="Auditoria" hint="pessoa, agente e sistema na mesma trilha" />
      <div className="mt-6 overflow-hidden rounded-2xl border border-black/[0.07]">
        <div className="grid grid-cols-[132px_1fr_120px_44px] gap-3 border-b border-black/[0.06] bg-[#fbfbfa] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-400">
          <span>quem</span>
          <span>o quê</span>
          <span>permissão</span>
          <span className="text-right">hora</span>
        </div>
        {WIRE.audit.map(row => (
          <div
            key={`${row.who}-${row.when}`}
            className={`grid grid-cols-[132px_1fr_120px_44px] gap-3 border-b border-black/[0.04] px-5 py-3 text-[12.5px] last:border-b-0 ${
              row.denied ? 'bg-red-50/50' : ''
            }`}
          >
            <span className="break-words font-mono text-[11.5px] leading-snug text-neutral-700">{row.who}</span>
            <span className={row.denied ? 'text-red-600' : 'text-neutral-600'}>{row.what}</span>
            <span className="break-words font-mono text-[11px] leading-snug text-neutral-400">{row.acl}</span>
            <span className="text-right font-mono text-[11px] text-neutral-400">{row.when}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[10.5px] text-neutral-400">
        cada acesso fica logado — inclusive o que foi negado
      </p>
    </div>
  )
}

/* ---------------- shared ---------------- */

function ScreenHeader({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h2 className="text-[18px] font-semibold tracking-[-0.02em]">{title}</h2>
      <p className="font-mono text-[11px] text-neutral-400">{hint}</p>
    </div>
  )
}
