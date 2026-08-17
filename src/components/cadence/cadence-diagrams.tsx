'use client'

import { motion } from 'framer-motion'
import {
  Bot,
  Check,
  ChevronRight,
  FileText,
  GitBranch,
  KeyRound,
  Layers3,
  MessageSquare,
  Mic,
  MoreHorizontal,
  PenLine,
  Send,
  Sparkles,
  User,
} from 'lucide-react'
import { PIPELINE, SOURCES } from './cadence-data'

const SOURCE_ICONS = [FileText, Mic, MessageSquare, PenLine]

/* ─── Hero: batidas / ritmo + board ghost ──────────────────────────────────── */

export function HeroRhythm() {
  const bars = [28, 52, 40, 72, 36, 64, 48, 80, 44, 58, 34, 70]
  return (
    <div className="relative w-full h-full min-h-[100svh] overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_42%,rgba(13,148,136,0.22),transparent_52%),radial-gradient(ellipse_at_22%_78%,rgba(255,255,255,0.06),transparent_48%)]" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 70% 40%, black 12%, transparent 70%)',
        }}
      />

      {/* Waveform / cadence bars — right-weighted */}
      <div className="absolute inset-0 flex items-center justify-end pr-[6%] md:pr-[10%]">
        <div className="relative w-[min(90vw,480px)]">
          <div className="flex items-end justify-center gap-1.5 sm:gap-2 h-48 sm:h-64 mb-10">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                className="w-2.5 sm:w-3.5 rounded-full bg-gradient-to-t from-teal-700/40 to-teal-300/90 origin-bottom"
                style={{ height: `${h}%` }}
                initial={{ scaleY: 0.2, opacity: 0 }}
                animate={{
                  scaleY: [0.55, 1, 0.7, 1],
                  opacity: 1,
                }}
                transition={{
                  delay: 0.15 + i * 0.04,
                  duration: 2.4 + (i % 4) * 0.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          <motion.div
            className="rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-md p-4 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-teal-300/90">Board</span>
              <span className="text-[10px] text-white/35">· agent-ready</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {PIPELINE.map((col, i) => (
                <motion.div
                  key={col.id}
                  className="rounded-lg bg-white/[0.06] border border-white/10 px-1.5 py-2 text-center"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.06 }}
                >
                  <p className="text-[8px] sm:text-[9px] text-white/55 leading-tight">{col.label}</p>
                  {col.id === 'ready' && (
                    <motion.div
                      className="mt-1.5 mx-auto w-1.5 h-1.5 rounded-full bg-teal-400"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ─── Pipeline fontes → agent-ready ────────────────────────────────────────── */

export function PipelineFlow() {
  return (
    <div className="relative">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400 text-center mb-5">
        De onde o trabalho nasce
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {SOURCES.map((src, i) => {
          const Icon = SOURCE_ICONS[i] ?? FileText
          return (
            <motion.div
              key={src.label}
              className="rounded-2xl border border-black/[0.06] bg-white p-4 text-center shadow-[0_1px_0_rgba(0,0,0,0.02)]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-2.5">
                <Icon className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <p className="text-[13px] font-semibold text-neutral-900 tracking-tight">{src.label}</p>
              <p className="text-[11px] text-neutral-500 mt-1 leading-snug">{src.detail}</p>
            </motion.div>
          )
        })}
      </div>

      <FlowArrow label="board · enrichment LLM + GitHub" />

      <div className="rounded-3xl bg-neutral-950 text-white p-5 sm:p-7 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(13,148,136,0.18),transparent_55%)]" />
        <div className="relative flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {PIPELINE.map((col, i) => (
            <div key={col.id} className="flex items-center gap-2 sm:gap-3">
              <div
                className={`rounded-xl border px-3.5 py-2.5 text-[12px] sm:text-[13px] font-medium ${
                  col.tone === 'ready'
                    ? 'border-teal-400/50 bg-teal-400/15 text-teal-200'
                    : 'border-white/10 bg-white/[0.06] text-white/85'
                }`}
              >
                {col.label}
              </div>
              {i < PIPELINE.length - 1 && (
                <span className="text-white/25 text-sm hidden sm:inline">→</span>
              )}
            </div>
          ))}
        </div>
        <p className="relative text-center text-[12px] text-white/45 mt-5">
          O PM revisa em cada degrau. Enrichment sugere — nunca publica sozinho.
        </p>
      </div>
    </div>
  )
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-4">
      <div className="h-6 w-px bg-gradient-to-b from-transparent via-teal-500/50 to-teal-600/80" />
      <p className="text-[10px] uppercase tracking-[0.18em] text-teal-700/80 font-medium py-2">{label}</p>
      <div className="h-6 w-px bg-gradient-to-b from-teal-600/80 via-teal-500/40 to-transparent" />
    </div>
  )
}

/* ─── Humano + agente na mesma task ────────────────────────────────────────── */

export function AgentsOnTask() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(13,148,136,0.15),transparent_50%)]" />
      <div className="relative grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
        <motion.div
          className="rounded-2xl border border-white/12 bg-neutral-950/60 p-5"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-teal-300" strokeWidth={1.75} />
            <span className="text-[12px] font-medium text-white/80">Product manager</span>
          </div>
          <ul className="space-y-2 text-[12px] text-white/50 leading-relaxed">
            <li>Revisa acceptance e riscos</li>
            <li>Ajusta filesLikely e diagrama</li>
            <li>Move para Pronta p/ agent</li>
          </ul>
        </motion.div>

        <div className="flex flex-col items-center gap-2">
          <motion.div
            className="w-14 h-14 rounded-2xl bg-teal-400/20 border border-teal-400/40 flex items-center justify-center"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-6 h-6 text-teal-300" strokeWidth={1.75} />
          </motion.div>
          <span className="text-[10px] uppercase tracking-[0.16em] text-teal-300/80">mesma task</span>
        </div>

        <motion.div
          className="rounded-2xl border border-teal-400/25 bg-teal-400/10 p-5"
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-teal-300" strokeWidth={1.75} />
            <span className="text-[12px] font-medium text-teal-100">Agente de desenvolvimento</span>
          </div>
          <ul className="space-y-2 text-[12px] text-teal-100/60 leading-relaxed">
            <li>Consome spec agent-ready</li>
            <li>Usa githubRefs e testPlan</li>
            <li>Reporta progresso de volta</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

