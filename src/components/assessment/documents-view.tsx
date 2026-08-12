'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { PageShell, PageHeader, Reveal, Badge } from '@/components/adaptive/ui'
import type { AssessmentDocument } from '@/lib/assessment/types'
import { FileText, ExternalLink } from 'lucide-react'

export function DocumentsView({ documents }: { documents: AssessmentDocument[] }) {
  const locale = useLocale()

  return (
    <PageShell>
      <PageHeader
        eyebrow="Workspace"
        title="Documentos"
        subtitle="Páginas do assessment e materiais de referência — a metodologia da Adaptive Layer™ em destaque."
      />

      <div className="rounded-2xl border border-black/[0.06] bg-white divide-y divide-black/[0.05] overflow-hidden">
        {documents.map((doc, i) => {
          const internalHref = doc.href ? `/${locale}${doc.href}` : undefined
          return (
            <Reveal key={doc.name} delay={i * 0.04}>
              <div
                className={`flex flex-wrap items-center gap-4 px-6 py-4 ${
                  doc.status === 'available' ? 'hover:bg-black/[0.015]' : 'opacity-60'
                } ${doc.highlight ? 'bg-emerald-50/40' : ''} transition-colors`}
              >
                <div className="w-9 h-9 rounded-lg bg-black/[0.03] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-neutral-400" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[14px] font-medium text-neutral-900">{doc.name}</p>
                    {doc.highlight && <Badge tone="green">Destaque</Badge>}
                  </div>
                  <p className="text-[12px] text-neutral-400">{doc.type} · {doc.size}</p>
                </div>
                {doc.status === 'available' ? (
                  <div className="flex items-center gap-2">
                    {internalHref && (
                      <Link
                        href={internalHref}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-neutral-700 hover:bg-black/[0.04] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                        Abrir
                      </Link>
                    )}
                    {doc.external && (
                      <a
                        href={doc.external}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-neutral-700 hover:bg-black/[0.04] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                        Abrir
                      </a>
                    )}
                  </div>
                ) : (
                  <Badge tone="muted">Bloqueado</Badge>
                )}
              </div>
            </Reveal>
          )
        })}
      </div>
    </PageShell>
  )
}
