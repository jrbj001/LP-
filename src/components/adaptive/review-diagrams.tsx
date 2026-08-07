'use client'

import { ADAPTIVE_LAYER } from '@/components/adaptive/executive-review-data'
import { OTD_AGENTS, type AgentIconKey } from '@/lib/adaptive/b2b-process/agents'
import {
  Database, Boxes, ShoppingBag, MessageCircle, FlaskConical, Radio, CreditCard,
  ArrowDown, Layers, ShieldCheck, Workflow, Cable, Braces,
  Bot, TrendingUp, HeartHandshake, Gauge, Coffee, Truck,
  Sparkles, Send, CheckCircle2, Circle, type LucideIcon,
} from 'lucide-react'

/* ────────────────────────────────────────────────────────────────────────────
   Arquitetura — sistemas → Adaptive Layer™ → o que destrava
──────────────────────────────────────────────────────────────────────────── */

const SYSTEM_ICONS = [Database, Boxes, ShoppingBag, MessageCircle, FlaskConical, Radio, CreditCard]

const LAYER_CAPABILITIES = [
  { icon: Cable, label: 'Integração & eventos' },
  { icon: Braces, label: 'Dados unificados' },
  { icon: Workflow, label: 'APIs & automação' },
  { icon: ShieldCheck, label: 'Segurança & LGPD' },
]

