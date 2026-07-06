'use client'

import { PageShell, PageHeader, Reveal, Badge } from '@/components/adaptive/ui'
import { FileText, Download } from 'lucide-react'

const DOCS = [
  { name: 'Adaptive Enterprise™ — Overview', type: 'PDF', size: '2.4 MB', status: 'available' },
  { name: 'Guia da Discovery Session', type: 'PDF', size: '1.1 MB', status: 'available' },
  { name: 'Escopo do Assessment', type: 'PDF', size: '860 KB', status: 'available' },
  { name: 'Executive Review — Relatório Final', type: 'PDF', size: '—', status: 'locked' },
  { name: 'Adaptive Roadmap™', type: 'PDF', size: '—', status: 'locked' },
]

export default function DocumentsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Workspace"
        title="Documentos"
        subtitle="Materiais do assessment e entregáveis. Alguns documentos são liberados ao final do processo."
      />

      <div className="rounded-2xl border border-black/[0.06] bg-white divide-y divide-black/[0.05] overflow-hidden">
        {DOCS.map((doc, i) => (
          <Reveal key={doc.name} delay={i * 0.04}>
            <div className={`flex items-center gap-4 px-6 py-4 ${doc.status === 'available' ? 'hover:bg-black/[0.015]' : 'opacity-60'} transition-colors`}>
              <div className="w-9 h-9 rounded-lg bg-black/[0.03] flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-neutral-400" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-neutral-900 truncate">{doc.name}</p>
                <p className="text-[12px] text-neutral-400">{doc.type} · {doc.size}</p>
              </div>
              {doc.status === 'available' ? (
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-neutral-700 hover:bg-black/[0.04] transition-colors">
                  <Download className="w-3.5 h-3.5" strokeWidth={2} />
                  Baixar
                </button>
              ) : (
                <Badge tone="muted">Em breve</Badge>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </PageShell>
  )
}
