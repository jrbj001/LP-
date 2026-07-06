'use client'

import { useLocale } from 'next-intl'
import { PageShell, PageHeader, Reveal, Badge } from '@/components/adaptive/ui'
import { ProjectCard } from '@/components/adaptive/project-card'
import { MY_AREA, CLIENT } from '@/components/adaptive/data'
import { ArrowRight } from 'lucide-react'

export default function MyAreaPage() {
  const locale = useLocale()
  const base = `/${locale}/adaptive`
  const area = MY_AREA

  return (
    <PageShell>
      <PageHeader
        eyebrow="Minha Área"
        title={area.area}
        subtitle={`Projetos e prioridades sob sua responsabilidade no assessment do ${CLIENT.name}.`}
      />

      {/* Owner + status card */}
      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 flex flex-col sm:flex-row sm:items-center gap-5 mb-10">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-11 h-11 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[14px] font-semibold">
              {area.ownerInitials}
            </div>
            <div>
              <p className="text-[14px] font-semibold text-neutral-900">{area.owner}</p>
              <p className="text-[12px] text-neutral-400">{CLIENT.champion.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[11px] text-neutral-400">Discovery</p>
              <div className="mt-1">
                <Badge tone={area.discoveryStatus === 'done' ? 'green' : 'amber'}>
                  {area.discoveryStatus === 'pending' ? 'Pending' : area.discoveryStatus === 'in-progress' ? 'Em andamento' : 'Concluído'}
                </Badge>
              </div>
            </div>
            <a
              href={`${base}/discovery/session`}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-[13px] font-medium hover:bg-neutral-800 transition-all"
            >
              Start Discovery
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
            </a>
          </div>
        </div>
      </Reveal>

      {/* Projects */}
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="text-[15px] font-semibold text-neutral-900">Projetos da área</h2>
        <span className="text-[12px] text-neutral-400">{area.projects.length} projetos</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {area.projects.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.05}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </PageShell>
  )
}