export function ArchitectureDiagram() {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-6 sm:p-8">
      {/* Sistemas existentes */}
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400 text-center mb-4">
        O que a Orfeu já tem — nada é substituído
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-2">
        {ADAPTIVE_LAYER.connects.map((system, i) => {
          const Icon = SYSTEM_ICONS[i % SYSTEM_ICONS.length]
          return (
            <div
              key={system}
              className="flex items-center gap-2 rounded-xl border border-black/[0.07] bg-[#fafaf8] px-3.5 py-2.5"
            >
              <Icon className="w-3.5 h-3.5 text-neutral-500" strokeWidth={1.75} />
              <span className="text-[12px] font-medium text-neutral-700">{system}</span>
            </div>
          )
        })}
      </div>

      <FlowConnector label="conectores dedicados · sem redigitação" />

      {/* A camada */}
      <div className="rounded-2xl bg-neutral-900 text-white p-6 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
          <p className="text-[15px] font-semibold tracking-tight">Adaptive Layer™</p>
          <span className="text-[11px] text-white/40">a entrega-mãe</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LAYER_CAPABILITIES.map(cap => (
            <div key={cap.label} className="rounded-xl bg-white/[0.07] border border-white/[0.08] px-3 py-3 flex flex-col items-center gap-1.5 text-center">
              <cap.icon className="w-4 h-4 text-white/60" strokeWidth={1.75} />
              <span className="text-[11px] text-white/80 leading-tight">{cap.label}</span>
            </div>
          ))}
        </div>
      </div>

      <FlowConnector label="cada integração amplia a próxima entrega" />

      {/* O que destrava */}
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-700/70 text-center mb-4">
        O que a camada destrava
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {ADAPTIVE_LAYER.unlocks.map(unlock => (
          <div
            key={unlock}
            className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-3"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
            <span className="text-[12px] text-emerald-900/90 leading-snug">{unlock}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FlowConnector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-3">
      <ArrowDown className="w-4 h-4 text-neutral-300" strokeWidth={2} />
      <span className="text-[10px] text-neutral-400 uppercase tracking-[0.14em]">{label}</span>
      <ArrowDown className="w-4 h-4 text-neutral-300" strokeWidth={2} />
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Agentes — squad de agentes IA sobre a camada
──────────────────────────────────────────────────────────────────────────── */

const AGENT_ICONS: Record<AgentIconKey, LucideIcon> = {
  orchestrator: Workflow,
  commercial: TrendingUp,
  order: Boxes,
  finance: CreditCard,
  logistics: Truck,
  repurchase: HeartHandshake,
}

const AGENTS = OTD_AGENTS.map(agent => ({
  icon: AGENT_ICONS[agent.icon],
  name: agent.name,
  role: agent.role,
  owner: agent.owner,
  example: agent.example,
}))

export function AgentsDiagram() {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-6 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
        {AGENTS.map(agent => (
          <div key={agent.name} className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-4 flex flex-col">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                <agent.icon className="w-4 h-4 text-white" strokeWidth={1.75} />
              </div>
              <p className="text-[13px] font-semibold text-neutral-900 leading-tight">{agent.name}</p>
            </div>
            <p className="text-[12px] text-neutral-500 leading-relaxed">{agent.role}</p>
            <p className="text-[11px] text-neutral-600 italic mt-2 leading-snug">{agent.example}</p>
            <p className="text-[10px] text-neutral-400 mt-auto pt-2.5 uppercase tracking-wider">{agent.owner}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-1 py-3">
        <ArrowDown className="w-4 h-4 text-neutral-300" strokeWidth={2} />
        <span className="text-[10px] text-neutral-400 uppercase tracking-[0.14em]">todos operam a mesma jornada</span>
      </div>

      <div className="rounded-2xl bg-neutral-900 text-white px-6 py-5 flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
          <span className="text-[13px] font-semibold">LLM + Adaptive Layer™</span>
        </div>
        <span className="hidden sm:block text-white/20">·</span>
        <span className="text-[12px] text-white/50">pedido, crédito, faturamento, logística e recompra — uma jornada, uma única verdade</span>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Produto — mock do portal em tempo real
──────────────────────────────────────────────────────────────────────────── */

const MOCK_DELIVERIES = [
  { title: 'QW-02 · Resumo IA dos checklists baristas', status: 'done' as const, meta: 'Em produção · semana 3' },
  { title: 'QW-04 · Integração e-mail → Suri', status: 'done' as const, meta: 'Em produção · semana 4' },
  { title: 'Adaptive Layer™ · conector WMS + Shopify', status: 'progress' as const, meta: 'Em andamento · semana 6' },
  { title: 'Faturamento automático B2B — fase 1', status: 'next' as const, meta: 'Próxima entrega' },
]

export function ProductDiagram() {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-gradient-to-b from-[#f7f4ef] to-white p-6 sm:p-8">
      {/* Janela mock */}
      <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_20px_60px_-24px_rgba(0,0,0,0.25)] overflow-hidden max-w-2xl mx-auto">
        {/* Barra do browser */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-black/[0.05] bg-[#fafaf8]">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
          <span className="ml-3 text-[11px] text-neutral-400 font-mono truncate">portal.pixelpulselab.dev/orfeu</span>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[13px] font-semibold text-neutral-900">Portal Orfeu · tempo real</p>
              <p className="text-[11px] text-neutral-400">Entregas, código commitado e billing por entrega</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-medium text-emerald-700">ao vivo</span>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <MockKpi icon={Gauge} label="Entregas em produção" value="2" />
            <MockKpi icon={Layers} label="Integrações ativas" value="3" />
            <MockKpi icon={Sparkles} label="Horas manuais evitadas/sem" value="26" />
          </div>

          {/* Entregas */}
          <div className="rounded-xl border border-black/[0.05] divide-y divide-black/[0.04] mb-4">
            {MOCK_DELIVERIES.map(d => (
              <div key={d.title} className="flex items-center gap-3 px-3.5 py-2.5">
                {d.status === 'done' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" strokeWidth={2} />}
                {d.status === 'progress' && <Circle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" strokeWidth={2.5} />}
                {d.status === 'next' && <Circle className="w-3.5 h-3.5 text-neutral-300 flex-shrink-0" strokeWidth={2} />}
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-neutral-800 truncate">{d.title}</p>
                  <p className="text-[10px] text-neutral-400">{d.meta}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pergunte aos dados */}
          <div className="flex items-center gap-2 rounded-xl border border-black/[0.07] bg-[#fafaf8] px-3.5 py-2.5">
            <Bot className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" strokeWidth={1.75} />
            <span className="text-[12px] text-neutral-400 flex-1 truncate">Pergunte aos seus dados: “status do faturamento B2B?”</span>
            <Send className="w-3.5 h-3.5 text-neutral-300 flex-shrink-0" strokeWidth={1.75} />
          </div>
        </div>
      </div>

      <p className="text-[12px] text-neutral-500 text-center mt-5 max-w-lg mx-auto leading-relaxed">
        O mesmo portal que a Orfeu usa neste assessment acompanha o projeto: cada entrega aparece
        quando entra em produção — André como observador, comitê quinzenal.
      </p>
    </div>
  )
}

function MockKpi({
  icon: Icon, label, value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-black/[0.05] bg-[#fafaf8] px-3 py-2.5">
      <Icon className="w-3.5 h-3.5 text-neutral-400 mb-1.5" strokeWidth={1.75} />
      <p className="text-[16px] font-semibold text-neutral-900 leading-none">{value}</p>
      <p className="text-[10px] text-neutral-400 mt-1 leading-tight">{label}</p>
    </div>
  )
}
