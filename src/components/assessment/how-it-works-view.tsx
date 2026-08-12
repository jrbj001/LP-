'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { PageShell, PageHeader, Reveal, Badge } from '@/components/adaptive/ui'
import {
  ArchitectureFlow, AgentLoop, AgentSquadMap, QwToLayerToAi, BeforeAfterTruth,
} from '@/components/assessment/diagrams'
import type { LayerAgent, LayerCapability, QuickWin } from '@/lib/assessment/types'
import {
  Layers, Cable, Braces, Workflow, ShieldCheck, ArrowRight, CheckCircle2, XCircle, Info,
} from 'lucide-react'

// Metodologia — genérica, sem stack de cliente.
const METHOD_CONNECTS = ['ERP', 'E-commerce', 'CRM', 'BI', 'Logística', 'Pagamentos', 'Atendimento']

const METHOD_UNLOCKS = [
  'Verdade operacional única em tempo real',
  'Fim da consolidação manual e da planilha como fonte',
  'Eventos auditáveis numa linha do tempo',
  'Alertas preventivos antes do fechamento',
  'IA e agentes sobre dado limpo e rastreável',
  'Decisão por antecipação, não por retrovisor',
]

const METHOD_CAPABILITIES: LayerCapability[] = [
  { id: 'integration', title: 'Integração & eventos', detail: 'Conectores dedicados publicam o que importa de cada sistema — sem redigitação e sem integração ponto-a-ponto frágil.' },
  { id: 'data', title: 'Dados unificados', detail: 'Uma linha do tempo por pedido, cliente, produto e canal. Sem BI paralelo, sem planilha como verdade.' },
  { id: 'apis', title: 'APIs & automação', detail: 'Cada quick win consome a mesma API. Toda automação nova amplia a camada, em vez de criar mais um silo.' },
  { id: 'security', title: 'Segurança & LGPD', detail: 'Acesso, auditoria e isolamento por desenho — pré-condição para IA sobre dados reais.' },
]

const METHOD_AGENTS: LayerAgent[] = [
  { id: 'command', name: 'Copiloto Executivo', icon: 'orchestrator', role: 'Resumo do dia, cockpit e consulta em linguagem natural sobre toda a operação.', example: '"Como foi ontem por canal, e o que explica a variação?"', owner: 'Diretoria' },
  { id: 'channel', name: 'Agente de Canal', icon: 'channel', role: 'Receita, ticket, conversão e abandono de cada canal num só lugar.', example: '"Qual canal caiu em conversão esta semana e por quê?"', owner: 'Comercial · Digital' },
  { id: 'inventory', name: 'Agente de Estoque & Ruptura', icon: 'inventory', role: 'Detecta ruptura, estoque crítico e baixo giro antes que virem problema.', example: '"Quais itens entram em ruptura nos próximos 7 dias?"', owner: 'Operações' },
  { id: 'price', name: 'Agente de Preço & Margem', icon: 'price', role: 'Substitui a planilha de simulação: versiona preço e protege a margem.', example: '"Simule −5% no preço do item X sobre a margem por canal."', owner: 'Comercial · Financeiro' },
  { id: 'marketing', name: 'Agente de Marketing', icon: 'marketing', role: 'Lê a mídia na camada: campanhas abaixo da meta, CAC elevado, queda de ROAS.', example: '"Quais campanhas estão abaixo da meta de ROAS agora?"', owner: 'Marketing' },
  { id: 'repurchase', name: 'Agente de Recompra', icon: 'repurchase', role: 'Detecta clientes fora do ciclo e sugere a próxima melhor ação.', example: '"Quais clientes estratégicos estão sem compra e como abordar?"', owner: 'Comercial · CRM' },
]

const METHOD_SEQUENCE: QuickWin[] = [
  { id: '01', stage: 'Quick Win', opportunity: 'Elimina a intervenção manual de uma etapa e organiza o dado na camada.', enabledBy: 'primeiro o fluxo limpo', owner: '' },
  { id: '02', stage: 'Adaptive Layer™', opportunity: 'A camada estabiliza: eventos, verdade única e APIs para as próximas entregas.', enabledBy: 'cada QW amplia a camada', owner: '' },
  { id: '03', stage: 'Agentes & LLM', opportunity: 'Copilotos sobem sobre o fluxo já rastreável — IA sobre ordem, nunca sobre o caos.', enabledBy: 'habilitado pela camada', owner: '', llm: true },
]

/**
 * @param basePath rota base para os CTAs. Recebe a base do tenant quando a
 * metodologia é aberta de dentro de um assessment, para não jogar o cliente
 * em outro workspace.
 */
