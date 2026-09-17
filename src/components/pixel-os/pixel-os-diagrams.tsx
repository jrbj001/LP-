'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  ACTION_COMMANDS,
  ADAPTIVE_CAPABILITIES,
  CADENCE_CONTEXT,
  CADENCE_FLOW,
  CONTEXT_NODES,
  CONTEXT_PATH,
  ENTERPRISE_SYSTEMS,
  FLYWHEEL,
  FRAGMENTED_SYSTEMS,
  GOVERNANCE_STEPS,
  MODELS,
} from './pixel-os-data'

const ease = [0.21, 0.47, 0.32, 0.98] as const

function PulseLine({ vertical = false, delay = 0 }: { vertical?: boolean; delay?: number }) {
  const reduceMotion = useReducedMotion()
  return (
    <span
      aria-hidden
      className={
        vertical
          ? 'relative block h-14 w-px overflow-hidden bg-white/12'
          : 'relative block h-px min-w-8 flex-1 overflow-hidden bg-white/12'
      }
    >
      {!reduceMotion && (
        <motion.span
          className="absolute bg-emerald-300"
          style={vertical ? { width: 1, height: 16, left: 0 } : { height: 1, width: 28, top: 0 }}
          animate={vertical ? { y: [-18, 58] } : { x: [-30, 180] }}
          transition={{ duration: 2.4, repeat: Infinity, delay, ease: 'linear' }}
        />
      )}
    </span>
  )
}

function TechnicalLabel({
  children,
  active = false,
  dark = true,
}: {
  children: React.ReactNode
  active?: boolean
  dark?: boolean
}) {
  return (
    <span
      className={[
        'inline-flex min-h-8 items-center justify-center border-b px-1.5 font-mono text-[10px] uppercase tracking-[0.12em]',
        dark
          ? active
            ? 'border-emerald-300/70 text-emerald-200'
            : 'border-white/15 text-white/52'
          : active
            ? 'border-emerald-700/50 text-emerald-900'
            : 'border-black/15 text-neutral-500',
      ].join(' ')}
    >
      {children}
    </span>
  )
}

