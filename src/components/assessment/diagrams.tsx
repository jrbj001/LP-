'use client'

import { motion } from 'framer-motion'
import {
  ArrowDown, Layers, CheckCircle2, Cable, Braces, Workflow, ShieldCheck,
  Bot, Eye, ScanSearch, Scale, Zap, Save, Send, AlertTriangle,
  Database, Boxes, ShoppingBag, MessageCircle, CreditCard, Radio, Truck,
  TrendingUp, HeartHandshake, Tag, Megaphone, Gauge,
  type LucideIcon,
} from 'lucide-react'
import type {
  LayerCapability, LayerAgent, AlertGroup, QuickWin, AgentIconKey,
} from '@/lib/assessment/types'

// ─── Ícones ─────────────────────────────────────────────────────────────────
const SYSTEM_ICONS = [Database, Boxes, ShoppingBag, MessageCircle, CreditCard, Radio, Truck]

export const AGENT_ICONS: Record<AgentIconKey, LucideIcon> = {
  orchestrator: Gauge,
  commercial: TrendingUp,
  channel: ShoppingBag,
  inventory: Boxes,
  price: Tag,
  marketing: Megaphone,
  repurchase: HeartHandshake,
  logistics: Truck,
  finance: CreditCard,
}

const CAPABILITY_ICONS: Record<LayerCapability['id'], LucideIcon> = {
  integration: Cable,
  data: Braces,
  apis: Workflow,
  security: ShieldCheck,
}

// ─── Conector de fluxo ───────────────────────────────────────────────────────
function FlowConnector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-3">
      <ArrowDown className="w-4 h-4 text-neutral-300" strokeWidth={2} />
      <span className="text-[10px] text-neutral-400 uppercase tracking-[0.14em] text-center px-4">{label}</span>
      <ArrowDown className="w-4 h-4 text-neutral-300" strokeWidth={2} />
    </div>
  )
}