/* ─── GitHub context strip ─────────────────────────────────────────────────── */

export function GithubContextStrip() {
  return (
    <div className="rounded-3xl border border-black/[0.06] bg-white p-6 sm:p-8 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-teal-300 flex items-center justify-center flex-shrink-0">
          <GitBranch className="w-5 h-5" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-neutral-900 tracking-tight">
            README + busca no código + trechos citados
          </p>
          <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed">
            O enrichment e o copiloto consultam os mesmos repos do workspace. A spec deixa de ser genérica —
            passa a falar a língua do seu projeto.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {['landing', 'app', 'api'].map((repo, i) => (
            <motion.span
              key={repo}
              className="rounded-lg border border-black/[0.06] bg-[#f7f7f5] px-2.5 py-1.5 text-[11px] font-mono text-neutral-600"
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              {repo}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Product UX showcase ──────────────────────────────────────────────────── */

const BOARD_COLUMNS = [
  {
    label: 'Requisito',
    count: 3,
    cards: [
      ['Checkout por Pix', 'manual'],
      ['Novo onboarding', 'reunião'],
    ],
  },
  {
    label: 'User Story',
    count: 2,
    cards: [
      ['Recuperar carrinho', 'enriched'],
      ['Permissões do time', 'doc'],
    ],
  },
  {
    label: 'Pronta p/ agent',
    count: 2,
    cards: [
      ['Webhook de pagamento', 'agent-ready'],
      ['Eventos de analytics', 'agent-ready'],
    ],
  },
  {
    label: 'Em dev',
    count: 1,
    cards: [['Busca inteligente', 'agent 02']],
  },
]

export function ProductScreens() {
  return (
    <div className="space-y-5">
      <BoardScreen />
      <div className="grid lg:grid-cols-2 gap-5">
        <CopilotScreen />
        <AgentReadyScreen />
      </div>
      <ConnectionsScreen />
    </div>
  )
}

function WindowFrame({
  title,
  eyebrow,
  children,
  className = '',
}: {
  title: string
  eyebrow: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={`rounded-[22px] border border-black/[0.08] bg-white shadow-[0_24px_70px_-38px_rgba(15,23,42,0.3)] overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div className="h-12 px-4 sm:px-5 border-b border-black/[0.06] flex items-center justify-between bg-[#fbfbfa]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex gap-1.5" aria-hidden>
            <span className="w-2 h-2 rounded-full bg-neutral-300" />
            <span className="w-2 h-2 rounded-full bg-neutral-200" />
            <span className="w-2 h-2 rounded-full bg-neutral-200" />
          </div>
          <span className="h-4 w-px bg-black/[0.07]" />
          <p className="text-[11px] font-medium text-neutral-700 truncate">{title}</p>
        </div>
        <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-neutral-400">
          {eyebrow}
        </span>
      </div>
      {children}
    </motion.div>
  )
}

function BoardScreen() {
  return (
    <WindowFrame title="Cadence · Product Core" eyebrow="Board">
      <div className="p-4 sm:p-5 bg-[#f5f5f3]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[13px] font-semibold text-neutral-900">Roadmap do produto</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">12 tasks · 2 agentes ativos</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex -space-x-1.5">
              {['PM', 'FE', 'A1'].map((item) => (
                <span
                  key={item}
                  className="w-6 h-6 rounded-full border-2 border-[#f5f5f3] bg-neutral-900 text-[7px] font-medium text-white flex items-center justify-center"
                >
                  {item}
                </span>
              ))}
            </div>
            <button className="rounded-lg bg-neutral-900 px-3 py-1.5 text-[10px] font-medium text-white">
              + Nova task
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {BOARD_COLUMNS.map((column, columnIndex) => (
            <div key={column.label} className="min-w-0">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[9px] sm:text-[10px] font-medium text-neutral-500 truncate">
                  {column.label}
                </span>
                <span className="text-[9px] font-mono text-neutral-400">{column.count}</span>
              </div>
              <div className="space-y-2">
                {column.cards.map(([title, tag], cardIndex) => (
                  <motion.div
                    key={title}
                    className={`rounded-xl border bg-white p-2.5 sm:p-3 ${
                      columnIndex === 2
                        ? 'border-teal-500/25 shadow-[inset_0_2px_0_rgba(13,148,136,0.65)]'
                        : 'border-black/[0.06]'
                    }`}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.08 + columnIndex * 0.05 + cardIndex * 0.04 }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[9px] sm:text-[11px] font-medium text-neutral-800 leading-snug">
                        {title}
                      </p>
                      <MoreHorizontal className="w-3 h-3 text-neutral-300 flex-shrink-0" />
                    </div>
                    <div className="mt-2.5 flex items-center justify-between gap-1">
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[7px] sm:text-[8px] font-medium ${
                          tag.includes('agent')
                            ? 'bg-teal-50 text-teal-700'
                            : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        {tag}
                      </span>
                      <span className="w-4 h-4 rounded-full bg-neutral-100 flex items-center justify-center">
                        {tag.includes('agent') ? (
                          <Bot className="w-2.5 h-2.5 text-teal-700" />
                        ) : (
                          <User className="w-2.5 h-2.5 text-neutral-400" />
                        )}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </WindowFrame>
  )
}

function CopilotScreen() {
  return (
    <WindowFrame title="Copiloto de user stories" eyebrow="LLM">
      <div className="p-4 sm:p-5 min-h-[360px] flex flex-col bg-white">
        <div className="flex items-center gap-2.5 pb-4 border-b border-black/[0.05]">
          <span className="w-8 h-8 rounded-xl bg-neutral-950 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
          </span>
          <div>
            <p className="text-[12px] font-semibold text-neutral-900">Cadence Copilot</p>
            <p className="text-[9px] text-neutral-400">GitHub conectado · 3 repos</p>
          </div>
        </div>

        <div className="flex-1 py-4 space-y-3">
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-neutral-950 px-3.5 py-2.5 text-[11px] text-white/85 leading-relaxed">
            Precisamos recuperar carrinhos abandonados sem duplicar mensagens.
          </div>
          <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-[#f3f3f1] px-3.5 py-3">
            <p className="text-[11px] text-neutral-650 leading-relaxed">
              Encontrei o fluxo de checkout em <span className="font-mono text-teal-700">cart.service.ts</span>.
              Vou propor idempotência por evento e consentimento antes do disparo.
            </p>
            <div className="mt-3 rounded-xl border border-teal-500/20 bg-white p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3 h-3 text-teal-600" />
                <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-teal-700">
                  Story draft
                </span>
              </div>
              <p className="text-[10px] font-medium text-neutral-800">
                Como cliente, quero retomar meu carrinho...
              </p>
              <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-2.5 py-1.5 text-[9px] font-medium text-white">
                Aplicar no board
                <ChevronRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-black/[0.08] bg-[#fbfbfa] px-3 py-2.5 flex items-center gap-2">
          <span className="text-[10px] text-neutral-400 flex-1">Aprofunde a regra de negócio...</span>
          <span className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
            <Send className="w-3 h-3" />
          </span>
        </div>
      </div>
    </WindowFrame>
  )
}

function AgentReadyScreen() {
  const checks = [
    'Critérios de aceite',
    'Contexto de implementação',
    'Arquivos prováveis',
    'Plano de testes',
    'Riscos e GitHub refs',
  ]

  return (
    <WindowFrame title="US-042 · Webhook de pagamento" eyebrow="Spec">
      <div className="p-4 sm:p-5 min-h-[360px] bg-[#fbfbfa]">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-[9px] font-medium text-teal-700">
            <Bot className="w-3 h-3" />
            Agent-ready
          </span>
          <span className="text-[9px] font-mono text-neutral-400">HIGH · M2</span>
        </div>

        <h3 className="text-[15px] font-semibold tracking-tight text-neutral-900">
          Processar confirmação sem duplicidade
        </h3>
        <p className="mt-2 text-[11px] text-neutral-500 leading-relaxed">
          Como plataforma, quero validar eventos por idempotency key para que cada pagamento altere o pedido uma única vez.
        </p>

        <div className="mt-5 space-y-2">
          {checks.map((check, i) => (
            <motion.div
              key={check}
              className="flex items-center gap-2.5 rounded-xl border border-black/[0.05] bg-white px-3 py-2.5"
              initial={{ opacity: 0, x: 8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 + i * 0.05 }}
            >
              <span className="w-5 h-5 rounded-md bg-teal-50 flex items-center justify-center">
                <Check className="w-3 h-3 text-teal-700" strokeWidth={2.2} />
              </span>
              <span className="text-[10px] font-medium text-neutral-650">{check}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            {['api/payment.ts', 'order.service.ts'].map((file) => (
              <span key={file} className="hidden sm:inline text-[8px] font-mono text-neutral-400">
                {file}
              </span>
            ))}
          </div>
          <button className="rounded-lg bg-neutral-900 px-3 py-1.5 text-[9px] font-medium text-white">
            Enviar ao agente
          </button>
        </div>
      </div>
    </WindowFrame>
  )
}

function ConnectionsScreen() {
  const connections = [
    { icon: GitBranch, name: 'GitHub', detail: '3 repositórios', status: 'Conectado' },
    { icon: Sparkles, name: 'LLM', detail: 'Modelo de enrichment', status: 'Protegido' },
    { icon: Bot, name: 'Dev agents', detail: '2 agentes disponíveis', status: 'Ativos' },
  ]

  return (
    <WindowFrame title="Agentes & conexões" eyebrow="Workspace">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
        <div className="p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-black/[0.06] bg-neutral-950 text-white">
          <div className="w-10 h-10 rounded-xl border border-teal-400/30 bg-teal-400/10 flex items-center justify-center mb-5">
            <KeyRound className="w-4 h-4 text-teal-300" />
          </div>
          <p className="text-[13px] font-semibold">Segredos ficam fora das tasks.</p>
          <p className="mt-2 text-[11px] text-white/45 leading-relaxed max-w-xs">
            Tokens e chaves são armazenados como credenciais protegidas. O board mostra apenas estado, escopo e última verificação.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2">
            <span className="font-mono text-[10px] text-white/35">sk-••••••••••4f2a</span>
            <span className="text-[8px] uppercase tracking-[0.12em] text-teal-300">encrypted</span>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-[#fbfbfa]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[12px] font-semibold text-neutral-900">Workspace connections</p>
              <p className="text-[9px] text-neutral-400 mt-0.5">Contexto e execução do produto</p>
            </div>
            <Layers3 className="w-4 h-4 text-neutral-300" />
          </div>
          <div className="space-y-2">
            {connections.map(({ icon: Icon, name, detail, status }, i) => (
              <motion.div
                key={name}
                className="rounded-xl border border-black/[0.06] bg-white px-3.5 py-3 flex items-center gap-3"
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 + i * 0.06 }}
              >
                <span className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-neutral-700" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-neutral-800">{name}</p>
                  <p className="text-[9px] text-neutral-400">{detail}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[8px] font-medium text-teal-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  {status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}
