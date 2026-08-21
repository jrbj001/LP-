'use client'

import { AlertTriangle, Boxes, GitBranch, Plug, Target } from 'lucide-react'
import { BacklogDiagramView } from '@/components/client/backlog/backlog-diagram'
import type { ArchitectureArtifact, WorkPlanArtifact } from '@/lib/documents/types'

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof Target
  children: React.ReactNode
}) {
  return (
    <h4 className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
      <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
      {children}
    </h4>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map(item => (
        <li key={item} className="flex gap-2 text-[12px] leading-relaxed text-neutral-600">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-300" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function WorkPlanView({ plan, accent }: { plan: WorkPlanArtifact; accent: string }) {
  return (
    <section className="rounded-xl border border-black/[0.07] bg-white p-4 sm:p-5">
      <SectionTitle icon={Target}>Plano de trabalho</SectionTitle>
      <h3 className="mt-2 text-[15px] font-semibold text-neutral-900">{plan.title}</h3>
      <p className="mt-1.5 text-[12px] leading-relaxed text-neutral-500">{plan.summary}</p>

      <ol className="mt-4 space-y-3">
        {plan.milestones.map((milestone, index) => (
          <li key={milestone.id} className="rounded-xl border border-black/[0.06] bg-neutral-50/50 p-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                style={{ backgroundColor: accent }}
              >
                {index + 1}
              </span>
              <h5 className="text-[13px] font-semibold text-neutral-900">{milestone.title}</h5>
              {milestone.window && (
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] text-neutral-500 ring-1 ring-black/[0.06]">
                  {milestone.window}
                </span>
              )}
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-neutral-600">{milestone.objective}</p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Entregáveis
                </p>
                <BulletList items={milestone.deliverables} />
              </div>
              {milestone.acceptanceCriteria.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                    Critérios de aceite
                  </p>
                  <BulletList items={milestone.acceptanceCriteria} />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      {plan.risks.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
          <SectionTitle icon={AlertTriangle}>Riscos</SectionTitle>
          <BulletList items={plan.risks} />
        </div>
      )}
    </section>
  )
}

export function ArchitectureView({ architecture }: { architecture: ArchitectureArtifact }) {
  return (
    <section className="rounded-xl border border-black/[0.07] bg-white p-4 sm:p-5">
      <SectionTitle icon={GitBranch}>Documento de arquitetura</SectionTitle>
      <h3 className="mt-2 text-[15px] font-semibold text-neutral-900">{architecture.title}</h3>
      <p className="mt-1.5 text-[12px] leading-relaxed text-neutral-500">{architecture.overview}</p>

      {architecture.diagram && (
        <div className="mt-4">
          <BacklogDiagramView diagram={architecture.diagram} />
        </div>
      )}

      <div className="mt-4">
        <SectionTitle icon={Boxes}>Componentes</SectionTitle>
        <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
          {architecture.components.map(component => (
            <div key={component.name} className="rounded-xl border border-black/[0.06] bg-neutral-50/50 p-3">
              <h5 className="text-[12px] font-semibold text-neutral-900">{component.name}</h5>
              <p className="mt-1 text-[11px] leading-relaxed text-neutral-600">
                {component.responsibility}
              </p>
              {component.touchpoints.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {component.touchpoints.map(touchpoint => (
                    <span
                      key={touchpoint}
                      className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[9px] text-neutral-500 ring-1 ring-black/[0.06]"
                    >
                      {touchpoint}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {architecture.integrations.length > 0 && (
          <div>
            <SectionTitle icon={Plug}>Integrações</SectionTitle>
            <BulletList items={architecture.integrations} />
          </div>
        )}
        {architecture.decisions.length > 0 && (
          <div>
            <SectionTitle icon={Target}>Decisões</SectionTitle>
            <BulletList items={architecture.decisions} />
          </div>
        )}
      </div>

      {architecture.risks.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
          <SectionTitle icon={AlertTriangle}>Riscos</SectionTitle>
          <BulletList items={architecture.risks} />
        </div>
      )}
    </section>
  )
}
