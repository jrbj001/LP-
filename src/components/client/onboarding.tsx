'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  {
    number: '01',
    title: 'Kickoff & Contrato',
    description: 'Assinatura do acordo, definição de escopo, SLAs e canal de comunicação dedicado no Slack.',
    tools: ['Slack', 'Jira', 'DocuSign'],
    color: '#6366f1',
  },
  {
    number: '02',
    title: 'Setup do Workspace',
    description: 'Acesso ao repositório GitHub, board Jira configurado, ambiente de staging provisionado.',
    tools: ['GitHub', 'Jira', 'Vercel'],
    color: '#8b5cf6',
  },
  {
    number: '03',
    title: 'Primeira Entrega',
    description: 'Milestone inicial em produção. Demo ao vivo, walkthrough técnico e sessão de Q&A.',
    tools: ['Vercel', 'Loom', 'Gather'],
    color: '#a78bfa',
  },
  {
    number: '04',
    title: 'Ciclo de Revisão',
    description: 'Sprint reviews quinzenais, feedback assíncrono via Loom, ajustes e refinamentos contínuos.',
    tools: ['Loom', 'Jira', 'Slack'],
    color: '#c4b5fd',
  },
  {
    number: '05',
    title: 'Go-Live',
    description: 'Deploy em produção com monitoramento ativo, runbook de incidentes e handoff de documentação.',
    tools: ['Vercel', 'Upstash', 'GitHub'],
    color: '#ddd6fe',
  },
]

export function Onboarding() {
  const [active, setActive] = useState(0)

  return (
    <section className="py-24 border-b border-white/[0.06]">
      <div className="mx-auto max-w-[1200px] px-6">

        <div className="mb-16">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">
            Client Onboarding
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] max-w-xl">
            Do contrato ao{' '}
            <span className="text-text-secondary">go-live em 5 etapas</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">

          {/* Step list */}
          <div className="flex flex-col gap-2">
            {STEPS.map((step, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`group text-left px-5 py-4 rounded-xl border transition-all duration-300 ${
                  active === i
                    ? 'border-white/[0.15] bg-white/[0.05]'
                    : 'border-transparent hover:border-white/[0.08] hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="font-mono text-xs font-bold tracking-widest transition-colors"
                    style={{ color: active === i ? step.color : 'rgba(255,255,255,0.2)' }}
                  >
                    {step.number}
                  </span>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      active === i ? 'text-white' : 'text-white/40 group-hover:text-white/60'
                    }`}
                  >
                    {step.title}
                  </span>

                  {/* Active indicator */}
                  {active === i && (
                    <motion.div
                      layoutId="step-dot"
                      className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: step.color }}
                    />
                  )}
                </div>

                {/* Progress bar */}
                {active === i && (
                  <motion.div
                    className="mt-3 h-px w-full origin-left"
                    style={{ backgroundColor: step.color }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Step detail panel */}
          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden min-h-[320px] flex flex-col justify-between p-8">

            {/* Background glow */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none transition-colors duration-700"
              style={{ backgroundColor: STEPS[active].color }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="relative z-10 flex flex-col gap-6 h-full"
              >
                <div>
                  <span
                    className="font-mono text-4xl font-black tracking-tighter"
                    style={{ color: STEPS[active].color, opacity: 0.3 }}
                  >
                    {STEPS[active].number}
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-white mt-2">
                    {STEPS[active].title}
                  </h3>
                  <p className="mt-3 text-white/50 leading-relaxed text-sm max-w-lg">
                    {STEPS[active].description}
                  </p>
                </div>

                {/* Tools */}
                <div className="flex flex-wrap gap-2">
                  {STEPS[active].tools.map(tool => (
                    <span
                      key={tool}
                      className="px-3 py-1 text-xs font-mono tracking-wider rounded-full border border-white/[0.1] text-white/40"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                {/* Step counter */}
                <div className="flex gap-1.5 mt-auto">
                  {STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className="h-1 rounded-full transition-all duration-300"
                      style={{
                        width: active === i ? 24 : 6,
                        backgroundColor: active === i ? STEPS[active].color : 'rgba(255,255,255,0.15)',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}
