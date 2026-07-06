import { PROJECT_STATUS_META, PRIORITY_META, type Project } from './data'
import { Badge } from './ui'

export function ProjectCard({ project, showArea = false }: { project: Project; showArea?: boolean }) {
  const status = PROJECT_STATUS_META[project.status]
  const priority = PRIORITY_META[project.priority]

  return (
    <div className="group rounded-xl border border-black/[0.06] bg-white p-5 hover:border-black/[0.12] hover:shadow-[0_2px_18px_rgba(0,0,0,0.04)] transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[14px] font-semibold text-neutral-900 leading-snug">{project.name}</h3>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>

      <div className="mt-4 flex items-center gap-3 pt-3 border-t border-black/[0.05] flex-wrap">
        <span className="flex items-center gap-1.5 text-[12px] text-neutral-400">
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          <span className="text-neutral-600 font-medium">{priority.label}</span>
        </span>
        <span className="text-neutral-200">·</span>
        <span className="text-[12px] text-neutral-500">
          Solicitante <span className="text-neutral-700 font-medium">{project.requester}</span>
        </span>
        {showArea && (
          <>
            <span className="text-neutral-200">·</span>
            <span className="text-[12px] text-neutral-400">{project.area}</span>
          </>
        )}
      </div>
    </div>
  )
}
