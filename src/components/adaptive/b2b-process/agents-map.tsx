'use client'

import { useState } from 'react'
import {
  Workflow, TrendingUp, Boxes, CreditCard, Truck, HeartHandshake,
  Bot, ArrowRight, Sparkles, type LucideIcon,
} from 'lucide-react'
import { STAGES } from '@/lib/adaptive/b2b-process/types'
import {
  OTD_AGENTS, OTD_AI_OPPORTUNITIES, AGENT_LOOP, AGENT_WALKTHROUGH,
  agentById, stageLabel, type AgentIconKey,
} from '@/lib/adaptive/b2b-process/agents'

const AGENT_ICONS: Record<AgentIconKey, LucideIcon> = {
  orchestrator: Workflow,
  commercial: TrendingUp,
  order: Boxes,
  finance: CreditCard,
  logistics: Truck,
  repurchase: HeartHandshake,
}

/* ── Mapa de atuação: agentes × etapas ──────────────────────────────────── */

export function AgentsCoverageMap() {
  const [hover, setHover] = useState<{ agentId: string; stageId: string } | null>(null)
  const hovered = hover ? agentById(hover.agentId) : undefined
  const hoveredAction = hovered && hover ? hovered.actions[hover.stageId] : undefined

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-7">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse">
          <thead>
            <tr>
              <th className="text-left align-bottom pb-3 pr-4 w-[240px]">
                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">
                  Agente / etapa
                </span>
              </th>
              {STAGES.map(s => (
                <th key={s.id} className="pb-3 px-1 align-bottom">
                  <div className="flex flex-col items-center gap-1">
                    <span className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center text-[10px] font-semibold">
                      {s.number}
                    </span>
                    <span className="text-[9px] text-neutral-400 leading-tight text-center max-w-[68px]">
                      {s.title}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {OTD_AGENTS.map(agent => {
              const Icon = AGENT_ICONS[agent.icon]
              return (
                <tr key={agent.id} className="border-t border-black/[0.05]">
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-white" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-neutral-900 leading-tight">{agent.name}</p>
                        <p className="text-[10px] text-neutral-400 truncate">{agent.owner}</p>
                      </div>
                    </div>
                  </td>
                  {STAGES.map(s => {
                    const primary = agent.primaryStages.includes(s.id)
                    const support = agent.supportStages?.includes(s.id)
                    const active = hover?.agentId === agent.id && hover?.stageId === s.id
                    return (
                      <td key={s.id} className="py-2.5 px-1 text-center">
                        {primary || support ? (
                          <button
                            type="button"
                            onMouseEnter={() => setHover({ agentId: agent.id, stageId: s.id })}
                            onMouseLeave={() => setHover(null)}
                            onFocus={() => setHover({ agentId: agent.id, stageId: s.id })}
                            onBlur={() => setHover(null)}
                            aria-label={`${agent.name} — ${stageLabel(s.id)}`}
                            className={`w-full flex items-center justify-center transition-transform ${
                              active ? 'scale-125' : ''
                            }`}
                          >
                            <span
                              className={`block rounded-full ${
                                primary
                                  ? 'w-3.5 h-3.5 bg-emerald-500 ring-2 ring-emerald-100'
                                  : 'w-2.5 h-2.5 bg-sky-300'
                              }`}
                            />
                          </button>
                        ) : (
                          <span className="block w-1 h-1 rounded-full bg-neutral-200 mx-auto" />
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-neutral-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" /> dono da exceção
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-300" /> apoia
        </span>
        <span className="text-neutral-400">passe o cursor num ponto para ver a ação</span>
      </div>

      <div className="mt-4 min-h-[52px] rounded-xl border border-black/[0.06] bg-[#fafaf8] px-4 py-3">
        {hoveredAction && hovered && hover ? (
          <>
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
              {hovered.name} · {stageLabel(hover.stageId)}
            </p>
            <p className="text-[13px] text-neutral-800 mt-1">{hoveredAction}</p>
          </>
        ) : (
          <p className="text-[12px] text-neutral-400">
            Cada agente é dono das exceções de suas etapas e apoia as vizinhas — sem back-office no meio.
          </p>
        )}
      </div>
    </div>
  )
}

/* ── Handoffs: um pedido atravessando os agentes ────────────────────────── */

export function AgentHandoffFlow() {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-7">
      <div className="mb-5">
        <p className="text-[14px] font-semibold text-neutral-900">{AGENT_WALKTHROUGH.title}</p>
        <p className="text-[12px] text-neutral-500 mt-0.5">{AGENT_WALKTHROUGH.subtitle}</p>
      </div>

      <div className="flex flex-col gap-2">
        {AGENT_WALKTHROUGH.steps.map((step, i) => {
          const agent = agentById(step.agentId)
          const Icon = agent ? AGENT_ICONS[agent.icon] : Bot
          return (
            <div key={`${step.stageId}-${step.agentId}`} className="flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-black/[0.06] bg-[#fafaf8] px-4 py-3">
                <div className="flex items-center gap-2.5 sm:w-[230px] flex-shrink-0">
                  <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-white" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-neutral-900 leading-tight">{agent?.name}</p>
                    <p className="text-[10px] text-neutral-400">{stageLabel(step.stageId)}</p>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] text-rose-700/80">{step.event}</p>
                  <p className="text-[13px] text-neutral-800 mt-0.5">{step.action}</p>
                </div>
              </div>
              {i < AGENT_WALKTHROUGH.steps.length - 1 && (
                <div className="flex items-center gap-1.5 pl-6 py-1 text-[10px] uppercase tracking-wider text-neutral-400">
                  <ArrowRight className="w-3 h-3" strokeWidth={2} />
                  handoff
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Ciclo de atuação do agente ─────────────────────────────────────────── */

export function AgentLoopDiagram() {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-7">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {AGENT_LOOP.map((step, i) => (
          <div key={step.id} className="relative rounded-xl border border-black/[0.06] bg-[#fafaf8] p-4">
            <span className="text-[10px] font-mono text-neutral-400">0{i + 1}</span>
            <p className="text-[13px] font-semibold text-neutral-900 mt-1">{step.title}</p>
            <p className="text-[11px] text-neutral-500 leading-relaxed mt-1.5">{step.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-2xl bg-neutral-900 text-white px-5 py-4 flex flex-wrap items-center justify-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
          <span className="text-[13px] font-semibold">LLM + Adaptive Layer™</span>
        </div>
        <span className="hidden sm:block text-white/20">·</span>
        <span className="text-[12px] text-white/50">
          os agentes só existem porque a camada entrega o evento do pedido em tempo real
        </span>
      </div>
    </div>
  )
}

/* ── Oportunidades de IA por etapa ──────────────────────────────────────── */

export function AiOpportunitiesByStage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {OTD_AI_OPPORTUNITIES.map(o => (
        <div key={o.id} className="rounded-xl border border-black/[0.06] bg-white p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">{o.area}</p>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" strokeWidth={1.75} />
          </div>
          <p className="text-[13px] font-medium text-neutral-900 leading-snug">{o.opportunity}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {o.stageIds.length === STAGES.length ? (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                jornada completa
              </span>
            ) : (
              o.stageIds.map(id => (
                <span key={id} className="text-[10px] font-medium px-2 py-0.5 rounded bg-sky-50 text-sky-800">
                  {stageLabel(id)}
                </span>
              ))
            )}
          </div>
          {o.enabledBy && (
            <p className="text-[10px] text-emerald-700 mt-2 font-mono">
              habilitado por {o.enabledBy.join(' · ')}
            </p>
          )}
          <p className="text-[11px] text-neutral-400 mt-2">{o.stakeholder}</p>
        </div>
      ))}
    </div>
  )
}

/* ── Cards do squad ─────────────────────────────────────────────────────── */

export function AgentSquadCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {OTD_AGENTS.map(agent => {
        const Icon = AGENT_ICONS[agent.icon]
        return (
          <div key={agent.id} className="rounded-xl border border-black/[0.06] bg-white p-4 flex flex-col">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-white" strokeWidth={1.75} />
              </div>
              <p className="text-[13px] font-semibold text-neutral-900 leading-tight">{agent.name}</p>
            </div>
            <p className="text-[12px] text-neutral-500 leading-relaxed">{agent.role}</p>
            <p className="text-[11px] text-neutral-600 italic mt-2 leading-snug">{agent.example}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {agent.primaryStages.map(id => (
                <span key={id} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800">
                  {stageLabel(id)}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-neutral-400 mt-auto pt-2.5 uppercase tracking-wider">{agent.owner}</p>
          </div>
        )
      })}
    </div>
  )
}
