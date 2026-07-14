'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { PageShell, PageHeader, Reveal, Badge } from '@/components/adaptive/ui'
import { ProjectCard } from '@/components/adaptive/project-card'
import { JourneyStrip } from '@/components/adaptive/journey-strip'
import {
  STAKEHOLDERS, findStakeholder, projectsByRequester, CLIENT, hasFullAccess,
  PROJECTS, AREA_ORDER, AREA_OWNERS, projectsByArea,
} from '@/components/adaptive/data'
import { readOnboard, readMyAreaName, writeMyAreaName } from '@/lib/adaptive/storage'
import { ArrowRight, ChevronDown, Star, Crown, Users } from 'lucide-react'

export default function MyAreaPage() {
  const locale = useLocale()
  const base = `/${locale}/adaptive`
  const [selected, setSelected] = useState<string | null>(null)
  const [whatsapp, setWhatsapp] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const onboard = readOnboard()
    const areaName = readMyAreaName()
    if (onboard?.stakeholder && findStakeholder(onboard.stakeholder)) {
      setSelected(onboard.stakeholder)
      setWhatsapp(onboard.whatsapp || null)
    } else if (areaName && findStakeholder(areaName)) {
      setSelected(areaName)
    }
    setReady(true)
  }, [])

  function choose(name: string) {
    setSelected(name)
    writeMyAreaName(name)
  }
  function reset() {
    setSelected(null)
  }

  if (!ready) return <PageShell><div className="h-[40vh]" /></PageShell>

  // ── Selection screen ──
  if (!selected) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Passo 2 · Meus projetos"
          title="Quem é você?"
          subtitle={`Se ainda não começou pelo convite do Diego, selecione seu nome. O ideal é passar por Começar (WhatsApp) antes do assessment.`}
        />
        <JourneyStrip current="projects" />

        <div className="mb-6 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-[13px] text-neutral-600">
          Prefere o fluxo completo?{' '}
          <a href={`${base}/onboard`} className="font-semibold text-neutral-900 underline underline-offset-2">
            Começar com identificação + WhatsApp
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STAKEHOLDERS.map((s, i) => {
            const full = hasFullAccess(s)
            const count = full ? PROJECTS.length : projectsByRequester(s.name).length
            return (
              <Reveal key={s.name} delay={i * 0.03}>
                <button
                  onClick={() => choose(s.name)}
                  className={`group w-full text-left rounded-xl border bg-white p-5 hover:shadow-[0_2px_18px_rgba(0,0,0,0.05)] transition-all duration-200 ${
                    full ? 'border-neutral-900/20 hover:border-neutral-900/40' : 'border-black/[0.06] hover:border-black/[0.14]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[13px] font-semibold flex-shrink-0">
                      {s.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[14px] font-semibold text-neutral-900 truncate">{s.name}</p>
                        {s.sponsor && <Crown className="w-3.5 h-3.5 text-neutral-900 fill-neutral-900 flex-shrink-0" strokeWidth={0} />}
                        {s.facilitator && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" strokeWidth={0} />}
                        {s.consultant && <Users className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" strokeWidth={2} />}
                      </div>
                      <p className="text-[12px] text-neutral-400 truncate">{s.role ?? s.areas.join(' · ')}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" strokeWidth={2} />
                  </div>
                  <div className="mt-4 pt-3 border-t border-black/[0.05] flex items-center justify-between gap-2">
                    <span className="text-[12px] text-neutral-500">
                      {full ? `${count} projetos · visão completa` : `${count} ${count === 1 ? 'projeto' : 'projetos'}`}
                    </span>
                    {s.sponsor && <Badge tone="neutral">Sponsor</Badge>}
                    {s.facilitator && <Badge tone="amber">Facilitador</Badge>}
                    {s.consultant && <Badge tone="muted">Consultor</Badge>}
                  </div>
                </button>
              </Reveal>
            )
          })}
        </div>
      </PageShell>
    )
  }

  const person = findStakeholder(selected)!
  const full = hasFullAccess(person)
  const projects = full ? PROJECTS : projectsByRequester(selected)
  const identified = Boolean(whatsapp)
  const leadership = STAKEHOLDERS.filter(s => !hasFullAccess(s))

  return (
    <PageShell>
      <div className="mb-6">
        <button onClick={reset} className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-neutral-700 transition-colors">
          <ChevronDown className="w-3.5 h-3.5 rotate-90" strokeWidth={2} />
          Trocar de usuário
        </button>
      </div>

      <PageHeader
        eyebrow={full ? 'Visão completa · Portfólio' : 'Passo 2 · Meus projetos'}
        title={person.name}
        subtitle={
          full
            ? `Apoio à priorização com ${CLIENT.sponsor.name} e ${CLIENT.facilitator.name}. Visão de todos os projetos e stakeholders do ${CLIENT.name}.`
            : `Estes são os projetos do Comitê de TI sob sua responsabilidade — use-os como contexto no assessment.`
        }
      />

      <JourneyStrip current="projects" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border border-black/[0.06] bg-white p-6 flex flex-col sm:flex-row sm:items-center gap-5 mb-10"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="w-11 h-11 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[14px] font-semibold">
            {person.initials}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[14px] font-semibold text-neutral-900">{person.name}</p>
              {person.sponsor && <Badge tone="neutral">Sponsor</Badge>}
              {person.facilitator && <Badge tone="amber">Facilitador</Badge>}
              {person.consultant && <Badge tone="muted">Consultor</Badge>}
            </div>
            <p className="text-[12px] text-neutral-400">
              {person.role ?? person.areas.join(' · ')}
              {person.email ? ` · ${person.email}` : ''}
              {whatsapp ? ` · WhatsApp ${whatsapp}` : ' · WhatsApp pendente'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {full && (
            <>
              <a href={`${base}/onboarding`} className="px-5 py-2.5 rounded-full border border-black/[0.1] text-neutral-700 text-[13px] font-medium hover:bg-black/[0.02]">
                Acompanhamento
              </a>
              <a href={`${base}/dashboard`} className="px-5 py-2.5 rounded-full border border-black/[0.1] text-neutral-700 text-[13px] font-medium hover:bg-black/[0.02]">
                Dashboard
              </a>
            </>
          )}
          {identified ? (
            <a
              href={`${base}/discovery/session`}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-[13px] font-medium hover:bg-neutral-800 transition-all"
            >
              Continuar · Assessment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
            </a>
          ) : (
            <a
              href={`${base}/onboard`}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-[13px] font-medium hover:bg-neutral-800 transition-all"
            >
              Completar identificação
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
            </a>
          )}
        </div>
      </motion.div>

      {full && (
        <div className="mb-8 rounded-xl border border-violet-100 bg-violet-50/60 px-5 py-3.5 text-[13px] text-violet-900 leading-relaxed">
          <strong>Consultoria de priorização:</strong> você tem a mesma visão ampla de Ricardo e Diego —
          portfólio completo e lista de stakeholders. Também passa pelo onboarding (identificação + assessment + agenda)
          para alimentar o Adaptive com a perspectiva de priorização.
        </div>
      )}

      {!full && (
        <div className="mb-8 rounded-xl border border-sky-100 bg-sky-50/70 px-5 py-3.5 text-[13px] text-sky-900 leading-relaxed">
          <strong>Como isso se conecta:</strong> abaixo estão seus projetos já mapeados no Comitê.
          No próximo passo (Assessment) você responde sobre objetivos, desafios e oportunidades —
          especialmente destas iniciativas. Depois agenda 30 min presenciais com a PixelPulseLab.
        </div>
      )}

      {person.facilitator && (
        <div className="mb-8 rounded-xl border border-amber-100 bg-amber-50/60 px-5 py-3.5 flex items-center gap-3">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" strokeWidth={0} />
          <p className="text-[13px] text-amber-800">
            Como facilitador do convite, acompanhe o progresso em{' '}
            <a href={`${base}/onboarding`} className="font-semibold underline underline-offset-2">Acompanhamento</a>
            {' '}e o portfólio abaixo. Felipe e Selton apoiam a priorização com a mesma visão.
          </p>
        </div>
      )}

      {full && (
        <>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-[15px] font-semibold text-neutral-900">Stakeholders no assessment</h2>
            <span className="text-[12px] text-neutral-400">{leadership.length} líderes de área</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {leadership.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.02}>
                <div className="rounded-xl border border-black/[0.06] bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black/[0.06] flex items-center justify-center text-[11px] font-semibold text-neutral-600">
                      {s.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-neutral-900 truncate">{s.name}</p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {s.areas.join(' · ')} · {projectsByRequester(s.name).length} projetos
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-[15px] font-semibold text-neutral-900">Portfólio completo</h2>
            <span className="text-[12px] text-neutral-400">{projects.length} projetos · {AREA_ORDER.length} áreas</span>
          </div>
          <div className="flex flex-col gap-10 mb-10">
            {AREA_ORDER.map((area, ai) => {
              const areaProjects = projectsByArea(area)
              if (areaProjects.length === 0) return null
              const owner = AREA_OWNERS[area]
              return (
                <Reveal key={area} delay={ai * 0.03}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-[15px] font-semibold text-neutral-900">{area}</h3>
                        <span className="text-[12px] text-neutral-400">
                          {areaProjects.length} {areaProjects.length === 1 ? 'projeto' : 'projetos'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-black/[0.06] flex items-center justify-center text-[10px] font-semibold text-neutral-600">
                          {owner?.initials}
                        </div>
                        <span className="text-[12px] text-neutral-500">{owner?.owner}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {areaProjects.map(p => (
                        <ProjectCard key={p.name} project={p} />
                      ))}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </>
      )}

      {!full && (
        <>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-[15px] font-semibold text-neutral-900">Seus projetos no assessment</h2>
            <a href={`${base}/projects`} className="text-[12px] text-neutral-500 hover:text-neutral-800 underline underline-offset-2">
              Ver portfólio completo
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {projects.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.05}>
                <ProjectCard project={p} showArea={person.areas.length > 1} />
              </Reveal>
            ))}
            {projects.length === 0 && (
              <p className="text-[13px] text-neutral-500 col-span-2">
                Nenhum projeto listado no seu nome — mesmo assim complete o assessment sobre a realidade da sua área.
              </p>
            )}
          </div>
        </>
      )}

      {identified && (
        <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-[15px] font-semibold">Pronto para o assessment?</p>
            <p className="text-[13px] text-white/60 mt-1">
              {full
                ? 'Complete o assessment com a visão de priorização · depois agenda de 30 min.'
                : '11 perguntas sobre estes projetos e a operação da área · depois agenda de 30 min.'}
            </p>
          </div>
          <a
            href={`${base}/discovery/session`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-neutral-900 text-[13px] font-medium"
          >
            Ir para o Assessment
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </a>
        </div>
      )}
    </PageShell>
  )
}