export function HowItWorksView({ basePath = '/adaptive' }: { basePath?: string }) {
  const locale = useLocale()

  return (
    <PageShell>
      <div className="mb-4">
        <Badge tone="green">Metodologia · Adaptive Enterprise™</Badge>
      </div>
      <PageHeader
        eyebrow="Como funciona"
        title={<>A Adaptive Layer™ — a camada que faz seus sistemas conversarem.</>}
        subtitle="Um guia visual de como conectamos os sistemas que a empresa já tem, criamos uma verdade operacional única e só então colocamos agentes de IA para trabalhar."
      />

      {/* 1. Problema comum */}
      <Reveal>
        <Section eyebrow="01 — O ponto de partida" title="Sistemas bons, verdade fragmentada." icon={Info}>
          <p className="text-[14px] text-neutral-600 leading-relaxed max-w-3xl">
            O padrão se repete em quase toda operação: cada sistema tem a sua própria base, a consolidação é manual e
            a decisão só acontece no fechamento. Não falta software — falta uma camada que faça o que já existe
            conversar sem redigitação, sem planilha e sem consolidação manual no meio da decisão.
          </p>
        </Section>
      </Reveal>

      {/* 2. O que é / não é */}
      <Reveal>
        <Section eyebrow="02 — A entrega-mãe" title="O que a Adaptive Layer™ é — e o que ela não é." icon={Layers}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-rose-900/10 bg-rose-50/40 p-5">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4 text-rose-600" strokeWidth={1.75} />
                <p className="text-[13px] font-semibold text-neutral-900">Não é</p>
              </div>
              <ul className="space-y-2 text-[12px] text-neutral-600">
                {['Um novo ERP ou BI para substituir os atuais', 'Mais uma base de dados paralela', 'Um projeto de "trocar tudo"', 'IA jogada por cima do caos'].map(t => (
                  <li key={t} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
                <p className="text-[13px] font-semibold text-neutral-900">É</p>
              </div>
              <ul className="space-y-2 text-[12px] text-neutral-700">
                {['A camada que conecta os sistemas que já existem', 'Uma verdade operacional única e auditável', 'A base sobre a qual cada quick win amplia a próxima', 'O terreno limpo para agentes e LLM'].map(t => (
                  <li key={t} className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" strokeWidth={1.75} />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </Reveal>

      {/* 3. Arquitetura */}
      <Reveal>
        <Section eyebrow="03 — Arquitetura em uma vista" title="Sistemas atuais → Adaptive Layer™ → o que destrava." icon={Layers}>
          <ArchitectureFlow connects={METHOD_CONNECTS} unlocks={METHOD_UNLOCKS} capabilities={METHOD_CAPABILITIES} />
        </Section>
      </Reveal>

      {/* 4. Capacidades */}
      <Reveal>
        <Section eyebrow="04 — Quatro capacidades" title="O meio-campo entre os sistemas e os agentes." icon={Cable}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {METHOD_CAPABILITIES.map(cap => {
              const Icon = { integration: Cable, data: Braces, apis: Workflow, security: ShieldCheck }[cap.id]
              return (
                <div key={cap.id} className="rounded-xl border border-black/[0.06] bg-white p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" strokeWidth={1.75} />
                    </div>
                    <p className="text-[14px] font-semibold text-neutral-900">{cap.title}</p>
                  </div>
                  <p className="text-[12px] text-neutral-500 leading-relaxed">{cap.detail}</p>
                </div>
              )
            })}
          </div>
        </Section>
      </Reveal>

      {/* 5. Ciclo do agente */}
      <Reveal>
        <Section eyebrow="05 — Como cada agente opera" title="Observa → Detecta → Decide → Age → Registra." icon={Workflow}>
          <AgentLoop />
        </Section>
      </Reveal>

      {/* 6. Ordem de implantação */}
      <Reveal>
        <Section eyebrow="06 — A ordem importa" title="Quick Win → Layer → IA. Nunca o contrário." icon={ArrowRight}>
          <QwToLayerToAi quickWins={METHOD_SEQUENCE} />
          <div className="mt-4">
            <BeforeAfterTruth
              before={{ title: 'Antes — verdade no fechamento', points: ['Cada sistema com a sua base', 'Consolidação manual e planilha como fonte', 'A decisão sai no fechamento mensal', 'IA sobre dado sujo e divergente'] }}
              after={{ title: 'Depois — verdade em tempo real', points: ['Uma linha do tempo por pedido/cliente/canal', 'Eventos auditáveis, sem redigitação', 'Alerta preventivo em até 24h', 'Agentes sobre fluxo limpo e rastreável'] }}
            />
          </div>
        </Section>
      </Reveal>

      {/* 7. Squad de agentes */}
      <Reveal>
        <Section eyebrow="07 — Squad de agentes" title="Vários copilotos, uma única verdade operacional." icon={Layers}>
          <AgentSquadMap agents={METHOD_AGENTS} />
        </Section>
      </Reveal>

      {/* CTA */}
      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <p className="text-[14px] font-semibold">Este é o método. A aplicação é por empresa.</p>
            <p className="text-[12px] text-white/50 mt-1">
              Cada assessment mapeia o stack real do cliente sobre esta mesma camada.
            </p>
          </div>
          <Link
            href={`/${locale}${basePath}/framework`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white text-neutral-900 text-[12px] font-medium px-4 py-2 hover:bg-white/90"
          >
            Ver o framework
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </div>
      </Reveal>
    </PageShell>
  )
}

function Section({
  eyebrow, title, icon: Icon, children,
}: {
  eyebrow: string
  title: React.ReactNode
  icon: typeof Layers
  children: React.ReactNode
}) {
  return (
    <section className="mb-12">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-black/[0.04] flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-neutral-700" strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400">{eyebrow}</p>
          <h2 className="text-[19px] font-semibold text-neutral-900 tracking-tight mt-0.5">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  )
}
