'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { PageHeader, Reveal } from '@/components/adaptive/ui'
import { B2BProcessCanvas } from '@/components/adaptive/b2b-process/b2b-process-view'
import {
  AgentsCoverageMap,
  AgentHandoffFlow,
  AgentLoopDiagram,
  AiOpportunitiesByStage,
  AgentSquadCards,
} from '@/components/adaptive/b2b-process/agents-map'
import {
  OTD_AI_PLAN_INTRO,
  OTD_KPIS,
  OTD_PLAN_SUMMARY,
  OTD_QUICK_WINS,
  OTD_ROI_MODEL,
} from '@/lib/adaptive/b2b-process/quick-wins'
import { OTD_AGENTS, OTD_AI_OPPORTUNITIES } from '@/lib/adaptive/b2b-process/agents'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Bot,
  Brain,
  Calculator,
  Network,
  Repeat,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react'

function Section({
  id, eyebrow, title, subtitle, icon: Icon, children,
}: {
  id: string
  eyebrow: string
  title: string
  subtitle: string
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <section id={id} className="mt-14 scroll-mt-6">
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-4 h-4 text-neutral-400" strokeWidth={1.75} />
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400">{eyebrow}</p>
        </div>
        <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-neutral-900">{title}</h2>
        <p className="text-[13px] text-neutral-500 mt-1.5 max-w-3xl leading-relaxed">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}

export default function ProcessoB2BPage() {
  const locale = useLocale()
  const base = `/${locale}/adaptive`

  return (
    <div className="px-4 lg:px-8 py-8 lg:py-10 max-w-[1600px] mx-auto">
      <PageHeader
        eyebrow="Documento · Jornada B2B"
        title={
          <>
            Order-to-delivery
            <br />
            <span className="text-neutral-400">intervenções → quick wins</span>
          </>
        }
        subtitle={OTD_PLAN_SUMMARY.formula}
      />

      <Reveal>
        <div className="mb-6 grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: 'Intervenções manuais', value: String(OTD_QUICK_WINS.length) },
            { label: 'Quick wins OTD', value: String(OTD_QUICK_WINS.length) },
            { label: 'Oportunidades de IA', value: String(OTD_AI_OPPORTUNITIES.length) },
            { label: 'Agentes', value: String(OTD_AGENTS.length) },
            { label: 'Entrega-mãe', value: 'Adaptive Layer™' },
          ].map(m => (
            <div key={m.label} className="rounded-xl border border-black/[0.06] bg-white px-4 py-3">
              <p className="text-[18px] font-semibold text-neutral-900 leading-none">{m.value}</p>
              <p className="text-[11px] text-neutral-500 mt-1.5">{m.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {[
            { href: '#leitura-ia', label: 'Introdução por IA' },
            { href: '#quick-wins', label: 'Intervenções e ganhos' },
            { href: '#kpi-roi', label: 'KPIs e ROI' },
            { href: '#oportunidades-ia', label: 'Oportunidades de IA' },
            { href: '#squad-agentes', label: 'Squad de agentes' },
            { href: '#atuacao-agentes', label: 'Atuação por etapa' },
            { href: '#handoffs', label: 'Handoffs de um pedido' },
          ].map(a => (
            <a
              key={a.href}
              href={a.href}
              className="px-3 py-1.5 rounded-full border border-black/[0.08] bg-white text-[12px] font-medium text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 transition-colors"
            >
              {a.label}
            </a>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="mb-6 flex flex-wrap gap-3 text-[13px]">
          <Link
            href={`${base}/executive-review#plano-de-trabalho`}
            className="inline-flex items-center gap-1.5 font-medium text-neutral-900 underline underline-offset-2"
          >
            Ver plano no Executive Review
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
          <span className="text-neutral-300">·</span>
          <p className="text-neutral-500">
            Owners: {OTD_PLAN_SUMMARY.owners}
          </p>
        </div>
      </Reveal>

      <Reveal>
        <section
          id="leitura-ia"
          className="mb-6 scroll-mt-6 rounded-2xl border border-violet-900/10 bg-violet-50/60 p-6 lg:p-7"
        >
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
            <div className="lg:w-[36%]">
              <div className="flex items-center gap-2 text-violet-700 mb-3">
                <Brain className="w-4 h-4" strokeWidth={1.75} />
                <p className="text-[11px] font-medium uppercase tracking-[0.16em]">
                  {OTD_AI_PLAN_INTRO.eyebrow}
                </p>
              </div>
              <h2 className="text-[19px] font-semibold tracking-[-0.01em] text-neutral-900 leading-snug">
                {OTD_AI_PLAN_INTRO.title}
              </h2>
              <p className="text-[13px] text-neutral-600 mt-3 leading-relaxed">
                {OTD_AI_PLAN_INTRO.narrative}
              </p>
            </div>
            <div className="flex-1 rounded-xl border border-violet-900/10 bg-white/70 p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-3">
                O que a IA conclui
              </p>
              <div className="space-y-3">
                {OTD_AI_PLAN_INTRO.conclusions.map((conclusion, index) => (
                  <div key={conclusion} className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-semibold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-[12px] text-neutral-700 leading-relaxed">{conclusion}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-neutral-400 mt-4 pt-4 border-t border-violet-900/10 leading-relaxed">
                {OTD_AI_PLAN_INTRO.caveat}
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <B2BProcessCanvas />
      </Reveal>

      <Reveal>
        <section id="quick-wins" className="mt-10 scroll-mt-6">
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-neutral-400" strokeWidth={1.75} />
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                Intervenção → ganho → medição
              </p>
            </div>
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-neutral-900">
              Quick wins = intervenções resolvidas
            </h2>
            <p className="text-[13px] text-neutral-500 mt-1.5 max-w-3xl leading-relaxed">
              O detalhe de cada passagem manual, o risco que ela cria, o ganho esperado e os indicadores que
              comprovam o resultado depois da implantação.
            </p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {OTD_QUICK_WINS.map(qw => (
              <div
                key={qw.id}
                className="rounded-2xl border border-black/[0.06] bg-white p-5 lg:p-6"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[11px] font-mono text-emerald-700">{qw.id}</span>
                  {qw.pilot && (
                    <span className="text-[9px] font-semibold uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5">
                      Piloto
                    </span>
                  )}
                  <span className="text-[10px] text-neutral-400 ml-auto">
                    {qw.stageLabel} · {qw.area}
                  </span>
                </div>
                <h3 className="text-[14px] font-semibold text-neutral-900">{qw.title}</h3>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border border-rose-900/10 bg-rose-50/50 p-4">
                    <p className="text-[10px] font-medium uppercase tracking-[0.13em] text-rose-700/70 mb-1.5">
                      Intervenção atual
                    </p>
                    <p className="text-[12px] font-medium text-rose-900/80">{qw.intervention}</p>
                    <p className="text-[11px] text-neutral-600 mt-1.5 leading-relaxed">{qw.interventionDetail}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-amber-900/10 bg-amber-50/50 p-4">
                      <p className="text-[10px] font-medium uppercase tracking-[0.13em] text-amber-700/70 mb-1.5">
                        Risco para o negócio
                      </p>
                      <p className="text-[11px] text-neutral-700 leading-relaxed">{qw.businessRisk}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-900/10 bg-emerald-50/50 p-4">
                      <p className="text-[10px] font-medium uppercase tracking-[0.13em] text-emerald-700/70 mb-1.5">
                        Ganho esperado
                      </p>
                      <p className="text-[11px] text-neutral-700 leading-relaxed">{qw.expectedGain}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.13em] text-neutral-400 mb-2">
                    Como medir
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {qw.kpis.map(kpi => (
                      <span
                        key={kpi}
                        className="text-[10px] text-neutral-600 rounded-full border border-black/[0.06] bg-[#fafaf8] px-2.5 py-1"
                      >
                        {kpi}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-3">{qw.source}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <Section
          id="kpi-roi"
          eyebrow="Business case"
          title="KPIs e ROI para a empresa"
          subtitle="Baseline no M0, acompanhamento durante os quick wins e comprovação do benefício após o OTD estabilizado — sem prometer economia antes de medir."
          icon={BarChart3}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {OTD_KPIS.map(kpi => {
              const DirectionIcon = kpi.direction === 'reduzir' ? ArrowDown : ArrowUp
              return (
                <div key={kpi.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[13px] font-semibold text-neutral-900">{kpi.label}</h3>
                    <span
                      className={`rounded-full p-1.5 ${
                        kpi.direction === 'reduzir'
                          ? 'bg-sky-50 text-sky-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      <DirectionIcon className="w-3.5 h-3.5" strokeWidth={2} />
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-2 leading-relaxed">{kpi.purpose}</p>
                  <div className="mt-4 pt-3 border-t border-black/[0.05]">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">Fórmula</p>
                    <p className="text-[11px] font-mono text-neutral-700 mt-1 leading-relaxed">{kpi.formula}</p>
                    <p className="text-[10px] text-neutral-400 mt-3">
                      {kpi.owner} · {kpi.cadence}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-6 lg:p-7">
            <div className="flex flex-col xl:flex-row gap-7">
              <div className="xl:w-[32%]">
                <div className="flex items-center gap-2 text-emerald-400 mb-3">
                  <Calculator className="w-4 h-4" strokeWidth={1.75} />
                  <p className="text-[11px] font-medium uppercase tracking-[0.15em]">Modelo de retorno</p>
                </div>
                <h3 className="text-[18px] font-semibold">{OTD_ROI_MODEL.title}</h3>
                <p className="text-[12px] text-white/55 mt-3 leading-relaxed">{OTD_ROI_MODEL.principle}</p>
                <div className="mt-5 space-y-2">
                  {OTD_ROI_MODEL.formulas.map(formula => (
                    <p key={formula} className="text-[11px] font-mono text-white/70 leading-relaxed">
                      {formula}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/35 mb-3">
                  Alavancas de valor
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {OTD_ROI_MODEL.valueLevers.map(lever => (
                    <div key={lever.label} className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
                      <p className="text-[12px] font-semibold text-white">{lever.label}</p>
                      <p className="text-[11px] font-mono text-emerald-300 mt-1.5">{lever.formula}</p>
                      <p className="text-[10px] text-white/40 mt-2 leading-relaxed">{lever.examples}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.08]">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/35 mb-2">
                    Dados que o M0 precisa capturar
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {OTD_ROI_MODEL.baselineInputs.map(input => (
                      <span key={input} className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[10px] text-white/60">
                        {input}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </Reveal>

      <Reveal>
        <Section
          id="oportunidades-ia"
          eyebrow="Camada de IA"
          title="Oportunidades de IA na jornada"
          subtitle="Cada oportunidade nasce de uma exceção real do order-to-delivery e só fica viável depois que o quick win correspondente limpa a etapa."
          icon={Sparkles}
        >
          <AiOpportunitiesByStage />
        </Section>
      </Reveal>

      <Reveal>
        <Section
          id="squad-agentes"
          eyebrow="Squad"
          title="Os agentes do order-to-delivery"
          subtitle="Um agente por bloco de exceções da jornada — todos operando sobre a mesma Adaptive Layer™, não sobre planilhas paralelas."
          icon={Bot}
        >
          <AgentSquadCards />
        </Section>
      </Reveal>

      <Reveal>
        <Section
          id="atuacao-agentes"
          eyebrow="Novo desenho"
          title="Como os agentes atuam em cada etapa"
          subtitle="Mapa de cobertura: quem é dono da exceção, quem apoia e o que cada agente entrega nas 9 macroetapas do processo."
          icon={Network}
        >
          <AgentsCoverageMap />
        </Section>
      </Reveal>

      <Reveal>
        <Section
          id="handoffs"
          eyebrow="Ponta a ponta"
          title="Um pedido atravessando o squad"
          subtitle="O mesmo pedido com ruptura, bloqueio de crédito e atraso de transporte — resolvido por handoffs entre agentes, sem back-office como integração humana."
          icon={ArrowRight}
        >
          <AgentHandoffFlow />
        </Section>
      </Reveal>

      <Reveal>
        <Section
          id="ciclo-agente"
          eyebrow="Anatomia"
          title="O ciclo de qualquer agente"
          subtitle="Observa, detecta, decide, age e registra — o histórico auditável volta para a camada e melhora a próxima decisão."
          icon={Repeat}
        >
          <AgentLoopDiagram />
        </Section>
      </Reveal>
    </div>
  )
}
