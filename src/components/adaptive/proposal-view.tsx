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
  PROPOSAL_PHASES,
  PROPOSAL_TOTALS,
  COMMERCIAL_TERMS,
  ASSUMPTIONS,
  formatBRL,
} from '@/components/adaptive/proposal-data'
import {
  Lock, Unlock, Users, Calculator, BookOpen, ExternalLink,
  CheckCircle2, Info, Clock, Wallet, ShieldCheck,
} from 'lucide-react'

const STORAGE_KEY = 'orfeu-proposal-unlocked'

const PHASE_STYLE: Record<string, { dot: string; badge: string; label: string }> = {
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
        subtitle="Squad, demandas, esforço e investimento para executar o plano de trabalho do Executive Review — com valores dentro das faixas públicas do Guia de Valores 2026."
      />

      {/* Resumo financeiro hero */}
      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                  Squad mensal
                </p>
              </div>
              <p className="text-[26px] font-semibold tracking-tight leading-none">
                {formatBRL(SQUAD_SUMMARY.monthlyInvestment.min)}–{formatBRL(SQUAD_SUMMARY.monthlyInvestment.max)}
              </p>
              <p className="text-[12px] text-white/50 mt-2">{SQUAD_SUMMARY.totalHoursMonth}h/mês de capacidade</p>
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
                {PROPOSAL_TOTALS.hours.min.toLocaleString('pt-BR')}–{PROPOSAL_TOTALS.hours.max.toLocaleString('pt-BR')} horas estimadas
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
                Blended R$ {RATE_BASIS.blended.min}–{RATE_BASIS.blended.max}/h
              </p>
            </div>
          </div>
          <p className="text-[12px] text-white/40 leading-relaxed mt-6 pt-5 border-t border-white/[0.08]">
            {PROPOSAL_TOTALS.note} {PROPOSAL_META.validity}.
          </p>
        </div>
      </Reveal>

      {/* Base de preço — guia */}
      <Reveal>
        <Section
          title="Base de preço"
          subtitle="Faixas públicas do Guia de Valores de Desenvolvimento 2026"
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
        <Section title="Squad sugerido" subtitle="Equipe enxuta dimensionada para o escopo Orfeu" icon={Users}>
          <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden mb-3">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[680px]">
                <thead>
                  <tr className="border-b border-black/[0.05] text-[11px] uppercase tracking-wider text-neutral-400">
                    <th className="px-5 py-3 font-medium">Papel</th>
                    <th className="px-5 py-3 font-medium">Dedicação</th>
                    <th className="px-5 py-3 font-medium">Horas/mês</th>
                    <th className="px-5 py-3 font-medium">Faixa hora</th>
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
        </Section>
      </Reveal>

      {/* Demandas por fase */}
      <Reveal>
        <Section
          title="Demandas, esforço e investimento por fase"
          subtitle="Espelha o plano de trabalho do Executive Review"
          icon={Calculator}
        >
          <div className="flex flex-col gap-3">
            {PROPOSAL_PHASES.map(phase => {
              const style = PHASE_STYLE[phase.type]
              return (
                <div key={phase.id} className="rounded-2xl border border-black/[0.06] bg-white p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                    <p className="text-[14px] font-semibold text-neutral-900">{phase.title}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
                      {style.label}
                    </span>
                    <span className="text-[11px] text-neutral-400">{phase.window}</span>
                    <div className="ml-auto flex items-center gap-3 text-[12px] font-mono">
                      <span className="text-neutral-500">{phase.hours.min}–{phase.hours.max}h</span>
                      <span className="font-semibold text-neutral-900 whitespace-nowrap">
                        {formatBRL(phase.investment.min)}–{formatBRL(phase.investment.max)}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {phase.demands.map(d => (
                      <li key={d} className="flex gap-2 text-[13px] text-neutral-600 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neutral-300 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-[#fafaf8] px-6 py-4 mt-3 flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-[13px] font-semibold text-neutral-900">Total estimado</p>
            <div className="flex items-center gap-4 text-[13px] font-mono">
              <span className="text-neutral-500">
                {PROPOSAL_TOTALS.hours.min.toLocaleString('pt-BR')}–{PROPOSAL_TOTALS.hours.max.toLocaleString('pt-BR')}h
              </span>
              <span className="font-semibold text-neutral-900">
                {formatBRL(PROPOSAL_TOTALS.investment.min)}–{formatBRL(PROPOSAL_TOTALS.investment.max)}
              </span>
            </div>
          </div>
        </Section>
      </Reveal>

      {/* Modelo comercial */}
      <Reveal>
        <Section title="Modelo comercial" subtitle="Squad mensal com billing por entrega em produção" icon={ShieldCheck}>
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
            <Badge tone="muted">Assessment parcial — números serão recalibrados</Badge>
          </div>
        </Section>
      </Reveal>
    </PageShell>
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