export function InfrastructureMap() {
  const reduceMotion = useReducedMotion()
  return (
    <div
      className="relative mx-auto w-full max-w-[1080px] overflow-hidden border-y border-white/10 py-10 md:py-14"
      role="img"
      aria-label="AI models converge through Pixel into a shared enterprise context connected to company systems."
    >
      <div className="hidden md:grid grid-cols-[1fr_150px_1fr] items-center gap-8">
        <div className="space-y-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/28">Models / interchangeable</p>
          {MODELS.map((model, index) => (
            <motion.div
              key={model}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: index * 0.06, ease }}
            >
              <TechnicalLabel>{model}</TechnicalLabel>
              <PulseLine delay={index * 0.22} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="relative z-10 flex aspect-square items-center justify-center border border-emerald-300/35 bg-neutral-950"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="absolute inset-3 border border-white/8" />
          <div className="text-center">
            <span className="block font-mono text-[8px] uppercase tracking-[0.24em] text-emerald-300/70">Context layer</span>
            <span className="mt-2 block text-2xl font-semibold tracking-[-0.04em]">PIXEL</span>
          </div>
          {!reduceMotion && (
            <motion.span
              className="absolute inset-0 border border-emerald-300/20"
              animate={{ scale: [1, 1.16], opacity: [0.45, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </motion.div>

        <div className="space-y-4">
          <p className="text-right font-mono text-[9px] uppercase tracking-[0.18em] text-white/28">Enterprise / systems of record</p>
          {ENTERPRISE_SYSTEMS.map((system, index) => (
            <motion.div
              key={system}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: index * 0.05, ease }}
            >
              <PulseLine delay={index * 0.18} />
              <TechnicalLabel>{system}</TechnicalLabel>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center md:hidden">
        <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">Models</p>
        <div className="flex flex-wrap justify-center gap-2">
          {MODELS.map((model) => <TechnicalLabel key={model}>{model}</TechnicalLabel>)}
        </div>
        <PulseLine vertical />
        <div className="flex h-28 w-28 items-center justify-center border border-emerald-300/40">
          <span className="text-xl font-semibold tracking-tight">PIXEL</span>
        </div>
        <PulseLine vertical />
        <div className="flex flex-wrap justify-center gap-2">
          {ENTERPRISE_SYSTEMS.map((system) => <TechnicalLabel key={system}>{system}</TechnicalLabel>)}
        </div>
        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">Enterprise</p>
      </div>
    </div>
  )
}

const FRAGMENT_LAYOUT = [
  { left: 7, top: 9, rotate: -2.5 },
  { left: 39, top: 26, rotate: 1.5 },
  { left: 68, top: 6, rotate: -1 },
  { left: 88, top: 41, rotate: 2.5 },
  { left: 14, top: 52, rotate: 1 },
  { left: 47, top: 74, rotate: -2 },
  { left: 76, top: 63, rotate: 1.5 },
]

export function FragmentedEnterprise() {
  const reduceMotion = useReducedMotion()

  return (
    <div aria-describedby="fragmented-enterprise-description">
      <p id="fragmented-enterprise-description" className="sr-only">
        Enterprise systems such as GitHub, CRM, ERP, meetings, documents, databases and people sit as disconnected
        islands. Each AI model reaches only a fragment, and none of them share a representation of the organization.
      </p>

      <div className="hidden md:block">
        <div className="flex items-start justify-between border-b border-white/10 pb-5">
          {MODELS.map((model) => (
            <span key={model} className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
              {model}
            </span>
          ))}
        </div>

        <div className="relative h-[440px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="fragment-sightline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.38)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            {MODELS.map((model, index) => {
              const x = 4 + index * 23
              return (
                <motion.line
                  key={model}
                  x1={x}
                  y1="0"
                  x2={x + (index % 2 ? 4 : -3)}
                  y2={26 + index * 5}
                  stroke="url(#fragment-sightline)"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                  vectorEffect="non-scaling-stroke"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease }}
                />
              )
            })}
          </svg>

          {FRAGMENTED_SYSTEMS.map((system, index) => {
            const fragment = FRAGMENT_LAYOUT[index]
            return (
              <motion.div
                key={system}
                className="absolute"
                style={{ left: `${fragment.left}%`, top: `${fragment.top}%`, rotate: `${fragment.rotate}deg` }}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: index * 0.07, ease }}
              >
                <motion.div
                  animate={reduceMotion ? undefined : { y: [0, index % 2 ? -6 : 6, 0] }}
                  transition={
                    reduceMotion ? undefined : { duration: 7 + index * 0.7, repeat: Infinity, ease: 'easeInOut' }
                  }
                >
                  <span className="mb-2 block h-3 w-px bg-white/25" aria-hidden />
                  <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-white/78">
                    {system}
                  </span>
                  <span className="mt-2 block w-16 border-b border-dashed border-white/22" aria-hidden />
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex flex-wrap gap-x-4 gap-y-2 border-b border-white/10 pb-5">
          {MODELS.map((model) => (
            <span key={model} className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
              {model}
            </span>
          ))}
        </div>
        <div className="space-y-7 pt-9">
          {FRAGMENTED_SYSTEMS.map((system, index) => (
            <div key={system} style={{ marginLeft: `${(index % 3) * 22}%` }}>
              <span className="mb-2 block h-3 w-px bg-white/25" aria-hidden />
              <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-white/78">{system}</span>
              <span className="mt-2 block w-12 border-b border-dashed border-white/22" aria-hidden />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AdaptiveRuntime() {
  return (
    <div className="mx-auto max-w-[1040px]" role="img" aria-label="Models connect to enterprise systems through Adaptive, which provides context, memory, identity, permissions, policies, skills and observability.">
      <div className="hidden md:block">
        <div className="flex justify-center gap-2">
          {MODELS.map((model) => <TechnicalLabel key={model}>{model}</TechnicalLabel>)}
        </div>
        <div className="mx-auto flex w-px justify-center"><PulseLine vertical /></div>
        <motion.div
          className="relative overflow-hidden border-y border-emerald-300/25 py-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease }}
        >
          <span className="pointer-events-none absolute -right-5 top-1/2 -translate-y-1/2 text-[clamp(8rem,19vw,17rem)] font-semibold leading-none tracking-[-0.08em] text-white/[0.018]" aria-hidden>
            A
          </span>
          <div className="relative mb-14 flex items-end justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-300/65">Enterprise Intelligence Layer</p>
              <p className="mt-3 text-5xl font-semibold tracking-[-0.055em] lg:text-7xl">ADAPTIVE</p>
            </div>
            <span className="font-mono text-[9px] text-white/25">STATE / LIVE</span>
          </div>
          <div className="relative grid grid-cols-4 gap-x-8 gap-y-10">
            {ADAPTIVE_CAPABILITIES.map((capability, index) => (
              <motion.div
                key={capability}
                className="border-t border-white/12 pt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-white/58"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <span className="mb-8 block h-1 w-1 bg-emerald-300/60" aria-hidden />
                {capability}
              </motion.div>
            ))}
          </div>
        </motion.div>
        <div className="mx-auto flex w-px justify-center"><PulseLine vertical delay={0.6} /></div>
        <div className="flex flex-wrap justify-center gap-2">
          {[...ENTERPRISE_SYSTEMS, 'Internal APIs'].map((system) => <TechnicalLabel key={system}>{system}</TechnicalLabel>)}
        </div>
      </div>

      <div className="flex flex-col items-center md:hidden">
        <div className="flex flex-wrap justify-center gap-2">
          {MODELS.map((model) => <TechnicalLabel key={model}>{model}</TechnicalLabel>)}
        </div>
        <PulseLine vertical />
        <div className="w-full border-y border-emerald-300/30 py-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-300/65">Enterprise Intelligence Layer</p>
          <p className="my-8 text-5xl font-semibold tracking-[-0.055em]">ADAPTIVE</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {ADAPTIVE_CAPABILITIES.map((cap) => (
              <div key={cap} className="border-t border-white/12 pt-3 font-mono text-[9px] uppercase text-white/55">{cap}</div>
            ))}
          </div>
        </div>
        <PulseLine vertical />
        <div className="flex flex-wrap justify-center gap-2">
          {[...ENTERPRISE_SYSTEMS, 'Internal APIs'].map((system) => <TechnicalLabel key={system}>{system}</TechnicalLabel>)}
        </div>
      </div>
    </div>
  )
}

const graphPositions = [
  [12, 17], [37, 9], [65, 16], [84, 34], [72, 57],
  [89, 78], [55, 87], [30, 76], [10, 60], [38, 45],
]

export function EnterpriseContextGraph() {
  const [active, setActive] = useState(9)
  return (
    <div className="border-y border-black/10 py-8 md:py-12" aria-describedby="enterprise-graph-description">
      <p id="enterprise-graph-description" className="sr-only">
        Enterprise context graph connecting people, projects, customers, meetings, tasks, decisions, policies, permissions, systems and goals into a continuously evolving enterprise state.
      </p>
      <div className="relative hidden h-[520px] md:block">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {graphPositions.map((position, index) => {
            const next = graphPositions[(index + 3) % graphPositions.length]
            return (
              <motion.line
                key={index}
                x1={position[0]} y1={position[1]} x2={next[0]} y2={next[1]}
                vectorEffect="non-scaling-stroke"
                stroke={active === index || active === (index + 3) % graphPositions.length ? 'rgba(4,120,87,.55)' : 'rgba(0,0,0,.12)'}
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: index * 0.05, ease }}
              />
            )
          })}
        </svg>
        {CONTEXT_NODES.map((node, index) => (
          <button
            key={node}
            type="button"
            className={[
              'absolute z-10 -translate-x-1/2 -translate-y-1/2 text-left transition-[color,transform] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-emerald-700',
              active === index ? 'scale-110 text-emerald-900' : 'text-neutral-500 hover:text-neutral-900',
            ].join(' ')}
            style={{ left: `${graphPositions[index][0]}%`, top: `${graphPositions[index][1]}%` }}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            aria-pressed={active === index}
          >
            <span className={`mb-2 block h-1.5 w-1.5 ${active === index ? 'bg-emerald-700' : 'bg-neutral-300'}`} aria-hidden />
            <span className="block font-mono text-[9px] font-medium uppercase tracking-[0.14em]">{node}</span>
          </button>
        ))}
        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 bg-[#f4f4f1] px-8 py-8 text-center">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-800">Continuously evolving</span>
          <strong className="mt-3 block text-3xl tracking-[-0.05em]">ENTERPRISE<br />STATE</strong>
        </div>
      </div>
      <div className="md:hidden">
        <ol className="relative space-y-0">
          {CONTEXT_PATH.map((node, index) => (
            <li key={node} className="flex flex-col items-center">
              <TechnicalLabel active={index === CONTEXT_PATH.length - 1} dark={false}>{node}</TechnicalLabel>
              {index < CONTEXT_PATH.length - 1 && <span className="h-7 w-px bg-black/15" aria-hidden />}
            </li>
          ))}
        </ol>
        <div className="mt-12 border-y border-emerald-800/25 py-7 text-center">
          <strong className="text-lg">ENTERPRISE STATE</strong>
          <p className="mt-2 text-sm text-neutral-500">Every relationship remains connected.</p>
        </div>
      </div>
    </div>
  )
}

export function RagComparison() {
  return (
    <div className="grid border-y border-black/10 md:grid-cols-2">
      <div className="border-b border-black/10 p-6 md:border-b-0 md:border-r md:p-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">RAG</p>
        <p className="mt-4 text-xl font-medium">“What documents are relevant?”</p>
        <div className="mt-10 flex items-center gap-3 overflow-hidden">
          {['Documents', 'Search', 'LLM'].map((item, index) => (
            <div key={item} className="contents">
              <TechnicalLabel dark={false}>{item}</TechnicalLabel>
              {index < 2 && <span className="h-px min-w-3 flex-1 bg-black/15" aria-hidden />}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-neutral-950 p-6 text-white md:p-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/70">Enterprise Context</p>
        <p className="mt-4 text-xl font-medium">“What is happening in the company?”</p>
        <div className="mt-8 flex flex-wrap gap-2">
          {['People', 'Projects', 'Customers', 'Decisions', 'Policies', 'Systems', 'History'].map((item) => (
            <TechnicalLabel key={item}>{item}</TechnicalLabel>
          ))}
        </div>
        <div className="my-4 ml-6 h-8 w-px bg-emerald-300/35" aria-hidden />
        <div className="flex items-center gap-3">
          <TechnicalLabel active>Enterprise State</TechnicalLabel>
          <span className="h-px flex-1 bg-emerald-300/30" aria-hidden />
          <TechnicalLabel active>AI</TechnicalLabel>
        </div>
      </div>
    </div>
  )
}

export function ActionConsole() {
  const reduceMotion = useReducedMotion()
  return (
    <div className="grid gap-px bg-white/10 border border-white/10 lg:grid-cols-[1.2fr_.8fr]">
      <div className="bg-[#090909] p-5 md:p-8">
        <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">Command stream / px-runtime-01</p>
          <span className="h-1.5 w-1.5 bg-emerald-300" />
        </div>
        <ol className="space-y-3">
          {ACTION_COMMANDS.map((command, index) => (
            <motion.li
              key={command}
              className="flex gap-4 font-mono text-[11px] md:text-xs"
              initial={{ opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: reduceMotion ? 0 : index * 0.12 }}
            >
              <span className="text-white/20">{String(index + 1).padStart(2, '0')}</span>
              <span className={index > 3 ? 'text-emerald-200/80' : 'text-white/65'}>{command}</span>
            </motion.li>
          ))}
        </ol>
      </div>
      <div className="bg-[#0c110f] p-5 md:p-8">
        <p className="mb-7 font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-300/60">Governance gate</p>
        <ol className="space-y-0">
          {GOVERNANCE_STEPS.map((step, index) => (
            <li key={step} className="grid grid-cols-[24px_1fr_auto] items-center gap-3">
              <span className="font-mono text-[8px] text-white/20">0{index + 1}</span>
              <div className="border-l border-white/12 py-3 pl-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">{step}</div>
              <span className={step === 'Action' ? 'text-emerald-300' : 'text-white/40'}>{step === 'Action' ? '→' : '✓'}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export function CadenceTask() {
  return (
    <div className="border border-black/12 bg-[#f5f5f2] shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 bg-teal-600" />
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500">TASK / CAD-184</span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-teal-700">In progress</span>
      </div>
      <div className="grid lg:grid-cols-[1fr_300px]">
        <div className="border-b border-black/10 p-6 md:p-9 lg:border-b-0 lg:border-r">
          <p className="text-2xl font-semibold tracking-[-0.035em] md:text-3xl">Implement subscription cancellation flow</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {CADENCE_CONTEXT.map((item) => <TechnicalLabel key={item} dark={false}>{item}</TechnicalLabel>)}
          </div>
          <ol className="mt-10 grid gap-0 md:grid-cols-7">
            {CADENCE_FLOW.map((step, index) => (
              <li key={step} className="relative border-l border-black/15 py-3 pl-4 md:border-l-0 md:border-t md:pb-0 md:pl-0 md:pr-3 md:pt-4">
                <span className="absolute -left-[3px] top-5 h-[5px] w-[5px] bg-teal-700 md:-top-[3px] md:left-0" aria-hidden />
                <span className="block font-mono text-[8px] text-neutral-400">0{index + 1}</span>
                <span className="mt-1 block text-[11px] leading-snug text-neutral-600">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="p-6 md:p-9">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">Assigned</p>
          <div className="mt-6 space-y-5">
            {[
              ['MA', 'Marina', 'Product Manager', 'human'],
              ['CA', 'Coding Agent', 'Implementation', 'agent'],
              ['QA', 'QA Agent', 'Validation', 'agent'],
            ].map(([initials, name, role, type]) => (
              <div key={name} className="grid grid-cols-[36px_1fr] items-center gap-3">
                <span className={type === 'human' ? 'flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 font-mono text-[9px] text-white' : 'flex h-9 w-9 items-center justify-center border border-teal-700/30 bg-teal-50 font-mono text-[9px] text-teal-800'}>
                  {initials}
                </span>
                <div>
                  <p className="text-sm font-medium">{name}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-neutral-400">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductArchitecture() {
  const products = [
    ['PIXEL', 'AI Operating System for the Enterprise'],
    ['ADAPTIVE', 'Enterprise Intelligence Layer'],
    ['CADENCE', 'Human + Agent Operating Environment'],
  ]
  return (
    <div className="mx-auto max-w-3xl">
      {products.map(([name, description], index) => (
        <div key={name} className="flex flex-col items-center">
          <div className="w-full border-t border-white/12 py-8 text-center">
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">Layer / 0{index + 1}</span>
            <strong className={`mt-3 block tracking-[-0.055em] ${index === 0 ? 'text-5xl text-emerald-200 md:text-7xl' : 'text-3xl md:text-5xl'}`}>{name}</strong>
            <span className="mt-2 block text-sm text-white/38">{description}</span>
          </div>
          {index < products.length - 1 && <span className="h-12 w-px bg-white/12" aria-hidden />}
        </div>
      ))}
      <div className="mt-16 grid border-t border-white/10 sm:grid-cols-3">
        {['Your Applications', 'Custom Agents', 'Future Pixel Products'].map((item) => (
          <div key={item} className="py-5 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-white/30">{item}</div>
        ))}
      </div>
    </div>
  )
}

export function ModelSwitcher() {
  const reduceMotion = useReducedMotion()
  const [currentModel, setCurrentModel] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const interval = window.setInterval(() => {
      setCurrentModel((current) => (current + 1) % MODELS.length)
    }, 2600)
    return () => window.clearInterval(interval)
  }, [reduceMotion])

  return (
    <div className="grid items-stretch border-y border-black/10 md:grid-cols-[.8fr_1px_1.2fr]">
      <div className="relative flex min-h-64 items-center justify-center overflow-hidden py-14">
        <p className="absolute left-4 top-4 font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-400">Replaceable model</p>
        <div className="flex items-center justify-center">
          <motion.span
            key={MODELS[currentModel]}
            className="text-[clamp(2.5rem,5vw,5rem)] font-semibold tracking-[-0.055em]"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease }}
          >
            {MODELS[currentModel]}
          </motion.span>
        </div>
      </div>
      <span className="hidden bg-black/10 md:block" aria-hidden />
      <span className="mx-auto block h-12 w-px bg-black/10 md:hidden" aria-hidden />
      <div className="relative flex min-h-64 items-center justify-center overflow-hidden bg-emerald-950 py-14 text-white">
        <span className="pointer-events-none absolute text-[13rem] font-semibold text-white/[0.025]" aria-hidden>∞</span>
        <div className="text-center">
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-emerald-300/60">Persistent asset</span>
          <strong className="mt-4 block text-[clamp(2rem,4vw,4rem)] leading-[0.92] tracking-[-0.055em]">ENTERPRISE<br />CONTEXT</strong>
        </div>
      </div>
    </div>
  )
}

export function ContextFlywheel() {
  const reduceMotion = useReducedMotion()
  return (
    <div className="relative mx-auto max-w-[760px] py-4" role="img" aria-label="A continuous loop where enterprise context enables humans and agents to act, creating outcomes, decisions and memory that enrich context.">
      <div className="relative hidden aspect-square md:block">
        <motion.div
          className="absolute inset-[9%] rounded-full border border-dashed border-white/18"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={reduceMotion ? undefined : { duration: 50, repeat: Infinity, ease: 'linear' }}
        />
        {FLYWHEEL.map((item, index) => {
          const angle = (index / FLYWHEEL.length) * Math.PI * 2 - Math.PI / 2
          const left = 50 + Math.cos(angle) * 41
          const top = 50 + Math.sin(angle) * 41
          return (
            <div key={item} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${left}%`, top: `${top}%` }}>
              <span className={`font-mono text-[9px] uppercase tracking-[0.14em] ${item === 'Context' ? 'text-emerald-200' : 'text-white/45'}`}>
                <span className={`mr-2 inline-block h-1 w-1 align-middle ${item === 'Context' ? 'bg-emerald-300' : 'bg-white/25'}`} aria-hidden />
                {item}
              </span>
            </div>
          )
        })}
        <div className="absolute inset-[35%] flex items-center justify-center rounded-full border border-emerald-300/22 text-center">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/55">Compounding<br />enterprise memory</span>
        </div>
      </div>
      <ol className="flex flex-col items-center md:hidden">
        {FLYWHEEL.map((item, index) => (
          <li key={item} className="flex flex-col items-center">
            <TechnicalLabel active={item === 'Context'}>{item}</TechnicalLabel>
            {index < FLYWHEEL.length - 1 && <span className="h-7 w-px bg-white/15" aria-hidden />}
          </li>
        ))}
        <span className="mt-5 font-mono text-[9px] uppercase tracking-[0.15em] text-emerald-300/60">↻ Back to context</span>
      </ol>
    </div>
  )
}
