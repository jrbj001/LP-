'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { PageShell, PageHeader, Reveal, Badge } from '@/components/adaptive/ui'
import {
  PROPOSAL_META,
  RATE_BASIS,
  SQUAD,
  SQUAD_SUMMARY,
  COMMERCIAL_MILESTONES,
  COMMERCIAL_MODELS,
  COMMERCIAL_DECISION,
  PROPOSAL_TOTALS,
  PROPOSAL_OUTCOME,
  COMMERCIAL_TERMS,
  OPERATING_MODEL,
  SCOPE,
  DELIVERY_RISKS,
  ASSUMPTIONS,
  formatBRL,
} from '@/components/adaptive/proposal-data'
import {
  Lock, Unlock, Users, Calculator, BookOpen, ExternalLink,
  CheckCircle2, Info, Clock, Wallet, ShieldCheck, Target,
  Milestone, ListChecks, GitPullRequest, AlertTriangle, Layers3, Scale,
} from 'lucide-react'

const STORAGE_KEY = 'orfeu-proposal-unlocked'

const PHASE_STYLE: Record<string, { dot: string; badge: string; label: string }> = {
  mobilization: { dot: 'bg-sky-500', badge: 'bg-sky-50 text-sky-700', label: 'Mobilização' },
  'quick-win': { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700', label: 'Quick win' },
  layer: { dot: 'bg-neutral-900', badge: 'bg-neutral-100 text-neutral-700', label: 'Adaptive Layer™' },
  delivery: { dot: 'bg-violet-500', badge: 'bg-violet-50 text-violet-700', label: 'Entrega-mãe' },
}

export function ProposalView() {
  const [unlocked, setUnlocked] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(STORAGE_KEY) === '1')
    setReady(true)
  }, [])

  if (!ready) return null

  if (!unlocked) {
    return (
      <PasswordGate
        onUnlock={() => {
          sessionStorage.setItem(STORAGE_KEY, '1')
          setUnlocked(true)
        }}
      />
    )
  }

  return <ProposalContent />
}

/* ─── Gate de senha ──────────────────────────────────────────────────────── */

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim().toLowerCase() === PROPOSAL_META.password) {
      onUnlock()
    } else {
      setError(true)
    }
  }

  return (
    <PageShell>
      <div className="min-h-[60vh] flex items-center justify-center">
        <Reveal className="w-full max-w-sm">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center mx-auto mb-5">
              <Lock className="w-5 h-5 text-white" strokeWidth={1.75} />
            </div>
            <h1 className="text-[20px] font-semibold text-neutral-900 tracking-tight">
              {PROPOSAL_META.title}
            </h1>
            <p className="text-[13px] text-neutral-500 mt-2 leading-relaxed">
              Conteúdo confidencial do {PROPOSAL_META.client}. Digite a senha compartilhada
              pela PixelPulseLab.
            </p>
            <form onSubmit={submit} className="mt-6">
              <input
                type="password"
                value={value}
                onChange={e => { setValue(e.target.value); setError(false) }}
                placeholder="Senha de acesso"
                autoFocus
                className={`w-full rounded-xl border px-4 py-3 text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors ${
                  error
                    ? 'border-rose-300 bg-rose-50/50 focus:border-rose-400'
                    : 'border-black/[0.08] bg-[#fafaf8] focus:border-neutral-900/30'
                }`}
              />
              {error && (
                <p className="text-[12px] text-rose-600 mt-2">Senha incorreta. Tente novamente.</p>
              )}
              <button
                type="submit"
                className="w-full mt-3 rounded-xl bg-neutral-900 text-white text-[14px] font-medium py-3 hover:bg-neutral-800 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" strokeWidth={1.75} />
                Acessar proposta
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </PageShell>
  )
}

/* ─── Conteúdo da proposta ───────────────────────────────────────────────── */

