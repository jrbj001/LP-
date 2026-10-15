import type { ReactNode } from 'react'
import Link from 'next/link'
import { WorkspacePageHeader } from '@/components/client/workspace-page'
import type { Glp1TaskState } from '@/lib/plans/likeme-glp1'
import { Glp1JourneyDiagram } from './likeme-glp1-journey'
import { Glp1MissionBoard } from './likeme-glp1-mission-board'
import { Glp1RoadmapDiagram } from './likeme-glp1-roadmap'
import {
  CODE_GAP,
  CODE_NOW,
  EFFORT_SIZES,
  GLP1_META,
  JOURNEY,
  MISSIONS,
  OFFERS,
  OPEN_VALIDATIONS,
  ROADMAP,
  START_STEPS,
  TEAM_ASSUMPTION,
  TRANSVERSAL,
  missionEffortDays,
  planEffortDays,
} from './likeme-glp1-workplan-data'

export function LikeMeGlp1WorkplanView({
  locale,
  clientSlug,
  accent,
  taskStates,
  backlogReady,
}: {
  locale: string
  clientSlug: string
  accent: string
  taskStates: Glp1TaskState[]
  backlogReady: boolean
}) {
  const base = `/${locale}/client/${clientSlug}`
  const totalDays = planEffortDays()

  return (
    <div className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8 xl:px-10 2xl:px-14">
      <WorkspacePageHeader
        eyebrow={`${GLP1_META.client} · Plano de trabalho`}
        title={GLP1_META.title}
        description={`${GLP1_META.provider}. Programa fechado de 12 semanas por ${GLP1_META.price}. Atualizado em ${GLP1_META.date}.`}
        backHref={`${base}/documentos`}
      />

      <div className="mb-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Meta label="Provider" value="Dr. Matheus" />
        <Meta label="Oferta no app" value="R$ 7.000 · até 3x" />
        <Meta label="Esforço total" value={`${totalDays} dias · 2 devs`} />
        <Meta label="Piloto" value="17/12 · 1º paciente" />
      </div>

      <Section
        number="01"
        title="A jornada vetorizada"
        subtitle="O quadro branco vira o mapa que o time executa. A consulta inicial fica fora do app."
      >
        <Glp1JourneyDiagram />
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {JOURNEY.map(stage => (
            <article key={stage.id} className="rounded-xl border border-black/[0.07] bg-white p-4">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[13px] font-semibold text-neutral-950">
                  <span className="mr-2 font-mono text-[11px]" style={{ color: accent }}>
                    {stage.id.padStart(2, '0')}
                  </span>
                  {stage.title}
                </h3>
                <span className="shrink-0 text-[10px] text-neutral-400">{stage.owner}</span>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-neutral-600">{stage.summary}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-neutral-500">
                <span className="font-medium text-neutral-700">App. </span>
                {stage.app}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-neutral-500">
                <span className="font-medium text-neutral-700">Tabia. </span>
                {stage.tabia}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section number="02" title="Oferta" subtitle="Três produtos. Só o programa fechado e a recompra passam pela Like:Me.">
        <div className="overflow-x-auto rounded-2xl border border-black/[0.07] bg-white">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-black/[0.06] text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                <th className="px-4 py-3 font-medium">Programa</th>
                <th className="px-4 py-3 font-medium">Inclui</th>
                <th className="px-4 py-3 font-medium">Preço</th>
                <th className="px-4 py-3 font-medium">Onde</th>
              </tr>
            </thead>
            <tbody>
              {OFFERS.map(offer => (
                <tr key={offer.name} className="border-b border-black/[0.04] last:border-0">
                  <td className="px-4 py-3 align-top">
                    <p className="text-[13px] font-semibold text-neutral-950">{offer.name}</p>
                    <p className="mt-1 text-[11px] text-neutral-400">{offer.type}</p>
                  </td>
                  <td className="px-4 py-3 align-top text-[12px] leading-relaxed text-neutral-600">{offer.includes}</td>
                  <td className="px-4 py-3 align-top text-[12px] text-neutral-800">{offer.price}</td>
                  <td className="px-4 py-3 align-top text-[12px] text-neutral-500">{offer.where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        number="03"
        title="O que o código já faz"
        subtitle="Leitura de likeme-front-end e likeme-back-end. Isto se reaproveita; não se reconstrói."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {CODE_NOW.map(item => (
            <article key={item.title} className="rounded-xl border border-black/[0.07] bg-white p-4">
              <h3 className="text-[13px] font-semibold text-neutral-950">{item.title}</h3>
              <p className="mt-2 text-[12px] leading-relaxed text-neutral-600">{item.detail}</p>
              <p className="mt-2 font-mono text-[10px] text-neutral-400">{item.where}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        number="04"
        title="O que ainda não existe no repositório"
        subtitle="Memed, Amigo, Tabia e teleconsulta não aparecem no código atual."
      >
        <ul className="grid gap-2">
          {CODE_GAP.map(item => (
            <li key={item} className="rounded-xl border border-black/[0.07] bg-white px-4 py-3 text-[12px] leading-relaxed text-neutral-700">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        number="05"
        title="Roadmap"
        subtitle="Kick-off em 2 de novembro. Quatro releases até 3 de dezembro e o primeiro paciente em 17 de dezembro."
      >
        <Glp1RoadmapDiagram />
        <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_1fr]">
          <div className="overflow-x-auto rounded-2xl border border-black/[0.07] bg-white">
            <table className="w-full min-w-[520px] text-left">
              <thead>
                <tr className="border-b border-black/[0.06] text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                  <th className="px-4 py-3 font-medium">Missão</th>
                  <th className="px-4 py-3 font-medium">Janela</th>
                  <th className="px-4 py-3 font-medium">Stories</th>
                  <th className="px-4 py-3 font-medium">Esforço</th>
                </tr>
              </thead>
              <tbody>
                {MISSIONS.map(mission => (
                  <tr key={mission.id} className="border-b border-black/[0.04] last:border-0">
                    <td className="px-4 py-3 align-top">
                      <p className="text-[13px] font-semibold text-neutral-950">
                        <span className="mr-2 font-mono text-[11px]" style={{ color: accent }}>
                          {mission.id}
                        </span>
                        {mission.name}
                      </p>
                    </td>
                    <td className="px-4 py-3 align-top text-[12px] text-neutral-600">{mission.window.label}</td>
                    <td className="px-4 py-3 align-top text-[12px] text-neutral-600">{mission.tasks.length}</td>
                    <td className="px-4 py-3 align-top text-[12px] font-medium text-neutral-800">
                      {missionEffortDays(mission)} dias
                    </td>
                  </tr>
                ))}
                <tr className="bg-neutral-50">
                  <td className="px-4 py-3 text-[12px] font-semibold text-neutral-950" colSpan={3}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-[12px] font-semibold text-neutral-950">{totalDays} dias</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid gap-3">
            <article className="rounded-2xl border border-black/[0.07] bg-white p-4">
              <h3 className="text-[13px] font-semibold text-neutral-950">{TEAM_ASSUMPTION.title}</h3>
              <ul className="mt-2 grid gap-1.5">
                {TEAM_ASSUMPTION.items.map(item => (
                  <li key={item} className="text-[11px] leading-relaxed text-neutral-600">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[10px] text-neutral-400">
                Tamanhos: P {EFFORT_SIZES.P} · M {EFFORT_SIZES.M} · G {EFFORT_SIZES.G}
              </p>
            </article>
            <article className="rounded-2xl border border-black/[0.07] bg-white p-4">
              <h3 className="text-[13px] font-semibold text-neutral-950">Leitura do calendário</h3>
              <ul className="mt-2 grid gap-1.5">
                {ROADMAP.notes.map(item => (
                  <li key={item} className="text-[11px] leading-relaxed text-neutral-600">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </Section>

      <Section
        number="06"
        title="Missões e user stories"
        subtitle="Marque o que vai para o backlog. Ao enviar, cada story vira card na coluna User Story e o enriquecimento agent-ready lê os repositórios e a leva para Pronta p/ agent."
      >
        <Glp1MissionBoard
          clientId={clientSlug}
          base={base}
          accent={accent}
          initialStates={taskStates}
          backlogReady={backlogReady}
        />
      </Section>

      <Section
        number="07"
        title="Como iniciar as tarefas"
        subtitle="O backlog da jornada já está escrito. O trabalho agora é abrir a Missão 1 nos boards, não redesenhar o quadro."
      >
        <ol className="grid gap-3">
          {START_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-3 rounded-xl border border-black/[0.07] bg-white p-4">
              <span className="font-mono text-[12px] font-semibold" style={{ color: accent }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-[13px] font-semibold text-neutral-950">{step.title}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-neutral-600">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-[12px] leading-relaxed text-neutral-500">
          Os cards nascem em{' '}
          <Link href={`${base}/backlog`} className="font-medium text-neutral-800 underline-offset-2 hover:underline">
            Backlog
          </Link>
          . Story entra na coluna story; requisito entra em requirement. O caminho até o código é story → ready → dev → done.
          O espelho disso no banco do Cadence é cadence_cards, filtrado pelo cliente Like:Me.
        </p>
      </Section>

      <Section number="08" title="Trilhas que atravessam as missões" subtitle="Entram no card quando a missão tocar nelas. Não abrem um quinto board.">
        <div className="grid gap-3 md:grid-cols-2">
          {TRANSVERSAL.map(item => (
            <article key={item.title} className="rounded-xl border border-black/[0.07] bg-white p-4">
              <h3 className="text-[13px] font-semibold text-neutral-950">{item.title}</h3>
              <p className="mt-2 text-[12px] leading-relaxed text-neutral-600">{item.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section number="09" title="Ainda por validar" subtitle="Estes pontos estão em aberto na planilha. Não viram premissa de desenvolvimento.">
        <ul className="grid gap-2 sm:grid-cols-2">
          {OPEN_VALIDATIONS.map(item => (
            <li key={item} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] leading-relaxed text-amber-950">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[11px] leading-relaxed text-neutral-400">
          Fontes: {GLP1_META.sources.join(' · ')}
        </p>
      </Section>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/[0.07] bg-white px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400">{label}</p>
      <p className="mt-1 text-[14px] font-semibold text-neutral-950">{value}</p>
    </div>
  )
}

function Section({
  number,
  title,
  subtitle,
  children,
}: {
  number: string
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <section className="mb-12">
      <div className="mb-4">
        <p className="font-mono text-[10px] tracking-[0.16em] text-neutral-400">{number}</p>
        <h2 className="mt-1 text-[18px] font-semibold tracking-[-0.02em] text-neutral-950">{title}</h2>
        <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-neutral-500">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}
