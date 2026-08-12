import Link from 'next/link'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Code2,
  FileCode2,
  GitBranch,
  Layers3,
  TestTube2,
  UserRound,
} from 'lucide-react'
import {
  BACKLOG_BOARDS,
  BACKLOG_COLUMNS,
  type BacklogCard,
  type BacklogDiagram,
} from '@/lib/backlog/types'
import { BacklogDiagramView } from './backlog-diagram'

function fallbackDiagram(card: BacklogCard): BacklogDiagram {
  return {
    title: card.level === 'raw' ? 'Do requisito à entrega' : 'Jornada da user story',
    nodes: [
      {
        id: 'actor',
        label: card.persona || 'PM / Usuário',
        detail: 'Origem da necessidade',
        kind: 'actor',
      },
      {
        id: 'need',
        label: card.want || card.title,
        detail: 'Necessidade do produto',
        kind: 'input',
      },
      {
        id: 'solution',
        label: card.level === 'raw' ? 'Enrichment + revisão PM' : 'Implementação',
        detail: card.context || 'Detalhamento funcional e técnico',
        kind: 'process',
      },
      {
        id: 'result',
        label: card.soThat || 'Valor entregue',
        detail: 'Resultado validado pelos critérios de aceite',
        kind: 'output',
      },
    ],
    edges: [
      { from: 'actor', to: 'need', label: 'expressa' },
      { from: 'need', to: 'solution', label: 'orienta' },
      { from: 'solution', to: 'result', label: 'entrega' },
    ],
  }
}

