'use client'

import { motion } from 'framer-motion'
import {
  ArrowDown,
  Bot,
  Braces,
  Cable,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react'
import {
  AGENTS,
  LAYER_CAPS,
  ORFEU_CASE,
  SYSTEMS_GENERIC,
  UNLOCKS,
} from './pixel-data'

const CAP_ICONS = [Cable, Braces, Workflow, ShieldCheck]

/* ─── Hero visual: malha de sistemas → núcleo Pixel ─────────────────────────── */

export function HeroMesh() {
  const nodes = SYSTEMS_GENERIC
  return (
    <div className="relative w-full h-full min-h-[100svh] overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(52,211,153,0.18),transparent_50%),radial-gradient(ellipse_at_30%_70%,rgba(255,255,255,0.05),transparent_45%)]" />
      <div
        className="absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at 65% 45%, black 15%, transparent 72%)',
        }}
      />

      {/* SVG connections — right-weighted composition */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {nodes.map((_, i) => {
          const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2
          const cx = 68
          const cy = 48
          const r = 28
          const x = cx + Math.cos(angle) * r
          const y = cy + Math.sin(angle) * r
          return (
            <g key={i}>
              <line
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="rgba(52,211,153,0.28)"
                strokeWidth="0.15"
                strokeDasharray="0.8 1.2"
              />
              <circle cx={x} cy={y} r="0.45" fill="rgba(52,211,153,0.5)" />
            </g>
          )
        })}
        <circle cx="68" cy="48" r="7" fill="none" stroke="rgba(52,211,153,0.2)" strokeWidth="0.2" />
      </svg>

      <div className="absolute inset-0 flex items-center justify-end pr-[4%] md:pr-[8%]">
        <div className="relative w-[min(92vw,520px)] aspect-square">
          {nodes.map((sys, i) => {
            const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2
            const r = 40
            const x = 50 + Math.cos(angle) * r
            const y = 50 + Math.sin(angle) * r
            return (
              <motion.div
                key={sys}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-[1]"
                style={{ left: `${x}%`, top: `${y}%` }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <motion.div
                  className="rounded-xl border border-white/20 bg-white/[0.08] backdrop-blur-md px-3 py-2 text-[11px] sm:text-[12px] font-medium text-white/85 whitespace-nowrap shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)]"
                  animate={{ y: [0, i % 2 === 0 ? -5 : 5, 0] }}
                  transition={{ duration: 4.2 + i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {sys}
                </motion.div>
              </motion.div>
            )
          })}

          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-8 rounded-full bg-emerald-400/25 blur-3xl"
                animate={{ opacity: [0.4, 0.75, 0.4], scale: [0.92, 1.08, 0.92] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-[32px] bg-gradient-to-br from-neutral-900 via-neutral-900 to-emerald-950 border border-emerald-400/40 shadow-[0_24px_80px_-20px_rgba(16,185,129,0.55)] flex flex-col items-center justify-center gap-1">
                <Layers className="w-6 h-6 text-emerald-400" strokeWidth={1.75} />
                <span className="font-[family-name:var(--font-pixel-display)] text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Pixel
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-emerald-400/85">SDK</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ─── Arquitetura ilustrada ─────────────────────────────────────────────────── */

export function ArchitectureIllustration() {
  return (
    <div className="relative">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400 text-center mb-5">
        O que você já tem — nada é substituído
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-1">
        {SYSTEMS_GENERIC.map((system) => (
          <div
            key={system}
            className="rounded-xl border border-black/[0.07] bg-white px-3.5 py-2.5 text-[12px] font-medium text-neutral-700 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
          >
            {system}
          </div>
        ))}
      </div>

      <FlowLabel label="conectores dedicados · sem redigitação" />

      <div className="rounded-3xl bg-neutral-950 text-white p-6 sm:p-8 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(52,211,153,0.12),transparent_55%)]" />
        <div className="relative">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <Layers className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
            <p className="font-[family-name:var(--font-pixel-display)] text-xl sm:text-2xl font-bold tracking-tight">
              Pixel
            </p>
            <span className="text-[11px] text-white/35">Adaptive Layer™</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {LAYER_CAPS.map((cap, i) => {
              const Icon = CAP_ICONS[i]
              return (
                <div
                  key={cap.label}
                  className="rounded-2xl bg-white/[0.06] border border-white/[0.08] px-3 py-4 flex flex-col items-center gap-2 text-center"
                >
                  <Icon className="w-4 h-4 text-emerald-400/80" strokeWidth={1.75} />
                  <span className="text-[12px] text-white/90 font-medium leading-tight">{cap.label}</span>
                  <span className="text-[10px] text-white/35 leading-tight">{cap.hint}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <FlowLabel label="a Layer alimenta os dois caminhos" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">Caminho principal</p>
          <p className="mt-2 text-[15px] font-semibold text-neutral-900">Squad Pixel com dono</p>
          <p className="mt-1 text-[12px] text-neutral-500 leading-relaxed">
            Um agente por área. Tools nascem do processo. Memória do pedido, não da wiki.
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-black/[0.1] bg-white p-5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">Opcional</p>
          <p className="mt-2 text-[15px] font-semibold text-neutral-900">MCP Gateway</p>
          <p className="mt-1 text-[12px] text-neutral-500 leading-relaxed">
            Copilot ou o próximo cliente MCP. Mesmo contrato. Sem virar o produto.
          </p>
        </div>
      </div>

      <FlowLabel label="runtime na conta do cliente — ou no edge brasileiro" />

      <div className="mb-8 rounded-2xl border border-black/[0.06] bg-white px-5 py-4 flex flex-wrap items-center justify-center gap-2 text-[12px] text-neutral-600">
        <span className="rounded-full bg-[#f2f2f0] px-3 py-1.5">Conta do cliente</span>
        <span className="text-neutral-300">·</span>
        <span className="rounded-full bg-[#f2f2f0] px-3 py-1.5">Edge BR · residência</span>
        <span className="text-neutral-300">·</span>
        <span className="rounded-full bg-[#f2f2f0] px-3 py-1.5">GPU é COGS</span>
      </div>

      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-800/60 text-center mb-4">
        O que a camada destrava
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {UNLOCKS.map((unlock) => (
          <div
            key={unlock}
            className="flex items-start gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-3.5 py-3.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
            <span className="text-[13px] text-emerald-950/90 leading-snug">{unlock}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FlowLabel({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-4">
      <ArrowDown className="w-4 h-4 text-neutral-300" strokeWidth={2} />
      <span className="text-[10px] text-neutral-400 uppercase tracking-[0.14em]">{label}</span>
      <ArrowDown className="w-4 h-4 text-neutral-300" strokeWidth={2} />
    </div>
  )
}

/* ─── Squad de agentes — ilustração heroica ─────────────────────────────────── */

export function AgentsOrchestra() {
  return (
    <div className="relative">
      {/* Base escura com agentes */}
      <div className="rounded-[28px] bg-neutral-950 p-6 sm:p-10 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(52,211,153,0.15),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {AGENTS.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 hover:bg-white/[0.06] hover:border-emerald-400/25 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${agent.accent}22`, boxShadow: `inset 0 0 0 1px ${agent.accent}44` }}
                >
                  <Bot className="w-4 h-4" style={{ color: agent.accent }} strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-white leading-tight">{agent.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/35 mt-0.5">{agent.domain}</p>
                </div>
              </div>
              <p className="text-[13px] text-white/55 leading-relaxed mb-3">{agent.role}</p>
              <p className="text-[12px] text-emerald-300/80 italic leading-snug border-l-2 border-emerald-400/30 pl-3">
                {agent.example}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="relative flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-[0.18em]">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
            todos consultam a mesma fonte
          </div>
          <div className="w-full max-w-xl rounded-2xl border border-emerald-400/25 bg-gradient-to-r from-emerald-500/10 via-white/[0.04] to-emerald-500/10 px-6 py-5 flex flex-wrap items-center justify-center gap-3 text-center">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
              <span className="text-[14px] font-semibold text-white">LLM + Pixel</span>
            </div>
            <span className="hidden sm:block text-white/20">·</span>
            <span className="text-[12px] text-white/50 max-w-sm">
              Adaptive Layer™ — dados unificados, seguros e auditáveis
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Jornada Orfeu ilustrada ───────────────────────────────────────────────── */

export function OrfeuJourney() {
  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none -mx-1 px-1">
        {ORFEU_CASE.journey.map((step, i) => (
          <div key={step.stage} className="snap-start flex-shrink-0 w-[140px] sm:w-[160px]">
            <div className="rounded-2xl border border-black/[0.06] bg-white p-4 h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono text-neutral-400">{String(i + 1).padStart(2, '0')}</span>
                {i < ORFEU_CASE.journey.length - 1 && (
                  <span className="flex-1 h-px bg-gradient-to-r from-neutral-200 to-transparent" />
                )}
              </div>
              <p className="text-[14px] font-semibold text-neutral-900 mb-1.5">{step.stage}</p>
              <p className="text-[11px] text-neutral-500 leading-snug">{step.pain}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-black/[0.06] bg-neutral-950 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-400/10 blur-3xl rounded-full" />
        <p className="relative text-[15px] sm:text-[17px] leading-relaxed text-white/80 max-w-2xl font-[family-name:var(--font-pixel-display)]">
          “{ORFEU_CASE.quote}”
        </p>
        <p className="relative mt-4 text-[11px] uppercase tracking-[0.16em] text-emerald-400/70">
          Adaptive Layer™ · Executive Review Orfeu
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {ORFEU_CASE.systems.map((s) => (
          <span
            key={s}
            className="rounded-full border border-black/[0.07] bg-white px-3 py-1.5 text-[11px] font-medium text-neutral-600"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Stack do SDK ilustrada ────────────────────────────────────────────────── */

export function SdkStackIllustration({
  layers,
}: {
  layers: { id: string; label: string; detail: string }[]
}) {
  return (
    <div className="space-y-2">
      {layers.map((layer, i) => {
        const isCore = layer.id === 'core' || layer.id === 'agents' || layer.id === 'runtime'
        return (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
            className={`rounded-2xl px-5 py-4 flex items-center justify-between gap-4 border ${
              isCore
                ? 'bg-neutral-950 text-white border-emerald-400/20 shadow-[0_12px_40px_-20px_rgba(16,185,129,0.4)]'
                : 'bg-white text-neutral-900 border-black/[0.06]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`text-[10px] font-mono ${isCore ? 'text-emerald-400/70' : 'text-neutral-400'}`}
              >
                {String(i).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <p className={`text-[15px] font-semibold tracking-tight ${isCore ? 'text-white' : 'text-neutral-900'}`}>
                  {layer.label}
                </p>
                <p className={`text-[12px] truncate ${isCore ? 'text-white/45' : 'text-neutral-500'}`}>
                  {layer.detail}
                </p>
              </div>
            </div>
            {isCore && <Layers className="w-4 h-4 text-emerald-400 flex-shrink-0" strokeWidth={1.75} />}
          </motion.div>
        )
      })}
    </div>
  )
}