// ─── 1. Arquitetura: sistemas → Layer → unlocks ──────────────────────────────
export function ArchitectureFlow({
  connects,
  unlocks,
  systemsLabel = 'O que já existe — nada é substituído',
  capabilities,
}: {
  connects: string[]
  unlocks: string[]
  systemsLabel?: string
  capabilities?: LayerCapability[]
}) {
  const caps = capabilities ?? DEFAULT_CAPABILITIES
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-6 sm:p-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400 text-center mb-4">
        {systemsLabel}
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-2">
        {connects.map((system, i) => {
          const Icon = SYSTEM_ICONS[i % SYSTEM_ICONS.length]
          return (
            <div key={system} className="flex items-center gap-2 rounded-xl border border-black/[0.07] bg-[#fafaf8] px-3.5 py-2.5">
              <Icon className="w-3.5 h-3.5 text-neutral-500" strokeWidth={1.75} />
              <span className="text-[12px] font-medium text-neutral-700">{system}</span>
            </div>
          )
        })}
      </div>

      <FlowConnector label="conectores dedicados · sem redigitação" />

      <div className="rounded-2xl bg-neutral-900 text-white p-6 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
          <p className="text-[15px] font-semibold tracking-tight">Adaptive Layer™</p>
          <span className="text-[11px] text-white/40">a entrega-mãe</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {caps.map(cap => {
            const Icon = CAPABILITY_ICONS[cap.id]
            return (
              <div key={cap.id} className="rounded-xl bg-white/[0.07] border border-white/[0.08] px-3 py-3 flex flex-col items-center gap-1.5 text-center">
                <Icon className="w-4 h-4 text-white/60" strokeWidth={1.75} />
                <span className="text-[11px] text-white/80 leading-tight">{cap.title}</span>
              </div>
            )
          })}
        </div>
      </div>

      <FlowConnector label="cada integração amplia a próxima entrega" />

      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-700/70 text-center mb-4">
        O que a camada destrava
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {unlocks.map(unlock => (
          <div key={unlock} className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
            <span className="text-[12px] text-emerald-900/90 leading-snug">{unlock}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const DEFAULT_CAPABILITIES: LayerCapability[] = [
  { id: 'integration', title: 'Integração & eventos', detail: '' },
  { id: 'data', title: 'Dados unificados', detail: '' },
  { id: 'apis', title: 'APIs & automação', detail: '' },
  { id: 'security', title: 'Segurança & LGPD', detail: '' },
]

// ─── 2. Ciclo do agente: Observa → Detecta → Decide → Age → Registra ──────────
const LOOP_ICONS = [Eye, ScanSearch, Scale, Zap, Save]

export interface LoopStep {
  title: string
  detail: string
}

export const DEFAULT_AGENT_LOOP: LoopStep[] = [
  { title: 'Observa',  detail: 'Eventos chegam pela Adaptive Layer™ — pedido, venda, estoque, pagamento, mídia.' },
  { title: 'Detecta',  detail: 'Compara com o padrão esperado e identifica o desvio.' },
  { title: 'Decide',   detail: 'Avalia impacto em receita, margem e SLA e escolhe a próxima melhor ação.' },
  { title: 'Age',      detail: 'Executa ou aciona o responsável — com contexto, não com "veja o relatório".' },
  { title: 'Registra', detail: 'Devolve o resultado à camada: histórico auditável que treina a próxima decisão.' },
]

export function AgentLoop({ steps = DEFAULT_AGENT_LOOP }: { steps?: LoopStep[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
      {steps.map((step, i) => {
        const Icon = LOOP_ICONS[i % LOOP_ICONS.length]
        return (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="relative rounded-xl border border-black/[0.06] bg-white p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
                <Icon className="w-4 h-4 text-white" strokeWidth={1.75} />
              </div>
              <span className="text-[11px] font-mono text-neutral-300">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <p className="text-[13px] font-semibold text-neutral-900">{step.title}</p>
            <p className="text-[11px] text-neutral-500 leading-relaxed mt-1">{step.detail}</p>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── 3. Mapa do squad de agentes ─────────────────────────────────────────────
export function AgentSquadMap({ agents }: { agents: LayerAgent[] }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-6 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
        {agents.map(agent => {
          const Icon = AGENT_ICONS[agent.icon]
          return (
            <div key={agent.id} className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-4 flex flex-col">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white" strokeWidth={1.75} />
                </div>
                <p className="text-[13px] font-semibold text-neutral-900 leading-tight">{agent.name}</p>
              </div>
              <p className="text-[12px] text-neutral-500 leading-relaxed">{agent.role}</p>
              <p className="text-[11px] text-neutral-600 italic mt-2 leading-snug">{agent.example}</p>
              <p className="text-[10px] text-neutral-400 mt-auto pt-2.5 uppercase tracking-wider">{agent.owner}</p>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col items-center gap-1 py-3">
        <ArrowDown className="w-4 h-4 text-neutral-300" strokeWidth={2} />
        <span className="text-[10px] text-neutral-400 uppercase tracking-[0.14em]">todos operam a mesma verdade</span>
      </div>

      <div className="rounded-2xl bg-neutral-900 text-white px-6 py-5 flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
          <span className="text-[13px] font-semibold">LLM + Adaptive Layer™</span>
        </div>
        <span className="hidden sm:block text-white/20">·</span>
        <span className="text-[12px] text-white/50">uma operação, vários copilotos — sem base paralela</span>
      </div>
    </div>
  )
}

// ─── 4. Fluxo de alerta: desvio → alerta → canal → responsável ────────────────
const ALERT_TONES: Record<AlertGroup['tone'], { dot: string; text: string }> = {
  comercial:   { dot: 'bg-emerald-500', text: 'text-emerald-700' },
  operacional: { dot: 'bg-rose-500',    text: 'text-rose-700' },
  marketing:   { dot: 'bg-amber-500',   text: 'text-amber-700' },
}

export function AlertFlow({ groups, channel }: { groups: AlertGroup[]; channel: string }) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {groups.map(group => {
          const tone = ALERT_TONES[group.tone]
          return (
            <div key={group.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className={`w-3.5 h-3.5 ${tone.text}`} strokeWidth={2} />
                <p className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${tone.text}`}>{group.label}</p>
              </div>
              <ul className="flex flex-col gap-2">
                {group.items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-[12px] text-neutral-600 leading-snug">
                    <span className={`w-1.5 h-1.5 rounded-full ${tone.dot} mt-1.5 flex-shrink-0`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
      <div className="mt-4 rounded-2xl bg-neutral-900 text-white px-6 py-4 flex flex-wrap items-center gap-2 text-[13px]">
        <Send className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
        <span>Saída dos alertas via <span className="font-semibold text-emerald-300">{channel}</span> — a operação reage por antecipação, não no fechamento.</span>
      </div>
    </div>
  )
}

// ─── 5. QW → Layer → IA ───────────────────────────────────────────────────────
export function QwToLayerToAi({ quickWins }: { quickWins: QuickWin[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {quickWins.map(qw => (
        <div
          key={qw.id}
          className={`grid grid-cols-1 sm:grid-cols-[1.1fr_1.6fr_auto] gap-3 sm:gap-4 sm:items-center rounded-xl border p-4 ${
            qw.llm
              ? 'border-neutral-900 bg-neutral-900 text-white'
              : 'border-black/[0.06] bg-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono ${qw.llm ? 'text-emerald-300' : 'text-neutral-300'}`}>{qw.id}</span>
            <p className={`text-[14px] font-semibold ${qw.llm ? 'text-white' : 'text-neutral-900'}`}>{qw.stage}</p>
          </div>
          <p className={`text-[12px] leading-snug ${qw.llm ? 'text-white/70' : 'text-neutral-500'}`}>{qw.opportunity}</p>
          <span
            className={`justify-self-start sm:justify-self-end text-[10.5px] font-mono rounded-md px-2.5 py-1.5 whitespace-nowrap ${
              qw.llm ? 'bg-emerald-400/15 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {qw.enabledBy}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── 6. Antes/Depois da verdade operacional ──────────────────────────────────
export function BeforeAfterTruth({
  before,
  after,
}: {
  before: { title: string; points: string[] }
  after: { title: string; points: string[] }
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="rounded-2xl border border-rose-900/10 bg-rose-50/40 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rose-700/80 mb-3">{before.title}</p>
        <ul className="space-y-2">
          {before.points.map(p => (
            <li key={p} className="flex items-start gap-2 text-[12px] text-neutral-600 leading-snug">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700/80 mb-3">{after.title}</p>
        <ul className="space-y-2">
          {after.points.map(p => (
            <li key={p} className="flex items-start gap-2 text-[12px] text-neutral-700 leading-snug">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