function ProposalContent() {
  const locale = useLocale()

  return (
    <PageShell>
      <PageHeader
        eyebrow={`Confidencial · ${PROPOSAL_META.client}`}
        title={PROPOSAL_META.title}
        subtitle="Engagement mensal do squad dedicado, orientado a milestones e gates — com esforço e blended como base de planejamento e transparência, não como produto vendido."
      />

      {/* Resultado contratado */}
      <Reveal>
        <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/60 p-6 mb-5">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-700/70">
                Resultado contratado
              </p>
              <h2 className="text-[18px] font-semibold text-neutral-900 mt-1">{PROPOSAL_OUTCOME.scope}</h2>
              <p className="text-[13px] text-neutral-600 leading-relaxed mt-2">{PROPOSAL_OUTCOME.outcome}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge tone="green">{PROPOSAL_OUTCOME.milestoneCount} milestones</Badge>
                <Badge tone="green">{PROPOSAL_OUTCOME.quickWinCount} quick wins OTD</Badge>
                <Badge tone="green">{PROPOSAL_OUTCOME.aiOpportunityCount} oportunidades de IA</Badge>
                <Badge tone="green">{PROPOSAL_OUTCOME.agentCount} agentes</Badge>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Resumo financeiro hero */}
      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-8 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                  Engagement mensal
                </p>
              </div>
              <p className="text-[26px] font-semibold tracking-tight leading-none">
                {formatBRL(SQUAD_SUMMARY.monthlyInvestment.min)}–{formatBRL(SQUAD_SUMMARY.monthlyInvestment.max)}
              </p>
              <p className="text-[12px] text-white/50 mt-2">Squad dedicado · reuniões e engenharia inclusos</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                  Horizonte
                </p>
              </div>
              <p className="text-[26px] font-semibold tracking-tight leading-none">{PROPOSAL_TOTALS.horizon}</p>
              <p className="text-[12px] text-white/50 mt-2">
                ~{SQUAD_SUMMARY.totalHoursMonth}h/mês de capacidade planejada
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                  Total estimado
                </p>
              </div>
              <p className="text-[26px] font-semibold tracking-tight leading-none">
                {formatBRL(PROPOSAL_TOTALS.investment.min)}–{formatBRL(PROPOSAL_TOTALS.investment.max)}
              </p>
              <p className="text-[12px] text-white/50 mt-2">
                Referência blended R$ {RATE_BASIS.blended.min}–{RATE_BASIS.blended.max}/h
              </p>
            </div>
          </div>
          <p className="text-[12px] text-white/40 leading-relaxed mt-6 pt-5 border-t border-white/[0.08]">
            {PROPOSAL_TOTALS.note} {PROPOSAL_META.validity}.
          </p>
        </div>
      </Reveal>

      {/* Decisão comercial + Modelo único */}
      <Reveal>
        <Section
          title={COMMERCIAL_DECISION.title}
          subtitle="Por que um engagement mensal orientado a resultado — e não venda de horas"
          icon={Scale}
        >
          <p className="text-[13px] text-neutral-600 leading-relaxed mb-5 max-w-3xl">
            {COMMERCIAL_DECISION.narrative}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {COMMERCIAL_DECISION.why.map(item => (
              <div key={item.title} className="rounded-xl border border-black/[0.06] bg-[#fafaf8] p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" strokeWidth={1.75} />
                  <p className="text-[13px] font-semibold text-neutral-900">{item.title}</p>
                </div>
                <p className="text-[12px] text-neutral-500 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
          {COMMERCIAL_MODELS.map(model => (
            <div
              key={model.id}
              className="rounded-2xl border border-emerald-900/15 bg-emerald-50/50 p-6"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {model.badge}
                </span>
              </div>
              <h3 className="text-[16px] font-semibold text-neutral-900">{model.title}</h3>
              <p className="text-[13px] font-medium text-neutral-700 mt-1">{model.headline}</p>
              <p className="text-[12px] text-neutral-500 leading-relaxed mt-3 max-w-3xl">{model.summary}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                {model.points.map(point => (
                  <li key={point} className="flex gap-2 text-[12px] text-neutral-600 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-emerald-500" strokeWidth={1.75} />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-black/[0.06] flex flex-wrap items-baseline gap-x-6 gap-y-1">
                <p className="text-[16px] font-semibold text-neutral-900">{model.monthly}</p>
                <p className="text-[12px] text-neutral-500">{model.total}</p>
              </div>
              <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">{model.footing}</p>
            </div>
          ))}
        </Section>
      </Reveal>

      {/* Linha de execução */}
      <Reveal>
        <Section
          title="Linha de execução e gates"
          subtitle="Um milestone só libera o próximo quando suas evidências e critérios de aceite forem validados"
          icon={Milestone}
        >
          <div className="relative">
            <div className="absolute left-[15px] top-5 bottom-5 w-px bg-black/[0.08]" />
            <div className="space-y-3">
              {COMMERCIAL_MILESTONES.map(milestone => {
                const style = PHASE_STYLE[milestone.type]
                return (
                  <div key={milestone.id} className="relative pl-11">
                    <div className={`absolute left-2 top-5 w-4 h-4 rounded-full border-[3px] border-white ${style.dot}`} />
                    <div className="rounded-xl border border-black/[0.06] bg-white px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono font-semibold text-neutral-400">{milestone.number}</span>
                        <span className="text-[14px] font-semibold text-neutral-900">{milestone.title}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
                          {style.label}
                        </span>
                        <span className="ml-auto text-[11px] text-neutral-400">{milestone.window}</span>
                      </div>
                      <p className="text-[12px] text-neutral-500 leading-relaxed mt-2">{milestone.objective}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Section>
      </Reveal>

      {/* Base de preço — transparência */}
      <Reveal>
        <Section
          title="Base de preço · transparência"
          subtitle="Como o blended e o Guia de Valores 2026 sustentam a mensalidade — base de dimensionamento, não cobrança por hora"
          icon={BookOpen}
        >
          <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
            <p className="text-[13px] text-neutral-600 leading-relaxed mb-5">{RATE_BASIS.note}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              {RATE_BASIS.references.map(r => (
                <div key={r.category} className="flex items-baseline justify-between gap-3 rounded-xl border border-black/[0.05] bg-[#fafaf8] px-4 py-3">
                  <span className="text-[12px] text-neutral-600">{r.category}</span>
                  <span className="text-[13px] font-semibold font-mono text-neutral-900 whitespace-nowrap">{r.range}</span>
                </div>
              ))}
            </div>
            <Link
              href={`/${locale}${PROPOSAL_META.guideHref}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
              Consultar o guia completo (público)
            </Link>
          </div>
        </Section>
      </Reveal>

      {/* Squad sugerido */}
      <Reveal>
        <Section title="Squad sugerido" subtitle="Capacidade planejada do engagement — não é tabela de venda hora a hora" icon={Users}>
          <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden mb-3">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[680px]">
                <thead>
                  <tr className="border-b border-black/[0.05] text-[11px] uppercase tracking-wider text-neutral-400">
                    <th className="px-5 py-3 font-medium">Papel</th>
                    <th className="px-5 py-3 font-medium">Dedicação</th>
                    <th className="px-5 py-3 font-medium">Capacidade/mês</th>
                    <th className="px-5 py-3 font-medium">Faixa (Guia)</th>
                    <th className="px-5 py-3 font-medium">Foco</th>
                  </tr>
                </thead>
                <tbody>
                  {SQUAD.map(s => (
                    <tr key={s.role} className="border-b border-black/[0.04] last:border-0 align-top">
                      <td className="px-5 py-3.5 text-[13px] font-medium text-neutral-900 whitespace-nowrap">{s.role}</td>
                      <td className="px-5 py-3.5 text-[12px] text-neutral-500 whitespace-nowrap">{s.dedication}</td>
                      <td className="px-5 py-3.5 text-[13px] font-mono text-neutral-900">{s.hoursMonth}h</td>
                      <td className="px-5 py-3.5 text-[12px] font-mono text-neutral-600 whitespace-nowrap">{s.rate}</td>
                      <td className="px-5 py-3.5 text-[12px] text-neutral-500 leading-relaxed min-w-[220px]">{s.focus}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-black/[0.06] bg-[#fafaf8]">
                    <td className="px-5 py-3.5 text-[13px] font-semibold text-neutral-900">Total</td>
                    <td className="px-5 py-3.5" />
                    <td className="px-5 py-3.5 text-[13px] font-mono font-semibold text-neutral-900">
                      {SQUAD_SUMMARY.totalHoursMonth}h
                    </td>
                    <td colSpan={2} className="px-5 py-3.5 text-[13px] font-semibold text-neutral-900">
                      {formatBRL(SQUAD_SUMMARY.monthlyInvestment.min)}–{formatBRL(SQUAD_SUMMARY.monthlyInvestment.max)}/mês
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <p className="text-[12px] text-neutral-400 leading-relaxed">
            {SQUAD_SUMMARY.guidePackage}. {SQUAD_SUMMARY.management}
          </p>
          <div className="mt-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-2">
              Atuação principal por milestone
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COMMERCIAL_MILESTONES.map(milestone => (
                <div key={milestone.id} className="rounded-xl border border-black/[0.05] bg-[#fafaf8] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[12px] font-semibold text-neutral-900">
                      {milestone.number} · {milestone.title}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">{milestone.capacityShare}%</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1.5 leading-relaxed">
                    {milestone.squadRoles.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </Reveal>

      {/* Milestones detalhados */}
      <Reveal>
        <Section
          title="Milestones, aceite e investimento"
          subtitle="Capacidade alocada (%) e esforço indicativo para planejamento — o faturamento segue o engagement mensal"
          icon={ListChecks}
        >
          <div className="flex flex-col gap-3">
            {COMMERCIAL_MILESTONES.map(milestone => {
              const style = PHASE_STYLE[milestone.type]
              return (
                <div key={milestone.id} className="rounded-2xl border border-black/[0.06] bg-white p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                    <span className="text-[11px] font-mono font-semibold text-neutral-400">{milestone.number}</span>
                    <p className="text-[14px] font-semibold text-neutral-900">{milestone.title}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
                      {style.label}
                    </span>
                    <span className="text-[11px] text-neutral-400">{milestone.window}</span>
                    <div className="ml-auto flex flex-wrap items-center gap-3 text-[12px] font-mono">
                      <span className="text-neutral-500">{milestone.capacityShare}% da capacidade</span>
                      <span className="text-neutral-400" title="Esforço indicativo de planejamento">
                        ~{milestone.capacityHours}h planejadas
                      </span>
                      <span className="font-semibold text-neutral-900 whitespace-nowrap">
                        {formatBRL(milestone.investment.min)}–{formatBRL(milestone.investment.max)}
                      </span>
                    </div>
                  </div>
                  <p className="text-[13px] text-neutral-600 leading-relaxed mb-5">{milestone.objective}</p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <MilestoneList title="Entregáveis" items={milestone.deliverables} tone="neutral" />
                    <MilestoneList title="Critérios de aceite" items={milestone.acceptanceCriteria} tone="green" />
                    <MilestoneList title="Dependências" items={milestone.dependencies} tone="amber" />
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-2">
                        Responsáveis e evidências
                      </p>
                      <p className="text-[12px] text-neutral-600 leading-relaxed">
                        <span className="font-medium text-neutral-900">Orfeu:</span> {milestone.orfeuOwners.join(' · ')}
                      </p>
                      <p className="text-[12px] text-neutral-600 leading-relaxed mt-1">
                        <span className="font-medium text-neutral-900">Pixel:</span> {milestone.pixelOwners.join(' · ')}
                      </p>
                      <p className="text-[12px] text-neutral-500 leading-relaxed mt-2">
                        {milestone.evidence.join(' · ')}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-neutral-900 text-white px-4 py-3 mt-5 flex items-start gap-2">
                    <GitPullRequest className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
                    <p className="text-[12px] leading-relaxed">{milestone.gate}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-[#fafaf8] px-6 py-4 mt-3 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="text-[13px] font-semibold text-neutral-900">Total do engagement</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Capacidade planejada ~{PROPOSAL_TOTALS.hours.max.toLocaleString('pt-BR')}h · não é soma de faturas por milestone
              </p>
            </div>
            <div className="flex items-center gap-4 text-[13px] font-mono">
              <span className="font-semibold text-neutral-900">
                {formatBRL(PROPOSAL_TOTALS.investment.min)}–{formatBRL(PROPOSAL_TOTALS.investment.max)}
              </span>
            </div>
          </div>
        </Section>
      </Reveal>

      {/* Modelo comercial */}
      <Reveal>
        <Section
          title="Modelo comercial"
          subtitle="Um contrato, duas leituras — outcome-first (A) e capacidade/transparência (B)"
          icon={ShieldCheck}
        >
          <div className="rounded-2xl border border-black/[0.06] bg-white divide-y divide-black/[0.04]">
            {COMMERCIAL_TERMS.map(row => (
              <div key={row.label} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3.5">
                <span className="text-[12px] font-medium text-neutral-500">{row.label}</span>
                <span className="text-[13px] text-neutral-900 text-right max-w-[70%]">{row.value}</span>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      {/* Modelo operacional */}
      <Reveal>
        <Section
          title="Modelo de trabalho"
          subtitle="Ritmo de execução, decisão e aceite para manter todos os milestones no caminho crítico"
          icon={GitPullRequest}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {OPERATING_MODEL.map(item => (
              <div key={item.cadence} className="rounded-2xl border border-black/[0.06] bg-white p-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-700">{item.cadence}</p>
                <p className="text-[14px] font-semibold text-neutral-900 mt-1">{item.ritual}</p>
                <p className="text-[12px] text-neutral-500 leading-relaxed mt-2">{item.output}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/60 p-5 mt-3">
            <p className="text-[13px] font-semibold text-neutral-900">Regra do gate mensal</p>
            <p className="text-[12px] text-neutral-600 leading-relaxed mt-1.5">
              A Pixel apresenta as evidências do ciclo. A Orfeu valida em até 5 dias úteis. O aceite libera a
              fatura; uma pendência objetiva recebe plano corretivo, owner e nova data acordada sem ocultar o
              impacto no milestone seguinte.
            </p>
          </div>
        </Section>
      </Reveal>

      {/* Escopo */}
      <Reveal>
        <Section title="Fronteiras do escopo" subtitle="O que o preço-base cobre e o que permanece como evolução" icon={Layers3}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <ScopeCard title="Incluído" items={SCOPE.included} tone="green" />
            <ScopeCard title="Fora do escopo" items={SCOPE.excluded} tone="neutral" />
            <ScopeCard title="Opções futuras" items={SCOPE.future} tone="violet" />
          </div>
        </Section>
      </Reveal>

      {/* Riscos */}
      <Reveal>
        <Section
          title="Riscos e contrapartidas"
          subtitle="Dependências que precisam de owner para proteger prazo, qualidade e aceite"
          icon={AlertTriangle}
        >
          <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
            {DELIVERY_RISKS.map((item, index) => (
              <div
                key={item.risk}
                className={`p-5 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_0.6fr] gap-2 lg:gap-5 ${
                  index < DELIVERY_RISKS.length - 1 ? 'border-b border-black/[0.05]' : ''
                }`}
              >
                <p className="text-[13px] font-medium text-neutral-900">{item.risk}</p>
                <p className="text-[12px] text-neutral-500 leading-relaxed">{item.mitigation}</p>
                <p className="text-[11px] text-neutral-400 lg:text-right">{item.owner}</p>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      {/* Premissas */}
      <Reveal>
        <Section title="Premissas" subtitle="O que sustenta os números desta proposta" icon={Info}>
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
            <ul className="space-y-2.5">
              {ASSUMPTIONS.map(a => (
                <li key={a} className="flex gap-2.5 text-[13px] text-neutral-600 leading-relaxed">
                  <span className="text-neutral-300 mt-0.5">·</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Badge tone="muted">Gerada em {PROPOSAL_META.date}</Badge>
            <Badge tone="muted">Escopo-base sujeito aos gates e premissas acima</Badge>
          </div>
        </Section>
      </Reveal>
    </PageShell>
  )
}

function MilestoneList({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: 'neutral' | 'green' | 'amber'
}) {
  const iconTone = {
    neutral: 'text-neutral-300',
    green: 'text-emerald-500',
    amber: 'text-amber-500',
  }[tone]

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-2">{title}</p>
      <ul className="space-y-1.5">
        {items.map(item => (
          <li key={item} className="flex gap-2 text-[12px] text-neutral-600 leading-relaxed">
            <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${iconTone}`} strokeWidth={1.75} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ScopeCard({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: 'green' | 'neutral' | 'violet'
}) {
  const styles = {
    green: 'bg-emerald-50/60 border-emerald-900/10 text-emerald-700',
    neutral: 'bg-white border-black/[0.06] text-neutral-500',
    violet: 'bg-violet-50/60 border-violet-900/10 text-violet-700',
  }[tone]

  return (
    <div className={`rounded-2xl border p-5 ${styles}`}>
      <p className="text-[12px] font-semibold text-neutral-900 mb-3">{title}</p>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item} className="flex gap-2 text-[12px] leading-relaxed">
            <span className="mt-0.5">·</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Section({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>
  children: React.ReactNode
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-5">
        {Icon && <Icon className="w-4 h-4 text-neutral-400" strokeWidth={1.75} />}
        <div>
          <h2 className="text-[18px] font-semibold text-neutral-900">{title}</h2>
          {subtitle && <p className="text-[13px] text-neutral-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}
