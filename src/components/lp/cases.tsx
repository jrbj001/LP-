'use client'

import { FadeIn, FadeInStagger, FadeInItem } from '@/components/fade-in'

const CASES = [
  {
    id: 'frota',
    tag: 'IA · Plataforma Web',
    client: 'SF Network Intelligence',
    project: 'Projeto Frota',
    description: 'Plataforma que transforma 2.410 contatos do HubSpot em uma IA de relacionamento — busca semântica em linguagem natural, enriquecimento automático via LinkedIn/Instagram e dashboard de rede.',
    stack: ['Next.js', 'Supabase', 'pgvector', 'OpenAI', 'n8n'],
    metrics: [
      { n: '2.410', label: 'contatos enriquecidos' },
      { n: '4', label: 'camadas de arquitetura' },
      { n: '~560h', label: 'Fase 1' },
    ],
    status: 'Em build',
    statusColor: 'bg-amber-100 text-amber-700',
    accent: 'bg-neutral-900',
  },
  {
    id: 'orfeu',
    tag: 'IA · Enterprise',
    client: 'Grupo Orfeu',
    project: 'Adaptive Enterprise',
    description: 'Workspace de onboarding e acompanhamento de projetos para clientes enterprise — com módulos de governança, roadmap, área por stakeholder e executive review.',
    stack: ['Next.js', 'Vercel', 'Supabase', 'Tailwind'],
    metrics: [
      { n: '6+', label: 'módulos entregues' },
      { n: '3', label: 'papéis de acesso' },
      { n: '100%', label: 'white-label' },
    ],
    status: 'Em produção',
    statusColor: 'bg-emerald-100 text-emerald-700',
    accent: 'bg-neutral-700',
  },
]

export function CasesV2() {
  return (
    <section className="py-28 px-6 bg-neutral-50 border-t border-neutral-100" id="cases">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">
            Cases recentes
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-semibold tracking-[-0.03em] text-neutral-900 max-w-2xl mb-4 leading-[1.1]">
            Produtos que saíram do papel.
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-[16px] text-neutral-400 max-w-lg mb-16 leading-relaxed">
            Cada projeto tem escopo fechado, milestones definidos e um workspace dedicado para o cliente acompanhar o build em tempo real.
          </p>
        </FadeIn>

        <FadeInStagger className="flex flex-col gap-5">
          {CASES.map(c => (
            <FadeInItem key={c.id}>
              <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:shadow-sm transition-all">
                <div className="grid grid-cols-1 lg:grid-cols-5">

                  {/* Accent panel */}
                  <div className={`${c.accent} lg:col-span-1 p-8 flex flex-col justify-between min-h-[160px] lg:min-h-0`}>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{c.tag}</p>
                    <div>
                      <p className="text-[13px] text-white/50 mb-1">{c.client}</p>
                      <p className="text-[20px] font-semibold text-white leading-tight">{c.project}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-4 p-8">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <p className="text-[14px] text-neutral-500 leading-relaxed max-w-lg">{c.description}</p>
                      <span className={`flex-shrink-0 text-[11px] font-medium px-3 py-1 rounded-full ${c.statusColor}`}>
                        {c.status}
                      </span>
                    </div>

                    {/* Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {c.stack.map(t => (
                        <span key={t} className="text-[11px] text-neutral-500 bg-neutral-50 border border-neutral-100 px-2.5 py-1 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="flex flex-wrap gap-8 pt-5 border-t border-neutral-100">
                      {c.metrics.map(m => (
                        <div key={m.label}>
                          <p className="text-[20px] font-semibold text-neutral-900 tracking-[-0.02em]">{m.n}</p>
                          <p className="text-[12px] text-neutral-400 mt-0.5">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}
