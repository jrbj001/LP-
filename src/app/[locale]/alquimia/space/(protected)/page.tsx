import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Plus,
} from 'lucide-react'
import { redirect } from 'next/navigation'
import {
  ProgressBar,
  SectionHeader,
  SpacePage,
  StatCard,
} from '@/components/alquimia/space/space-ui'
import { getAlquimiaSession } from '@/lib/alquimia/auth'

const engagements = [
  {
    id: 'aurora-industrial',
    name: 'Aurora Industrial',
    sector: 'Bens de consumo',
    challenge: 'Transformar disciplina operacional em um sistema de gestão que escala.',
    stage: 'Execução',
    status: 'active',
    progress: 64,
    health: 'No ritmo',
    lead: 'Marina Costa',
    next: 'Tollgate de execução · 27 ago',
    initiatives: 8,
  },
  {
    id: 'nexo-servicos',
    name: 'Nexo Serviços',
    sector: 'Serviços B2B',
    challenge: 'Conectar estratégia, accountability e cadência comercial.',
    stage: 'Diagnóstico',
    status: 'attention',
    progress: 24,
    health: 'Atenção',
    lead: 'Rafael Lima',
    next: 'Workshop de gaps · 29 ago',
    initiatives: 3,
  },
]

export default async function AlquimiaPartnerSpacePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await getAlquimiaSession()
  if (!session) redirect(`/${locale}/alquimia/space/login`)
  if (session.role === 'client') {
    const first = session.engagementIds[0]
    if (first) redirect(`/${locale}/alquimia/space/${first}`)
  }

  const base = `/${locale}/alquimia/space`

  return (
    <SpacePage
      eyebrow="Partner command center"
      title="Transformações em movimento"
      description="Uma visão única dos engagements, da capacidade em construção e dos pontos que pedem intervenção."
      action={
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00435D] px-4 py-3 text-[12px] font-semibold text-white transition hover:bg-[#003449]">
          <Plus className="h-4 w-4" />
          Novo engagement
        </button>
      }
    >
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Engagements ativos" value="02" detail="2 setores em transformação" />
        <StatCard label="Iniciativas em curso" value="11" detail="3 pedem decisão esta semana" tone="gold" />
        <StatCard label="Rituais próximos" value="06" detail="Próximos sete dias" tone="lilac" />
        <StatCard label="Saúde do portfólio" value="82%" detail="+6 pontos desde julho" tone="neutral" />
      </section>

      <section id="clientes" className="mt-10">
        <SectionHeader
          eyebrow="Portfólio"
          title="Clientes e engagements"
          detail="Atualizado hoje"
        />
        <div className="grid gap-4 xl:grid-cols-2">
          {engagements.map(engagement => (
            <a
              key={engagement.id}
              href={`${base}/${engagement.id}`}
              className="group rounded-2xl border border-black/[0.07] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#00435D]/25 hover:shadow-[0_16px_40px_rgba(0,67,93,0.08)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#3A5976]">
                    {engagement.sector}
                  </p>
                  <h2 className="mt-1.5 text-[20px] font-semibold tracking-[-0.025em] text-[#003b52]">
                    {engagement.name}
                  </h2>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider ${
                    engagement.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {engagement.status === 'active' ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  {engagement.health}
                </span>
              </div>

              <p className="mt-4 max-w-xl text-[12px] leading-relaxed text-black/45">
                {engagement.challenge}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 border-y border-black/[0.06] py-4 sm:grid-cols-4">
                <MiniStat icon={CircleDot} label="Fase" value={engagement.stage} />
                <MiniStat icon={CalendarDays} label="Próximo" value={engagement.next} />
                <MiniStat icon={CircleDot} label="Lead" value={engagement.lead} />
                <MiniStat icon={CheckCircle2} label="Iniciativas" value={`${engagement.initiatives}`} />
              </div>

              <div className="mt-5 flex items-center gap-4">
                <ProgressBar value={engagement.progress} className="flex-1" />
                <span className="text-[11px] font-semibold text-[#00435D]">
                  {engagement.progress}%
                </span>
                <ArrowRight className="h-4 w-4 text-[#00435D] transition group-hover:translate-x-1" />
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5 sm:p-6">
          <SectionHeader title="Próximos rituais" detail="7 dias" />
          <div className="divide-y divide-black/[0.06]">
            {[
              ['25 ago', 'Daily management review', 'Aurora Industrial', '09:00'],
              ['27 ago', 'Tollgate de execução', 'Aurora Industrial', '14:30'],
              ['29 ago', 'Workshop de gaps', 'Nexo Serviços', '09:00'],
            ].map(item => (
              <div key={item[1]} className="grid grid-cols-[54px_1fr_auto] items-center gap-3 py-3.5">
                <span className="text-[10px] font-semibold uppercase text-[#3A5976]">{item[0]}</span>
                <div>
                  <p className="text-[12px] font-medium text-[#003b52]">{item[1]}</p>
                  <p className="mt-0.5 text-[10px] text-black/35">{item[2]}</p>
                </div>
                <span className="text-[10px] text-black/35">{item[3]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-[#00435D] p-6 text-white">
          <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-[#E0CE7A]/20 blur-2xl" />
          <p className="relative text-[9px] font-semibold uppercase tracking-[0.18em] text-[#E0CE7A]">
            Atenção da semana
          </p>
          <p className="relative mt-4 text-[21px] font-light leading-snug tracking-[-0.025em]">
            Três iniciativas estão sem evidência atualizada há mais de sete dias.
          </p>
          <button className="relative mt-6 inline-flex items-center gap-2 text-[11px] font-semibold text-[#E0CE7A]">
            Revisar bloqueios
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </SpacePage>
  )
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CircleDot
  label: string
  value: string
}) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-black/30">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className="mt-1 truncate text-[10px] font-medium text-[#003b52]">{value}</p>
    </div>
  )
}
