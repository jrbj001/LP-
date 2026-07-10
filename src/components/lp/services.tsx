'use client'

import { FadeIn, FadeInStagger, FadeInItem } from '@/components/fade-in'

const SERVICES = [
  {
    id: 'web',
    num: '01',
    title: 'Plataformas Web',
    description: 'Aplicações full-stack em Next.js com autenticação, painel admin e APIs — otimizadas para performance e escalabilidade.',
    tags: ['Next.js', 'Supabase', 'Vercel'],
  },
  {
    id: 'ai',
    num: '02',
    title: 'IA & Busca Inteligente',
    description: 'Busca semântica, chat em linguagem natural, embeddings e pipelines de enriquecimento com OpenAI e pgvector.',
    tags: ['OpenAI', 'pgvector', 'n8n'],
  },
  {
    id: 'mobile',
    num: '03',
    title: 'Apps Mobile',
    description: 'Apps iOS e Android nativos ou cross-platform integrados com a mesma API da plataforma web — sem duplicação de esforço.',
    tags: ['React Native', 'iOS', 'Android'],
  },
  {
    id: 'data',
    num: '04',
    title: 'Produto de Dados',
    description: 'Dashboards, relatórios interativos e pipelines de dados que transformam bases brutas em inteligência acionável.',
    tags: ['Postgres', 'Redis', 'Analytics'],
  },
]

export function ServicesV2() {
  return (
    <section className="py-28 px-6 bg-white border-t border-neutral-100" id="services">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">
            O que fazemos
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-semibold tracking-[-0.03em] text-neutral-900 max-w-2xl mb-4 leading-[1.1]">
            Da ideia ao produto em produção.
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-[16px] text-neutral-400 max-w-lg mb-16 leading-relaxed">
            Combinamos engenharia, design e IA para entregar produtos que funcionam de verdade — com escopo fechado e milestones claros.
          </p>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SERVICES.map(s => (
            <FadeInItem key={s.id}>
              <div className="group p-8 rounded-2xl border border-neutral-100 hover:border-neutral-200 bg-neutral-50 hover:bg-white hover:shadow-sm transition-all duration-300">
                <div className="flex items-start justify-between mb-5">
                  <span className="text-[12px] font-mono text-neutral-300">{s.num}</span>
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {s.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-medium text-neutral-400 bg-white border border-neutral-200 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="text-[18px] font-semibold text-neutral-900 mb-3">{s.title}</h3>
                <p className="text-[14px] text-neutral-500 leading-relaxed">{s.description}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}
