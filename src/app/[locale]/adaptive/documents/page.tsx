'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { PageShell, PageHeader, Reveal, Badge } from '@/components/adaptive/ui'
import { GUIDE_META } from '@/components/guides/valor-hora-data'
import { FileText, Download, ExternalLink } from 'lucide-react'

const DOCS = [
  {
    name: 'Processo B2B — Order-to-delivery + Quick Wins',
    type: 'Página web · React Flow',
    size: 'Jornada completa · intervenções → QWs',
    status: 'available' as const,
    href: '/adaptive/processo-b2b',
    highlight: true,
  },
  {
    name: 'Executive Review — UPDATE (drive OTD)',
    type: 'Página web',
    size: 'Core business · Cris + Selton + CEO',
    status: 'available' as const,
    href: '/adaptive/executive-review',
  },
  {
    name: 'Plano de Trabalho — QWs OTD → Layer → LLM',
    type: 'Página web',
    size: 'Entrega-mãe',
    status: 'available' as const,
    href: '/adaptive/executive-review#plano-de-trabalho',
  },
  {
    name: 'Guia de Valores — Desenvolvimento de Software 2026',
    type: 'Guia web + PDF',
    size: 'Market Guide',
    status: 'available' as const,
    href: '/guides/valor-hora',
    pdf: GUIDE_META.pdfPath,
  },
  {
    name: 'Proposta de Trabalho — Squad, Esforço e Investimento',
    type: 'Página web',
    size: 'Protegida por senha',
    status: 'available' as const,
    href: '/adaptive/proposta',
  },
  { name: 'Adaptive Enterprise™ — Overview', type: 'PDF', size: '2.4 MB', status: 'available' as const },
  { name: 'Guia da Discovery Session', type: 'PDF', size: '1.1 MB', status: 'available' as const },
  { name: 'Escopo do Assessment', type: 'PDF', size: '860 KB', status: 'available' as const },
  { name: 'Executive Review — Relatório Final', type: 'PDF', size: 'liberação pós-review', status: 'locked' as const },
  { name: 'Adaptive Roadmap™', type: 'PDF', size: 'liberação pós-review', status: 'locked' as const },
]

export default function DocumentsPage() {
  const locale = useLocale()

  return (
    <PageShell>
      <PageHeader
        eyebrow="Workspace"
        title="Documentos"
        subtitle="Drive: Order-to-delivery. Materiais do assessment e entregáveis — jornada B2B com plano embutido em destaque."
      />

      <div className="rounded-2xl border border-black/[0.06] bg-white divide-y divide-black/[0.05] overflow-hidden">
        {DOCS.map((doc, i) => (
          <Reveal key={doc.name} delay={i * 0.04}>
            <div
              className={`flex flex-wrap items-center gap-4 px-6 py-4 ${
                doc.status === 'available' ? 'hover:bg-black/[0.015]' : 'opacity-60'
              } ${'highlight' in doc && doc.highlight ? 'bg-emerald-50/40' : ''} transition-colors`}
            >
              <div className="w-9 h-9 rounded-lg bg-black/[0.03] flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-neutral-400" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[14px] font-medium text-neutral-900">{doc.name}</p>
                  {'highlight' in doc && doc.highlight && <Badge tone="green">Destaque</Badge>}
                </div>
                <p className="text-[12px] text-neutral-400">{doc.type} · {doc.size}</p>
              </div>
              {doc.status === 'available' ? (
                <div className="flex items-center gap-2">
                  {'href' in doc && doc.href && (
                    <Link
                      href={`/${locale}${doc.href}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-neutral-700 hover:bg-black/[0.04] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                      Abrir
                    </Link>
                  )}
                  {'pdf' in doc && doc.pdf && (
                    <a
                      href={doc.pdf}
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-neutral-700 hover:bg-black/[0.04] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" strokeWidth={2} />
                      PDF
                    </a>
                  )}
                </div>
              ) : (
                <Badge tone="muted">Bloqueado</Badge>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </PageShell>
  )
}