export function BacklogCardDetail({
  card,
  backHref,
}: {
  card: BacklogCard
  backHref: string
}) {
  const board = BACKLOG_BOARDS.find(item => item.id === card.boardId)
  const column = BACKLOG_COLUMNS.find(item => item.id === card.column)
  const diagram = card.diagram ?? fallbackDiagram(card)

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 py-10 sm:py-14">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-neutral-800 transition-colors mb-7"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Voltar ao backlog
      </Link>

      <header className="border-b border-black/[0.07] pb-7 mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge>{board?.title ?? card.boardId}</Badge>
          <Badge>{column?.label ?? card.column}</Badge>
          <Badge>{card.level === 'spec' ? 'Agent-ready' : card.level}</Badge>
          {card.phase && <Badge>{card.phase}</Badge>}
          {card.priority && <Badge>{card.priority}</Badge>}
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.035em] text-neutral-900 max-w-5xl">
          {card.title}
        </h1>
        <p className="mt-3 text-[12px] font-mono text-neutral-400">
          {card.source.kind}
          {card.source.ref ? ` · ${card.source.ref}` : ''} · atualizado{' '}
          {new Date(card.updatedAt).toLocaleDateString('pt-BR')}
        </p>
      </header>

      <section className="mb-8">
        <SectionHeading
          icon={Layers3}
          title="Desenho da solução"
          subtitle={
            card.diagram
              ? 'Gerado pela IA junto com a especificação.'
              : 'Visão padrão da jornada; o enrichment gera um desenho específico para este card.'
          }
        />
        <BacklogDiagramView diagram={diagram} />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 mb-8">
        <section className="rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-6">
          <SectionHeading icon={UserRound} title="User story" />
          <div className="space-y-4">
            <StoryRow label="Como" value={card.persona} />
            <StoryRow label="Quero" value={card.want} />
            <StoryRow label="Para que" value={card.soThat} />
          </div>
        </section>

        <section className="rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-6">
          <SectionHeading icon={CheckCircle2} title="Critérios de aceite" />
          <Checklist
            items={card.acceptance}
            empty="Ainda sem critérios. Enriquecer como User Story irá criá-los."
          />
        </section>
      </div>

      <section className="rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-6 mb-6">
        <SectionHeading icon={Code2} title="Contexto e implementação" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetailText
            label="Contexto"
            value={card.context}
            empty="O contexto detalhado será criado no enrichment agent-ready."
          />
          <DetailText
            label="Notas de implementação"
            value={card.implementationNotes}
            empty="Ainda sem instruções técnicas. Use Enriquecer → Spec no card."
            mono
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <DetailList
          icon={FileCode2}
          title="Arquivos prováveis"
          items={card.filesLikely}
          mono
          empty="Aguardando análise do repositório."
        />
        <DetailList
          icon={TestTube2}
          title="Plano de teste"
          items={card.testPlan}
          empty="Aguardando spec agent-ready."
        />
        <DetailList
          icon={AlertTriangle}
          title="Riscos"
          items={card.risks}
          tone="warn"
          empty="Nenhum risco registrado."
        />
      </div>

      <section className="rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-6">
        <SectionHeading icon={GitBranch} title="Contexto GitHub" />
        {card.githubRefs && card.githubRefs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {card.githubRefs.map((ref, index) => {
              const href = ref.path
                ? `https://github.com/${ref.repo}/blob/HEAD/${ref.path}`
                : `https://github.com/${ref.repo}`
              return (
                <a
                  key={`${ref.repo}-${ref.path}-${index}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-black/[0.06] bg-[#fafaf8] px-3 py-2.5 hover:border-neutral-300"
                >
                  <p className="text-[11px] font-semibold text-neutral-800">{ref.repo}</p>
                  {ref.path && (
                    <p className="text-[10px] font-mono text-neutral-400 mt-0.5 break-all">
                      {ref.path}
                    </p>
                  )}
                </a>
              )
            })}
          </div>
        ) : (
          <EmptyText>As referências aparecem depois do enrichment agent-ready.</EmptyText>
        )}
      </section>
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-black/[0.08] bg-white px-2.5 py-1 text-[10px] font-medium text-neutral-500">
      {children}
    </span>
  )
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Layers3
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex items-start gap-2.5 mb-4">
      <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-neutral-700" strokeWidth={1.75} />
      </div>
      <div>
        <h2 className="text-[14px] font-semibold text-neutral-900">{title}</h2>
        {subtitle && <p className="text-[11px] text-neutral-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

function StoryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-[60px_1fr] gap-3">
      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-400 pt-0.5">
        {label}
      </span>
      <p className="text-[13px] text-neutral-700 leading-relaxed">
        {value || <span className="text-neutral-300">Não definido</span>}
      </p>
    </div>
  )
}

function Checklist({ items, empty }: { items?: string[]; empty: string }) {
  if (!items || items.length === 0) return <EmptyText>{empty}</EmptyText>
  return (
    <ul className="space-y-2.5">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" strokeWidth={1.8} />
          <span className="text-[12px] text-neutral-600 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function DetailText({
  label,
  value,
  empty,
  mono,
}: {
  label: string
  value?: string
  empty: string
  mono?: boolean
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-400 mb-2">
        {label}
      </p>
      {value ? (
        <p
          className={`text-[12px] text-neutral-600 leading-relaxed whitespace-pre-wrap ${
            mono ? 'font-mono' : ''
          }`}
        >
          {value}
        </p>
      ) : (
        <EmptyText>{empty}</EmptyText>
      )}
    </div>
  )
}

function DetailList({
  icon,
  title,
  items,
  empty,
  mono,
  tone,
}: {
  icon: typeof FileCode2
  title: string
  items?: string[]
  empty: string
  mono?: boolean
  tone?: 'warn'
}) {
  return (
    <section className="rounded-2xl border border-black/[0.06] bg-white p-5">
      <SectionHeading icon={icon} title={title} />
      {items && items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className={`text-[11px] leading-relaxed rounded-lg px-2.5 py-2 ${
                tone === 'warn'
                  ? 'border border-amber-200/70 bg-amber-50/50 text-amber-900/75'
                  : 'bg-[#fafaf8] text-neutral-600'
              } ${mono ? 'font-mono break-all' : ''}`}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyText>{empty}</EmptyText>
      )}
    </section>
  )
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] text-neutral-400 leading-relaxed">{children}</p>
}
