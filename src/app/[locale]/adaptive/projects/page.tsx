'use client'

import { PageShell, PageHeader, Reveal } from '@/components/adaptive/ui'
import { ProjectCard } from '@/components/adaptive/project-card'
import { AREA_ORDER, AREA_OWNERS, projectsByArea, PROJECTS, CLIENT } from '@/components/adaptive/data'

export default function ProjectsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Workspace"
        title="Projetos"
        subtitle={`Portfólio do Comitê de TI do ${CLIENT.name} — ${PROJECTS.length} iniciativas em ${AREA_ORDER.length} áreas. Cada projeto será avaliado por prioridade, risco e alinhamento estratégico durante o assessment.`}
      />

      <div className="flex flex-col gap-10">
        {AREA_ORDER.map((area, ai) => {
          const projects = projectsByArea(area)
          if (projects.length === 0) return null
          const owner = AREA_OWNERS[area]
          return (
            <Reveal key={area} delay={ai * 0.03}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[16px] font-semibold text-neutral-900">{area}</h2>
                    <span className="text-[12px] text-neutral-400">
                      {projects.length} {projects.length === 1 ? 'projeto' : 'projetos'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-black/[0.06] flex items-center justify-center text-[10px] font-semibold text-neutral-600">
                      {owner?.initials}
                    </div>
                    <span className="text-[12px] text-neutral-500">{owner?.owner}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects.map(p => (
                    <ProjectCard key={p.name} project={p} />
                  ))}
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </PageShell>
  )
}
