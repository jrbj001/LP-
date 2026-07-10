'use client'

import { Reveal } from '@/components/adaptive/ui'
import { FileText, Layers, Map, Users } from 'lucide-react'
import { useLocale } from 'next-intl'

const DOCS = [
  {
    title: 'Proposta Técnica',
    description: 'Escopo, arquitetura, stack e modelo de investimento do Projeto Frota.',
    icon: FileText,
    status: 'Disponível',
    href: '#',
  },
  {
    title: 'Arquitetura do Sistema',
    description: 'Pipeline em 4 camadas, diagrama de componentes e fluxo de dados.',
    icon: Layers,
    status: 'Disponível',
    href: '/arch',
  },
  {
    title: 'Roadmap & Milestones',
    description: 'Linha do tempo com entregas, horas estimadas e alocação da equipe.',
    icon: Map,
    status: 'Disponível',
    href: '/roadmap',
  },
  {
    title: 'Contrato & NDA',
    description: 'Termos de confidencialidade e contrato de prestação de serviço.',
    icon: FileText,
    status: 'A assinar',
    href: '#',
  },
  {
    title: 'Guia de Acesso — HubSpot',
    description: 'Passo a passo para liberar acesso de leitura ao HubSpot para importação.',
    icon: Users,
    status: 'Pendente',
    href: '#',
  },
]

export default function FrotaDocsPage() {
  const locale = useLocale()
  const base = `/${locale}/frota`

  return (
    <div className="max-w-[920px] mx-auto px-6 lg:px-12 py-14 lg:py-20">

      <Reveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-3">Workspace</p>
        <h1 className="text-[28px] lg:text-[34px] font-semibold tracking-[-0.02em] text-neutral-900 mb-2">Documentos</h1>
        <p className="text-[14px] text-neutral-500 mb-12">
          Proposta, arquitetura, roadmap e documentos contratuais do Projeto Frota.
        </p>
      </Reveal>

      <div className="flex flex-col gap-3">
        {DOCS.map((doc) => {
          const Icon = doc.icon
          const isAvailable = doc.status === 'Disponível'
          const href = isAvailable && doc.href !== '#' ? base + doc.href : doc.href

          return (
            <Reveal key={doc.title}>
              <a
                href={href}
                className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${
                  isAvailable
                    ? 'border-black/[0.06] bg-white hover:border-black/[0.12] cursor-pointer'
                    : 'border-black/[0.04] bg-black/[0.01] cursor-default'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isAvailable ? 'bg-neutral-900' : 'bg-black/[0.06]'
                }`}>
                  <Icon className={`w-4 h-4 ${isAvailable ? 'text-white' : 'text-neutral-400'}`} strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-[14px] font-semibold ${isAvailable ? 'text-neutral-900' : 'text-neutral-400'}`}>
                      {doc.title}
                    </p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                      isAvailable
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : doc.status === 'A assinar'
                        ? 'border-amber-200 bg-amber-50 text-amber-700'
                        : 'border-black/[0.06] bg-black/[0.02] text-neutral-400'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <p className={`text-[13px] ${isAvailable ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {doc.description}
                  </p>
                </div>
                {isAvailable && (
                  <span className="text-[12px] text-neutral-400 self-center flex-shrink-0">→</span>
                )}
              </a>
            </Reveal>
          )
        })}
      </div>

    </div>
  )
}
