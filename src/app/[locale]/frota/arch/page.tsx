'use client'

import { Reveal } from '@/components/adaptive/ui'
import { AREA_ORDER, AREA_META, projectsByArea, PROJECTS, TEAM } from '@/components/frota/data'
import { ArrowRight } from 'lucide-react'
import { useLocale } from 'next-intl'

const STACK = [
  { name: 'Next.js + Vercel', role: 'Frontend web + deploy sem servidor', layer: 'Plataforma Web' },
  { name: 'Supabase',         role: 'Postgres + pgvector + Auth + API gerenciada', layer: 'Banco de Dados' },
  { name: 'n8n',              role: 'Orquestração do enriquecimento em lotes', layer: 'Coleta & Enriquecimento' },
  { name: 'Apify + SerpAPI',  role: 'Coleta LinkedIn, Instagram, site e notícias', layer: 'Coleta & Enriquecimento' },
  { name: 'OpenAI',           role: 'Embeddings + extração de tópicos por IA', layer: 'IA de Busca' },
  { name: 'Redis',            role: 'Cache para respostas instantâneas', layer: 'Banco de Dados' },
]

const PIPELINE = [
  { step: '1', label: 'Coleta & Enriquecimento', detail: 'HubSpot + LinkedIn, Instagram, site e notícias', color: 'bg-neutral-900' },
  { step: '2', label: 'Banco de Dados',          detail: 'Relacional + busca textual + vetorial (pgvector)', color: 'bg-neutral-700' },
  { step: '3', label: 'IA de Busca',             detail: 'Semântica + híbrida, em linguagem natural', color: 'bg-neutral-500' },
  { step: '4', label: 'Plataforma Web',          detail: 'Chat, dashboard e filtros — Fase 1', color: 'bg-neutral-400' },
]

export default function FrotaArchPage() {
  const locale = useLocale()
  const base = `/${locale}/frota`

  const totalHours = PROJECTS.reduce((s, p) => s + p.hours, 0)
  const fase1Hours = PROJECTS.filter(p => p.area !== 'App Mobile').reduce((s, p) => s + p.hours, 0)
  const fase2Hours = PROJECTS.filter(p => p.area === 'App Mobile').reduce((s, p) => s + p.hours, 0)

  return (
    <div className="max-w-[920px] mx-auto px-6 lg:px-12 py-14 lg:py-20">

      <Reveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-3">Projeto</p>
        <h1 className="text-[28px] lg:text-[34px] font-semibold tracking-[-0.02em] text-neutral-900 mb-2">Arquitetura</h1>
        <p className="text-[14px] text-neutral-500 mb-12">
          Pipeline em 4 camadas. Os dados entram uma vez, são enriquecidos automaticamente
          e ficam prontos para qualquer tipo de busca — do filtro exato à pergunta conceitual.
        </p>
      </Reveal>

      {/* Pipeline visual */}
      <Reveal className="mb-12">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-8">
          <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-400 mb-7">
            Pipeline em 4 camadas
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {PIPELINE.map((p, i) => (
              <div key={p.step} className="relative">
                <div className={`rounded-xl p-5 text-white ${p.color}`}>
                  <span className="text-[11px] font-medium opacity-50 mb-2 block">{p.step}</span>
                  <p className="text-[13px] font-semibold leading-tight mb-2">{p.label}</p>
                  <p className="text-[11px] opacity-60 leading-relaxed">{p.detail}</p>
                </div>
                {i < PIPELINE.length - 1 && (
                  <div className="hidden sm:flex absolute -right-1.5 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-3 h-3 text-neutral-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Camadas com horas */}
      <Reveal className="mb-12">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-[15px] font-semibold text-neutral-900">Camadas & esforço</h2>
          <div className="flex gap-4 text-[12px] text-neutral-400">
            <span>Fase 1: <strong className="text-neutral-700">{fase1Hours}h</strong></span>
            <span>Fase 2: <strong className="text-neutral-700">{fase2Hours}h</strong></span>
            <span>Total: <strong className="text-neutral-700">{totalHours}h</strong></span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {AREA_ORDER.map((area) => {
            const meta = AREA_META[area]
            const Icon = meta.icon
            const projects = projectsByArea(area)
            const areaHours = projects.reduce((s, p) => s + p.hours, 0)

            return (
              <div key={area} className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-black/[0.04] bg-black/[0.01]">
                  <div className="w-8 h-8 rounded-full bg-black/[0.06] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-neutral-500" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-neutral-900">{area}</p>
                    <p className="text-[11px] text-neutral-400">{meta.owner} · {meta.phase}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] font-semibold text-neutral-900">{areaHours}h</p>
                    <p className="text-[10px] text-neutral-400">{projects.length} módulos</p>
                  </div>
                </div>
                <div className="divide-y divide-black/[0.03]">
                  {projects.map(p => (
                    <div key={p.name} className="px-5 py-3 flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        p.priority === 'high' ? 'bg-rose-400' :
                        p.priority === 'medium' ? 'bg-amber-400' : 'bg-neutral-300'
                      }`} />
                      <p className="text-[13px] text-neutral-700 flex-1">{p.name}</p>
                      <span className="text-[12px] text-neutral-400 font-mono flex-shrink-0">{p.hours}h</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Reveal>

      {/* Stack */}
      <Reveal className="mb-12">
        <h2 className="text-[15px] font-semibold text-neutral-900 mb-5">Stack tecnológico</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STACK.map(s => (
            <div key={s.name} className="rounded-xl border border-black/[0.06] bg-white p-5">
              <p className="text-[14px] font-semibold text-neutral-900 mb-1">{s.name}</p>
              <p className="text-[12px] text-neutral-400 leading-relaxed">{s.role}</p>
              <span className="mt-3 inline-block text-[10px] text-neutral-400 bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded-full">
                {s.layer}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-neutral-400">
          Tudo cloud-gerenciado — sem servidor próprio para manter, escala conforme o uso.
        </p>
      </Reveal>

      {/* Time */}
      <Reveal>
        <h2 className="text-[15px] font-semibold text-neutral-900 mb-5">Equipe de entrega</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TEAM.map(m => (
            <div key={m.name} className="rounded-xl border border-black/[0.06] bg-white p-5">
              <div className={`w-9 h-9 rounded-full ${m.color} text-white flex items-center justify-center text-[12px] font-semibold mb-4`}>
                {m.initials}
              </div>
              <p className="text-[14px] font-semibold text-neutral-900">{m.name}</p>
              <p className="text-[12px] text-neutral-400 mt-0.5 mb-3">{m.role}</p>
              <div className="flex flex-wrap gap-1">
                {m.focus.map(f => (
                  <span key={f} className="text-[10px] text-neutral-500 bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded-full">
                    {f}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-neutral-400 mt-3">{m.hoursPerWeek}h/sem alocadas</p>
            </div>
          ))}
        </div>
      </Reveal>

    </div>
  )
}
