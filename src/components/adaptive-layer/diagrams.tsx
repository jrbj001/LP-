'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FLOW, PRODUCT_ARCH } from './lp-data'

export function ProductArchitecture() {
  return (
    <div className="overflow-hidden rounded-3xl border border-black/[0.06] bg-[#fbfbfa]">
      {/* Fontes */}
      <div className="border-b border-black/[0.05] px-5 py-6 sm:px-8">
        <p className="mb-4 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
          Fontes
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {PRODUCT_ARCH.sources.map((src, i) => (
            <motion.div
              key={src.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="rounded-xl border border-black/[0.07] bg-white px-3 py-2"
            >
              <p className="text-[12px] font-semibold text-neutral-800">{src.label}</p>
              <p className="text-[10px] text-neutral-400">{src.hint}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <Connector label="conectores · eventos · ingestão" />

      {/* Produto */}
      <div className="px-4 py-5 sm:px-8 sm:py-6">
        <div className="overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-900 text-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] px-5 py-4">
            <div>
              <p className="text-[15px] font-semibold tracking-tight">Adaptive Layer™</p>
              <p className="text-[11px] text-white/35">data + context layer · enterprise AI-ready</p>
            </div>
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-white/40">
              produto
            </span>
          </div>

          <div className="grid lg:grid-cols-[132px_1fr]">
            <aside className="border-b border-white/[0.08] px-5 py-4 lg:border-b-0 lg:border-r">
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                Governança
              </p>
              <ul className="flex flex-wrap gap-1.5 lg:flex-col">
                {PRODUCT_ARCH.governance.map(item => (
                  <li
                    key={item}
                    className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[11px] text-white/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </aside>

            <div className="divide-y divide-white/[0.08]">
              {PRODUCT_ARCH.layers.map((layer, i) => (
                <motion.div
                  key={layer.n}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] text-white/30">{layer.n}</span>
                    <p className="text-[15px] font-semibold">{layer.title}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {layer.modules.map(mod => (
                      <span
                        key={mod}
                        className="rounded-md bg-white/[0.07] px-2.5 py-1 text-[11px] text-white/80"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-neutral-400">{PRODUCT_ARCH.note}</p>
      </div>

      <Connector label="contrato único · API · MCP · skills" />

      {/* Saídas */}
      <div className="border-t border-black/[0.05] px-5 py-6 sm:px-8">
        <p className="mb-4 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
          O que a empresa destrava
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {PRODUCT_ARCH.outs.map(out => (
            <div key={out.label} className="rounded-2xl border border-black/[0.06] bg-white px-4 py-4">
              <p className="text-[13px] font-semibold text-neutral-900">{out.label}</p>
              <p className="mt-1 text-[12px] text-neutral-400">{out.hint}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[12px] text-neutral-400">{PRODUCT_ARCH.runtime}</p>
      </div>
    </div>
  )
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-2">
      <span className="h-4 w-px bg-black/[0.1]" />
      <span className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">{label}</span>
      <span className="h-4 w-px bg-black/[0.1]" />
    </div>
  )
}

const STEP_MS = 2200

export function HowItWorksAnimation() {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => {
      setStep(s => (s + 1) % FLOW.beats.length)
    }, STEP_MS)
    return () => window.clearInterval(id)
  }, [reduce])

  const beat = FLOW.beats[step]
  const atFork = beat.id === 'fork' || beat.id === 'vetor'
  const showVector = beat.id === 'vetor' || beat.id === 'contrato'
  const packet = beat.id === 'vetor' ? FLOW.packets[1] : FLOW.packets[0]

  return (
    <div className="rounded-3xl border border-black/[0.06] bg-[#fbfbfa] p-5 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
          Fluxo ao vivo
        </p>
        <motion.span
          key={packet.id + beat.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-full px-3 py-1 text-[11px] font-medium ${
            packet.kind === 'conhecimento'
              ? 'bg-neutral-900 text-white'
              : 'border border-black/[0.08] bg-white text-neutral-700'
          }`}
        >
          {packet.label}
          <span className="ml-1.5 font-normal text-current/50">{packet.kind}</span>
        </motion.span>
      </div>

      {/* Desktop rail */}
      <div className="relative hidden md:block">
        <div className="absolute left-[8%] right-[8%] top-[22px] h-px bg-black/[0.08]" />
        <motion.div
          className="absolute top-[20px] h-1.5 w-1.5 rounded-full bg-neutral-900"
          animate={{ left: `${8 + step * (84 / (FLOW.beats.length - 1))}%` }}
          transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
        />
        <div className="relative grid grid-cols-6 gap-2">
          {FLOW.beats.map((b, i) => {
            const active = i === step
            const passed = i < step
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setStep(i)}
                className="flex flex-col items-center text-center"
              >
                <span
                  className={`mb-3 h-2.5 w-2.5 rounded-full border transition-colors ${
                    active
                      ? 'border-neutral-900 bg-neutral-900'
                      : passed
                        ? 'border-neutral-400 bg-neutral-400'
                        : 'border-black/[0.15] bg-white'
                  }`}
                />
                <span
                  className={`text-[12px] font-semibold ${active ? 'text-neutral-900' : 'text-neutral-400'}`}
                >
                  {b.label}
                </span>
                <span className="mt-0.5 text-[10px] text-neutral-400">{b.hint}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile stack */}
      <ol className="space-y-2 md:hidden">
        {FLOW.beats.map((b, i) => {
          const active = i === step
          return (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => setStep(i)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left ${
                  active ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-black/[0.06] bg-white'
                }`}
              >
                <span className={`text-[10px] font-mono ${active ? 'text-white/40' : 'text-neutral-400'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[13px] font-semibold">{b.label}</span>
                <span className={`ml-auto text-[10px] ${active ? 'text-white/45' : 'text-neutral-400'}`}>
                  {b.hint}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      {/* Fork visual */}
      <div className="mt-8 grid gap-2 sm:grid-cols-2">
        <PathCard
          title="Fato"
          detail="Pedido, saldo, NF, OTD. Fica registro. Não vira vetor."
          lit={atFork && !showVector}
          tone="plain"
        />
        <PathCard
          title="Conhecimento"
          detail="Política, contrato, manual. Agora sim: chunk → embed → chave."
          lit={showVector}
          tone="ink"
        />
      </div>

      <motion.p
        key={beat.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 min-h-[3rem] text-center text-[14px] leading-relaxed text-neutral-600"
      >
        {beat.say}
      </motion.p>
    </div>
  )
}

function PathCard({
  title,
  detail,
  lit,
  tone,
}: {
  title: string
  detail: string
  lit: boolean
  tone: 'plain' | 'ink'
}) {
  const ink = tone === 'ink'
  return (
    <div
      className={`rounded-2xl border px-4 py-4 transition-colors ${
        lit
          ? ink
            ? 'border-neutral-900 bg-neutral-900 text-white'
            : 'border-neutral-900 bg-white text-neutral-900'
          : 'border-black/[0.06] bg-white text-neutral-500'
      }`}
    >
      <p className={`text-[13px] font-semibold ${lit ? '' : 'text-neutral-500'}`}>{title}</p>
      <p className={`mt-1 text-[12px] leading-relaxed ${lit && ink ? 'text-white/55' : 'text-neutral-400'}`}>
        {detail}
      </p>
    </div>
  )
}
