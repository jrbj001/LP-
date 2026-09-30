'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { PageShell, PageHeader, Reveal, Badge } from '@/components/adaptive/ui'
import {
  PROPOSAL_META,
  RATE_BASIS,
  READING,
  WAY_OF_WORKING,
  TECHNICAL_PATHS,
  TECHNICAL_READING,
  DELIVERIES,
  DELIVERY_GROUPS,
  COMPOSITIONS,
  KNOWLEDGE_TRANSFER,
  MATURITY,
  EXPERIENCE,
  REFERENCES_NOTE,
  TEAM_NOTE,
  COMMERCIAL_TERMS,
  SCOPE,
  ASSUMPTIONS,
  NEXT_STEP,
  RISK_LABEL,
  ROLE_RATES,
  deliveriesIn,
  findDelivery,
  formatBRL,
  type Delivery,
} from '@/components/adaptive/proposal-data'
import {
  Lock, Unlock, CheckCircle2, Info, Clock, Wallet, ShieldCheck, Target,
  ListChecks, GitPullRequest, AlertTriangle, Layers3, BookOpen, ExternalLink,
  Users, Database, GraduationCap, Waypoints,
} from 'lucide-react'

const STORAGE_KEY = 'orfeu-proposal-unlocked'

const RISK_STYLE: Record<Delivery['risk'], string> = {
  contido: 'bg-emerald-50 text-emerald-700',
  moderado: 'bg-amber-50 text-amber-800',
  alto: 'bg-rose-50 text-rose-700',
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
              Conteúdo confidencial de {PROPOSAL_META.client}. Digite a senha compartilhada
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

function ProposalContent() {
  const locale = useLocale()
  const diagnosis = findDelivery('D0')

  return (
    <PageShell>
      <PageHeader
        eyebrow={`Confidencial · ${PROPOSAL_META.client} · ${PROPOSAL_META.audience}`}
        title={PROPOSAL_META.title}
        subtitle={`${PROPOSAL_META.briefing}. Faixas indicativas por entrega, com premissas declaradas. O preço fecha quando o escopo da entrega for confirmado.`}
      />

      <Reveal>
        <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/60 p-6 mb-5">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-700/70">
                {READING.eyebrow}
              </p>
              <h2 className="text-[18px] font-semibold text-neutral-900 mt-1">{READING.title}</h2>
              <p className="text-[13px] text-neutral-600 leading-relaxed mt-2">{READING.narrative}</p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-8 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                  Primeira entrega · {diagnosis.code}
                </p>
              </div>
              <p className="text-[24px] font-semibold tracking-tight leading-none">
                {formatBRL(diagnosis.investment.min)}–{formatBRL(diagnosis.investment.max)}
              </p>
              <p className="text-[12px] text-white/50 mt-2">{diagnosis.window} · diagnóstico de viabilidade</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                  Entregas cotadas
                </p>
              </div>
              <p className="text-[24px] font-semibold tracking-tight leading-none">{DELIVERIES.length}</p>
              <p className="text-[12px] text-white/50 mt-2">Independentes · cada uma com aceite próprio</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                  Preço fechado
                </p>
              </div>
              <p className="text-[24px] font-semibold tracking-tight leading-none">Por entrega</p>
              <p className="text-[12px] text-white/50 mt-2">Depois do escopo confirmado em conjunto</p>
            </div>
          </div>
          <p className="text-[12px] text-white/40 leading-relaxed mt-6 pt-5 border-t border-white/[0.08]">
            {PROPOSAL_META.validity}
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
          {READING.points.map(item => (
            <div key={item.title} className="rounded-xl border border-black/[0.06] bg-white p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" strokeWidth={1.75} />
                <p className="text-[13px] font-semibold text-neutral-900">{item.title}</p>
              </div>
              <p className="text-[12px] text-neutral-500 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <Section
          title="Como trabalhamos com escopo fechado"
          subtitle="Uma entrega começa com o escopo escrito e termina no aceite. Não há alocação contínua."
          icon={GitPullRequest}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {WAY_OF_WORKING.map(item => (
              <div key={item.title} className="rounded-2xl border border-black/[0.06] bg-white p-5">
                <p className="text-[13px] font-semibold text-neutral-900">{item.title}</p>
                <p className="text-[12px] text-neutral-500 leading-relaxed mt-2">{item.detail}</p>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal>
        <Section
          title="Leitura preliminar · integração com o Protheus"
          subtitle="Quatro caminhos. A recomendação aplicada ao ambiente da Orfeu sai do diagnóstico, não deste texto."
          icon={Waypoints}
        >
          <div className="flex flex-col gap-3">
            {TECHNICAL_PATHS.map(path => (
              <div key={path.id} className="rounded-2xl border border-black/[0.06] bg-white p-6">
                <h3 className="text-[15px] font-semibold text-neutral-900">{path.title}</h3>
                <p className="text-[13px] text-neutral-600 leading-relaxed mt-1.5">{path.summary}</p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                  <PathList label="A favor" items={path.pros} />
                  <PathList label="Contra" items={path.cons} />
                  <PathList label="Risco" items={path.risks} />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/60 p-5 mt-3">
            <p className="text-[13px] font-semibold text-neutral-900">{TECHNICAL_READING.title}</p>
            <p className="text-[12px] text-neutral-600 leading-relaxed mt-1.5">{TECHNICAL_READING.body}</p>
          </div>
        </Section>
      </Reveal>

      {DELIVERY_GROUPS.map(group => (
        <Reveal key={group.id}>
          <Section title={group.title} subtitle={group.subtitle} icon={group.id === 'habilitacao' ? GraduationCap : group.id === 'execucao' ? Database : ListChecks}>
            <div className="flex flex-col gap-3">
              {deliveriesIn(group.id).map(delivery => (
                <DeliveryCard key={delivery.id} delivery={delivery} />
              ))}
            </div>
          </Section>
        </Reveal>
      ))}

      <Reveal>
        <Section
          title="Como as faixas se combinam"
          subtitle="Soma indicativa de entregas independentes. Não é pacote e não tem desconto de volume."
          icon={Layers3}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {COMPOSITIONS.map(composition => (
              <div key={composition.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
                <p className="text-[11px] font-mono text-neutral-400">{composition.codes.join(' + ')}</p>
                <p className="text-[14px] font-semibold text-neutral-900 mt-1">{composition.title}</p>
                <p className="text-[18px] font-semibold text-neutral-900 tracking-tight mt-3">
                  {formatBRL(composition.investment.min)}–{formatBRL(composition.investment.max)}
                </p>
                <p className="text-[12px] text-neutral-500 leading-relaxed mt-2">{composition.note}</p>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal>
        <Section
          title="Equipe por entrega"
          subtitle={TEAM_NOTE}
          icon={Users}
        >
          <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[640px]">
                <thead>
                  <tr className="border-b border-black/[0.05] text-[11px] uppercase tracking-wider text-neutral-400">
                    <th className="px-5 py-3 font-medium">Entrega</th>
                    <th className="px-5 py-3 font-medium">Papel</th>
                    <th className="px-5 py-3 font-medium">Senioridade</th>
                    <th className="px-5 py-3 font-medium">Alocação</th>
                    <th className="px-5 py-3 font-medium">Taxa</th>
                  </tr>
                </thead>
                <tbody>
                  {DELIVERIES.flatMap(delivery =>
                    delivery.team.map((member, index) => (
                      <tr key={`${delivery.id}-${member.role}`} className="border-b border-black/[0.04] last:border-0 align-top">
                        <td className="px-5 py-3 text-[12px] font-mono text-neutral-400 whitespace-nowrap">
                          {index === 0 ? `${delivery.code} · ${delivery.title}` : ''}
                        </td>
                        <td className="px-5 py-3 text-[13px] font-medium text-neutral-900">{member.role}</td>
                        <td className="px-5 py-3 text-[12px] text-neutral-500 whitespace-nowrap">{member.seniority}</td>
                        <td className="px-5 py-3 text-[12px] font-mono text-neutral-500">{member.hoursPerWeek}h/sem</td>
                        <td className="px-5 py-3 text-[12px] font-mono text-neutral-500 whitespace-nowrap">
                          R$ {ROLE_RATES[member.rateKey].rate.min}–{ROLE_RATES[member.rateKey].rate.max}/h
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Section>
      </Reveal>

      <Reveal>
        <Section
          title="Transferência de conhecimento"
          subtitle="A entrega só está completa com estes artefatos. Não é uma apresentação no final."
          icon={BookOpen}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {KNOWLEDGE_TRANSFER.map(item => (
              <div key={item.title} className="rounded-2xl border border-black/[0.06] bg-white p-5">
                <p className="text-[13px] font-semibold text-neutral-900">{item.title}</p>
                <p className="text-[12px] text-neutral-500 leading-relaxed mt-2">{item.detail}</p>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal>
        <Section title={MATURITY.title} icon={GraduationCap}>
          <p className="text-[13px] text-neutral-600 leading-relaxed mb-4 max-w-3xl">{MATURITY.body}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {MATURITY.axes.map(item => (
              <div key={item.axis} className="rounded-xl border border-black/[0.05] bg-[#fafaf8] px-4 py-3">
                <p className="text-[12px] font-semibold text-neutral-900">{item.axis}</p>
                <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">{item.question}</p>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal>
        <Section
          title="Experiência nas frentes pedidas"
          subtitle={REFERENCES_NOTE}
          icon={ShieldCheck}
        >
          <div className="flex flex-col gap-3">
            {EXPERIENCE.map(item => (
              <div key={item.title} className="rounded-2xl border border-black/[0.06] bg-white p-5">
                <p className="text-[13px] font-semibold text-neutral-900">{item.title}</p>
                <p className="text-[12px] text-neutral-500 leading-relaxed mt-2">{item.detail}</p>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal>
        <Section
          title="Base de preço"
          subtitle="Como o Guia de Valores 2026 sustenta as faixas. A cobrança é por entrega."
          icon={BookOpen}
        >
          <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
            <p className="text-[13px] text-neutral-600 leading-relaxed mb-5">{RATE_BASIS.note}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              {RATE_BASIS.references.map(reference => (
                <div key={reference.category} className="flex items-baseline justify-between gap-3 rounded-xl border border-black/[0.05] bg-[#fafaf8] px-4 py-3">
                  <span className="text-[12px] text-neutral-600">{reference.category}</span>
                  <span className="text-[13px] font-semibold font-mono text-neutral-900 whitespace-nowrap">{reference.range}</span>
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

      <Reveal>
        <Section title="Condições comerciais" icon={Wallet}>
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

      <Reveal>
        <Section title="Fronteiras do escopo" icon={Layers3}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <ScopeCard title="Entra quando a entrega é contratada" items={SCOPE.included} tone="green" />
            <ScopeCard title="Fora desta contratação" items={SCOPE.excluded} tone="neutral" />
          </div>
        </Section>
      </Reveal>

      <Reveal>
        <Section title="Premissas" subtitle="O que sustenta as faixas desta proposta" icon={Info}>
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
            <ul className="space-y-2.5">
              {ASSUMPTIONS.map(assumption => (
                <li key={assumption} className="flex gap-2.5 text-[13px] text-neutral-600 leading-relaxed">
                  <span className="text-neutral-300 mt-0.5">·</span>
                  {assumption}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Badge tone="muted">Gerada em {PROPOSAL_META.date}</Badge>
            <Badge tone="muted">{PROPOSAL_META.briefing}</Badge>
          </div>
        </Section>
      </Reveal>

      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-6 mb-12">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">Próximo passo</p>
              <h2 className="text-[18px] font-semibold mt-1">{NEXT_STEP.title}</h2>
              <p className="text-[13px] text-white/70 leading-relaxed mt-2">{NEXT_STEP.body}</p>
            </div>
          </div>
        </div>
      </Reveal>
    </PageShell>
  )
}

function DeliveryCard({ delivery }: { delivery: Delivery }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[11px] font-mono font-semibold text-neutral-400">{delivery.code}</span>
        <p className="text-[15px] font-semibold text-neutral-900">{delivery.title}</p>
        {delivery.recommended && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Começar por aqui
          </span>
        )}
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${RISK_STYLE[delivery.risk]}`}>
          {RISK_LABEL[delivery.risk]}
        </span>
        <span className="ml-auto text-[12px] text-neutral-400">{delivery.window}</span>
      </div>
      <p className="text-[13px] text-neutral-600 leading-relaxed">{delivery.summary}</p>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 mt-4">
        <p className="text-[18px] font-semibold text-neutral-900 tracking-tight">
          {formatBRL(delivery.investment.min)}–{formatBRL(delivery.investment.max)}
        </p>
        <p className="text-[12px] font-mono text-neutral-400">
          {delivery.weeklyHours}h/semana · {delivery.hours.min === delivery.hours.max ? delivery.hours.min : `${delivery.hours.min}–${delivery.hours.max}`}h · média R$ {delivery.blendedRate.min}–{delivery.blendedRate.max}/h
        </p>
        {delivery.dependsOn && (
          <p className="text-[12px] text-neutral-400">Depende de {delivery.dependsOn}</p>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        <BulletList title="Entregáveis" items={delivery.deliverables} />
        <BulletList title="Critério de aceite" items={delivery.acceptance} />
        <BulletList title="Premissas" items={delivery.assumptions} />
      </div>
      <p className="text-[12px] text-neutral-500 leading-relaxed mt-4 pt-4 border-t border-black/[0.05]">
        <span className="font-medium text-neutral-900">Garantia.</span> {delivery.warranty}
      </p>
    </div>
  )
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-2">{title}</p>
      <ul className="space-y-1.5">
        {items.map(item => (
          <li key={item} className="flex gap-2 text-[12px] text-neutral-600 leading-relaxed">
            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-neutral-300" strokeWidth={1.75} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function PathList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-2">{label}</p>
      <ul className="space-y-1.5">
        {items.map(item => (
          <li key={item} className="text-[12px] text-neutral-600 leading-relaxed">{item}</li>
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
  tone: 'green' | 'neutral'
}) {
  const styles = {
    green: 'bg-emerald-50/60 border-emerald-900/10',
    neutral: 'bg-white border-black/[0.06]',
  }[tone]

  return (
    <div className={`rounded-2xl border p-5 ${styles}`}>
      <p className="text-[12px] font-semibold text-neutral-900 mb-3">{title}</p>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item} className="flex gap-2 text-[12px] text-neutral-600 leading-relaxed">
            <span className="mt-0.5 text-neutral-300">·</span>
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
      <div className="flex items-start gap-2 mb-5">
        {Icon && <Icon className="w-4 h-4 text-neutral-400 mt-1" strokeWidth={1.75} />}
        <div>
          <h2 className="text-[18px] font-semibold text-neutral-900">{title}</h2>
          {subtitle && <p className="text-[13px] text-neutral-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}
