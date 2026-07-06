'use client'

import { PageShell, PageHeader, Reveal } from '@/components/adaptive/ui'
import { ProjectCard } from '@/components/adaptive/project-card'
import { MY_AREA } from '@/components/adaptive/data'

// In a real product these would come from all areas; we reuse the sample set.
const ALL_PROJECTS = MY_AREA.projects

export default function ProjectsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Workspace"
        title="Projetos"
        subtitle="Portfólio de iniciativas em análise durante o assessment. Cada projeto é avaliado por prioridade, risco e alinhamento estratégico."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALL_PROJECTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.04}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </PageShell>
  )
}
