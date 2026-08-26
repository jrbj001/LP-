import {
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  FileText,
  Gauge,
  Lightbulb,
  Sparkles,
  Target,
  Upload,
} from 'lucide-react'
import { QuickUpdate } from './quick-update'
import { RecentUpdates } from './recent-updates'
import { PracticeLibrary } from './practice-library'
import { TemplateLibrary } from './template-library'
import { engagementEyebrow } from '@/lib/alquimia/engagements'
import { pillars, practices } from '@/lib/alquimia/methodology'
import { templateFamilies, templates, templateStats } from '@/lib/alquimia/templates'
import {
  ProgressBar,
  SectionHeader,
  SpacePage,
  StatCard,
  TextLink,
} from './space-ui'

const maturity = [
  { id: 'purpose-direction', name: 'Propósito e direção', score: 4.1, delta: 0.4 },
  { id: 'people-culture', name: 'Pessoas e cultura', score: 3.2, delta: 0.2 },
  { id: 'management-system', name: 'Sistema de gestão', score: 2.8, delta: 0.5 },
  { id: 'continuous-improvement', name: 'Melhoria contínua', score: 2.4, delta: 0.3 },
  { id: 'innovation-growth', name: 'Inovação e crescimento', score: 3.6, delta: 0.1 },
]

const initiatives = [
  {
    title: 'Sistema comercial Brasil',
    pillar: 'Comercial e organograma',
    owner: 'Felipe · Alquemia',
    status: 'Em curso',
    progress: 64,
    outcome: 'Estruturar equipe, rotina e metas comerciais no Brasil.',
    target: '30 set',
  },
  {
    title: 'Expansão EUA',
    pillar: 'Inovação e crescimento',
    owner: 'Letícia · Alquemia',
    status: 'Em curso',
    progress: 48,
    outcome: 'Priorizar mercados, brief de consultoria e líder comercial nos EUA.',
    target: '15 out',
  },
  {
    title: 'Flagship loja conceito',
    pillar: 'Propósito e direção',
    owner: 'Alquemia',
    status: 'Em curso',
    progress: 41,
    outcome: 'Conceito, briefing e modelo da loja bandeira.',
    target: '20 out',
  },
  {
    title: 'IA · PixelPulseLab',
    pillar: 'Sistema de gestão',
    owner: 'PixelPulseLab',
    status: 'Atenção',
    progress: 35,
    outcome: 'Order-to-cash, comparador de rates e camada de agentes.',
    target: '12 set',
  },
]

const rituals = [
  { name: 'Follow comercial Brasil', cadence: 'Semanal', owner: 'Felipe', next: '27 ago · 09:00', status: 'Confirmado' },
  { name: 'Review omnichannel', cadence: 'Quinzenal', owner: 'Amanda · Selton', next: '28 ago · 14:00', status: 'Pauta aberta' },
  { name: 'Catch-up PixelPulseLab', cadence: 'Semanal', owner: 'Time IA', next: '29 ago · 16:00', status: 'Confirmado' },
  { name: 'Workshop fazenda / liderança', cadence: 'Mensal', owner: 'Ricardo Madureira', next: '03 set · 10:00', status: 'A preparar' },
]

function PageAction({
  clientId,
  label = 'Registrar atualização',
  kind = 'update',
}: {
  clientId: string
  label?: string
  kind?: 'update' | 'initiative' | 'assessment' | 'ritual' | 'measurement'
}) {
  return <QuickUpdate engagementId={clientId} label={label} kind={kind} />
}

export function ExecutiveView({ locale, clientId }: { locale: string; clientId: string }) {
  const base = `/${locale}/alquimia/space/${clientId}`
  return (
    <SpacePage
      eyebrow={engagementEyebrow(clientId, 'Execução')}
      title="Capacidade em construção"
      description="A visão executiva conecta comercial, EUA, flagship e IA para mostrar onde a transformação está ganhando tração."
      action={<PageAction clientId={clientId} />}
    >
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Frentes em curso" value="04" detail="Comercial · EUA · flagship · IA" />
        <StatCard label="Arquivo" value="104" detail="10 pastas do Drive" tone="gold" />
        <StatCard label="Rituais da semana" value="03" detail="Follow, omnichannel, IA" tone="lilac" />
        <StatCard label="Próximo follow" value="27 ago" detail="Rotina comercial Brasil" tone="neutral" />
      </section>

      <section className="mt-9 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5 sm:p-6">
          <SectionHeader title="Backbone de capacidades" detail="Escala 0–5" />
          <div className="mt-5 space-y-5">
            {maturity.map(item => (
              <div key={item.id}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="text-[11px] font-medium text-[#003b52]">{item.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-semibold text-emerald-700">+{item.delta}</span>
                    <span className="w-6 text-right text-[11px] font-semibold text-[#00435D]">
                      {item.score.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#3A5976] to-[#E0CE7A]"
                    style={{ width: `${item.score * 20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-black/[0.06] pt-4">
            <TextLink href={`${base}/diagnostico`}>Abrir diagnóstico completo</TextLink>
          </div>
        </div>

        <div className="rounded-2xl bg-[#003b52] p-6 text-white">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#E0CE7A]">
            Leitura Alquemia
          </p>
          <h2 className="mt-4 text-[23px] font-light leading-snug tracking-[-0.025em]">
            O arquivo comercial avançou. O próximo salto é fechar GTM nos EUA, o conceito da
            flagship e a camada de IA com a PixelPulseLab.
          </h2>
          <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
            {[
              'Fechar a rotina comercial Brasil com owners e metas',
              'Priorizar mercados EUA e o brief da consultoria local',
              'Destravar as três entregas de IA ainda só no Drive',
            ].map((item, index) => (
              <div key={item} className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#E0CE7A]/40 text-[9px] text-[#E0CE7A]">
                  {index + 1}
                </span>
                <p className="text-[11px] leading-relaxed text-white/60">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-9">
        <SectionHeader title="Iniciativas prioritárias" detail="4 em foco" />
        <InitiativeGrid />
        <div className="mt-4">
          <TextLink href={`${base}/plano`}>Ver plano de transformação</TextLink>
        </div>
      </section>

      <section className="mt-9">
        <SectionHeader title="Memória recente" detail="Atualizações do engagement" />
        <RecentUpdates engagementId={clientId} />
      </section>
    </SpacePage>
  )
}

export function DiagnosticView({ clientId }: { clientId: string }) {
  return (
    <SpacePage
      eyebrow={engagementEyebrow(clientId, 'Diagnóstico')}
      title="Do potencial ao gap real"
      description="Uma leitura compartilhada das capacidades atuais, evidências e tensões que orientam as próximas escolhas."
      action={<PageAction clientId={clientId} label="Nova avaliação" kind="assessment" />}
    >
      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl bg-[#00435D] p-6 text-white sm:p-7">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#E0CE7A]">
            Síntese do diagnóstico
          </p>
          <p className="mt-5 text-[28px] font-light leading-tight tracking-[-0.035em]">3,2 / 5</p>
          <p className="mt-3 text-[12px] leading-relaxed text-white/55">
            A Orfeu tem marca, produto e liderança mobilizada, mas o sistema comercial, o GTM
            internacional e a loja conceito ainda dependem de rotina explícita.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-white/35">Força principal</p>
              <p className="mt-1 text-[12px] text-white/80">Marca e produto</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-white/35">Gap prioritário</p>
              <p className="mt-1 text-[12px] text-white/80">Sistema comercial</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5 sm:p-6">
          <SectionHeader title="Maturidade por pilar" detail="Última avaliação · 18 ago" />
          <div className="mt-4 space-y-4">
            {maturity.map(item => (
              <div key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-4">
                <div>
                  <div className="mb-1.5 flex justify-between text-[10px]">
                    <span className="font-medium text-[#003b52]">{item.name}</span>
                    <span className="text-black/35">{item.score.toFixed(1)}</span>
                  </div>
                  <ProgressBar value={item.score * 20} />
                </div>
                <button className="rounded-lg border border-black/[0.07] px-2.5 py-1.5 text-[9px] text-[#00435D]">
                  Evidências
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-9 grid gap-4 lg:grid-cols-3">
        {[
          ['Gap crítico', 'Rotina comercial e omnichannel ainda concentradas em poucos owners.', AlertTriangle],
          ['Ativo maduro', 'Marca, produto e arquivo de conteúdos finais já organizados.', CheckCircle2],
          ['Hipótese', 'Sistema comercial + IA destravam execução no Brasil e nos EUA.', Lightbulb],
        ].map(([label, text, Icon]) => (
          <article key={String(label)} className="rounded-2xl border border-black/[0.07] bg-white p-5">
            <Icon className="h-4 w-4 text-[#3A5976]" />
            <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#3A5976]">
              {String(label)}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#003b52]">{String(text)}</p>
          </article>
        ))}
      </section>
    </SpacePage>
  )
}

export function PlanView({ clientId }: { clientId: string }) {
  return (
    <SpacePage
      eyebrow={engagementEyebrow(clientId, 'Plano')}
      title="Escolhas que movem o sistema"
      description="Outcomes, owners e frentes do arquivo Orfeu × Alquemia — comercial, EUA, flagship e IA."
      action={<PageAction clientId={clientId} label="Nova iniciativa" kind="initiative" />}
    >
      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Outcomes priorizados" value="08" detail="Horizonte de 90 dias" />
        <StatCard label="Capacidade alocada" value="78%" detail="22% de margem para resposta" tone="gold" />
        <StatCard label="Dependências abertas" value="03" detail="1 bloqueia o caminho crítico" tone="neutral" />
      </section>
      <section className="mt-9">
        <SectionHeader title="Plano de transformação" detail="Ciclo agosto–outubro" />
        <InitiativeGrid />
      </section>
    </SpacePage>
  )
}

function InitiativeGrid() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {initiatives.map(item => (
        <article key={item.title} className="rounded-2xl border border-black/[0.07] bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#3A5976]">
                {item.pillar}
              </p>
              <h3 className="mt-1.5 text-[15px] font-semibold text-[#003b52]">{item.title}</h3>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                item.status === 'Atenção'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-[#00435D]/7 text-[#00435D]'
              }`}
            >
              {item.status}
            </span>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-black/45">{item.outcome}</p>
          <div className="mt-5 flex items-center gap-3">
            <ProgressBar value={item.progress} className="flex-1" />
            <span className="text-[10px] font-semibold text-[#00435D]">{item.progress}%</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3 text-[9px] text-black/35">
            <span>{item.owner}</span>
            <span>Meta · {item.target}</span>
          </div>
        </article>
      ))}
    </div>
  )
}

export function CyclesView({ clientId }: { clientId: string }) {
  const cycles = [
    { method: 'PDCA', title: 'Rotina comercial Brasil', stage: 'Check', status: 'Em revisão', owner: 'Felipe', end: '30 ago' },
    { method: 'DMAIC', title: 'Mix e analytics de categoria', stage: 'Analyze', status: 'Em curso', owner: 'Trade', end: '12 set' },
    { method: 'SDCA', title: 'Cadência omnichannel', stage: 'Standardize', status: 'Em curso', owner: 'Amanda · Selton', end: '20 set' },
  ]
  return (
    <SpacePage
      eyebrow={engagementEyebrow(clientId, 'Ciclos')}
      title="Aprender enquanto executa"
      description="Cada ciclo torna hipótese, contramedida, evidência e aprendizado explícitos — para melhorar e sustentar sem depender de heroísmo."
      action={<PageAction clientId={clientId} label="Abrir ciclo" />}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {cycles.map(cycle => (
          <article key={cycle.title} className="rounded-2xl border border-black/[0.07] bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-[#00435D] px-2.5 py-1.5 text-[10px] font-semibold text-white">
                {cycle.method}
              </span>
              <span className="text-[9px] text-black/35">{cycle.status}</span>
            </div>
            <h2 className="mt-5 text-[16px] font-semibold text-[#003b52]">{cycle.title}</h2>
            <div className="mt-5 rounded-xl bg-[#F7F5ED] p-4">
              <p className="text-[9px] uppercase tracking-wider text-black/30">Etapa atual</p>
              <p className="mt-1 text-[13px] font-medium text-[#00435D]">{cycle.stage}</p>
            </div>
            <div className="mt-4 flex justify-between text-[9px] text-black/35">
              <span>{cycle.owner}</span>
              <span>Até {cycle.end}</span>
            </div>
          </article>
        ))}
      </div>
    </SpacePage>
  )
}

export function RitualsView({ clientId }: { clientId: string }) {
  return (
    <SpacePage
      eyebrow={engagementEyebrow(clientId, 'Rituais')}
      title="Ritmo que sustenta a mudança"
      description="Cadências explícitas transformam intenção em accountability, decisão e aprendizagem coletiva."
      action={<PageAction clientId={clientId} label="Agendar ritual" kind="ritual" />}
    >
      <div className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
        <div className="hidden grid-cols-[1.4fr_0.7fr_0.8fr_0.9fr_0.7fr] border-b border-black/[0.06] px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-black/30 md:grid">
          <span>Ritual</span><span>Cadência</span><span>Owner</span><span>Próximo</span><span>Status</span>
        </div>
        {rituals.map(ritual => (
          <div key={ritual.name} className="grid gap-3 border-b border-black/[0.06] px-5 py-4 last:border-0 md:grid-cols-[1.4fr_0.7fr_0.8fr_0.9fr_0.7fr] md:items-center">
            <div className="flex items-center gap-3">
              <CalendarCheck className="h-4 w-4 text-[#3A5976]" />
              <p className="text-[12px] font-medium text-[#003b52]">{ritual.name}</p>
            </div>
            <p className="text-[10px] text-black/45">{ritual.cadence}</p>
            <p className="text-[10px] text-black/45">{ritual.owner}</p>
            <p className="text-[10px] text-black/45">{ritual.next}</p>
            <span className="w-fit rounded-full bg-[#00435D]/7 px-2.5 py-1 text-[9px] font-medium text-[#00435D]">{ritual.status}</span>
          </div>
        ))}
      </div>
    </SpacePage>
  )
}

export function ScorecardsView({ clientId }: { clientId: string }) {
  const metrics = [
    ['Sell-out Brasil', 'Em construção', 'Meta Q3', 64],
    ['Aderência à rotina comercial', '72%', '90%', 72],
    ['Pipeline EUA', '3 mercados', 'Prioridade fechada', 48],
    ['Cobertura de categoria', 'Em mapeamento', 'Mix definido', 41],
    ['Entregas IA no prazo', '2/5', '5/5', 40],
    ['Arquivo atualizado', '101/104', '104 docs', 97],
  ]
  return (
    <SpacePage
      eyebrow={engagementEyebrow(clientId, 'Scorecards')}
      title="O sistema visto por seus sinais"
      description="Indicadores de capacidade e resultado lado a lado — para evitar atividade sem impacto ou resultado sem sustentação."
      action={<PageAction clientId={clientId} label="Registrar medição" kind="measurement" />}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map(([label, current, target, progress]) => (
          <article key={String(label)} className="rounded-2xl border border-black/[0.07] bg-white p-5">
            <div className="flex items-center justify-between">
              <Gauge className="h-4 w-4 text-[#3A5976]" />
              <span className="text-[9px] text-black/30">Meta {target}</span>
            </div>
            <p className="mt-5 text-[10px] font-medium text-black/45">{label}</p>
            <p className="mt-1 text-[26px] font-semibold tracking-[-0.035em] text-[#003b52]">{current}</p>
            <ProgressBar value={Number(progress)} className="mt-4" />
          </article>
        ))}
      </div>
    </SpacePage>
  )
}

export function EvidenceView({ clientId }: { clientId: string }) {
  const evidence = [
    ['Proposta Orfeu × Alquemia', 'PDF', 'Alquemia', 'Arquivo · 01_Proposta'],
    ['Follow comercial Brasil', 'Ata', 'Felipe', 'Arquivo · 04_Atas'],
    ['Workshop fazenda', 'Workshop', 'Liderança Orfeu', 'Arquivo · 03_Workshops'],
    ['Briefing flagship', 'Documento', 'Alquemia', 'Arquivo · 09_Flagship'],
  ]
  return (
    <SpacePage
      eyebrow={engagementEyebrow(clientId, 'Evidências')}
      title="Mudança que pode ser observada"
      description="Decisões, padrões, aprendizados e resultados reunidos como memória viva da transformação."
      action={
        <button className="inline-flex items-center gap-2 rounded-xl bg-[#00435D] px-4 py-3 text-[12px] font-semibold text-white">
          <Upload className="h-4 w-4" /> Nova evidência
        </button>
      }
    >
      <div className="grid gap-3 md:grid-cols-2">
        {evidence.map(item => (
          <article key={item[0]} className="flex items-start gap-4 rounded-2xl border border-black/[0.07] bg-white p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00435D]/7">
              <FileText className="h-4 w-4 text-[#00435D]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-[#003b52]">{item[0]}</p>
              <p className="mt-1 text-[10px] text-black/35">{item[1]}</p>
              <div className="mt-4 flex justify-between border-t border-black/[0.06] pt-3 text-[9px] text-black/30">
                <span>{item[2]}</span><span>{item[3]}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SpacePage>
  )
}

export function LibraryView() {
  return (
    <SpacePage
      eyebrow="Biblioteca do engagement"
      title="Práticas e modelos para o problema real"
      description="Referências Danaher/AB InBev e os templates operacionais da Alquemia, com origem explícita e aplicação contextual."
    >
      <div className="rounded-2xl border border-[#E0CE7A]/50 bg-[#E0CE7A]/15 p-5">
        <div className="flex gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#755f00]" />
          <p className="text-[11px] leading-relaxed text-[#584800]">
            A Alquemia adapta práticas e modelos ao contexto de cada cliente. Origens de terceiros
            permanecem atribuídas; os templates são material interno, ainda em validação.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <SectionHeader title="Modelos da consultoria" detail={`${templates.length} templates`} />
        <TemplateLibrary templates={templates} />
      </div>
      <div className="mt-12">
        <SectionHeader title="Práticas de referência" detail="55 práticas" />
        <PracticeLibrary practices={practices} pillars={pillars} />
      </div>
    </SpacePage>
  )
}

export function AgendaView() {
  return (
    <SpacePage
      eyebrow="Partner command center · Agenda"
      title="Ritmo do Café Orfeu"
      description="Follows, reviews, workshops e catch-ups do engagement em curso."
      action={<PageAction clientId="orfeu" label="Novo ritual" />}
    >
      <div className="grid gap-3">
        {rituals.concat(rituals.slice(0, 2)).map((ritual, index) => (
          <article key={`${ritual.name}-${index}`} className="grid gap-4 rounded-2xl border border-black/[0.07] bg-white p-5 sm:grid-cols-[80px_1fr_auto] sm:items-center">
            <div>
              <p className="text-[20px] font-semibold tracking-[-0.03em] text-[#003b52]">{25 + index}</p>
              <p className="text-[9px] uppercase tracking-wider text-black/30">Agosto</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#003b52]">{ritual.name}</p>
              <p className="mt-1 text-[10px] text-black/35">Café Orfeu · {ritual.owner}</p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] text-black/40">
              <Clock3 className="h-3.5 w-3.5" /> {ritual.next.split('·')[1]}
            </span>
          </article>
        ))}
      </div>
    </SpacePage>
  )
}

export function MethodologyView() {
  return (
    <SpacePage
      eyebrow="Metodologia · Backbone provisório"
      title="Duas lentes. Um sistema vivo."
      description="O Backbone conecta o motor de gestão ao motor de melhoria contínua para transformar potencial em capacidade instalada."
    >
      <section className="grid gap-4 lg:grid-cols-2">
        {[
          ['Management', 'Alinha direção, pessoas, metas, governança e ritmo da execução.', Target],
          ['Continuous Improvement', 'Expõe gaps, investiga causas, testa contramedidas e sustenta padrões.', Sparkles],
        ].map(([title, text, Icon]) => (
          <article key={String(title)} className="rounded-2xl bg-[#00435D] p-6 text-white">
            <Icon className="h-5 w-5 text-[#E0CE7A]" />
            <p className="mt-8 text-[9px] uppercase tracking-[0.18em] text-[#E0CE7A]">Motor</p>
            <h2 className="mt-2 text-[23px] font-light">{String(title)}</h2>
            <p className="mt-3 text-[12px] leading-relaxed text-white/55">{String(text)}</p>
          </article>
        ))}
      </section>
      <section className="mt-9">
        <SectionHeader title="Backbone de cinco capacidades" detail="Nomenclatura em validação" />
        <div className="grid gap-3 lg:grid-cols-5">
          {pillars.map((pillar, index) => (
            <article key={pillar.id} className="rounded-2xl border border-black/[0.07] bg-white p-5">
              <span className="text-[10px] font-semibold text-[#E0CE7A]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-8 text-[14px] font-semibold text-[#003b52]">{pillar.name}</h3>
              <p className="mt-3 text-[10px] leading-relaxed text-black/40">{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-9">
        <SectionHeader title="Jornada operacional" />
        <div className="grid gap-px overflow-hidden rounded-2xl border border-black/[0.07] bg-black/[0.07] md:grid-cols-5">
          {['Diagnóstico', 'Foco', 'Desenho', 'Execução', 'Sustentação'].map((stage, index) => (
            <div key={stage} className="bg-white p-5">
              <span className="text-[9px] font-semibold text-[#3A5976]">0{index + 1}</span>
              <p className="mt-5 text-[13px] font-semibold text-[#003b52]">{stage}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-9 rounded-2xl border border-black/[0.07] bg-white p-6">
        <SectionHeader title="Templates operacionais" detail={`${templates.length} modelos`} />
        <p className="max-w-2xl text-[12px] leading-relaxed text-black/45">
          O Backbone ganha forma em sala com Gantt, 5W2H, ICO3, PDCA/SDCA, ciclo de gente e o
          Shifting Business. Os modelos vivem no space, não na LP pública.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {templateFamilies.map(family => (
            <span key={family.id} className="rounded-full bg-[#F7F5ED] px-3 py-1.5 text-[10px] font-medium text-[#003b52]">
              {family.name}
            </span>
          ))}
        </div>
      </section>
    </SpacePage>
  )
}

export function TemplatesView() {
  const stats = templateStats()
  return (
    <SpacePage
      eyebrow="Metodologia · Templates 2026"
      title="Modelos da consultoria."
      description="Ferramentas de sala, planejamento, análise, gente e fieldwork — extraídas do material interno Alquemia, com origem atribuída quando a referência não é nossa."
    >
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {templateFamilies.map(family => (
          <StatCard
            key={family.id}
            label={family.name}
            value={String(stats.byFamily[family.id]).padStart(2, '0')}
            detail={family.description}
            tone={family.id === 'fieldwork' ? 'neutral' : family.id === 'people' ? 'gold' : family.id === 'facilitation' ? 'lilac' : 'blue'}
          />
        ))}
      </section>
      <div className="mt-6 rounded-2xl border border-[#E0CE7A]/50 bg-[#E0CE7A]/15 p-5">
        <p className="text-[11px] leading-relaxed text-[#584800]">
          Material estratégico de uso interno. Exemplos preenchidos com dados de cliente foram
          generalizados. Referências AB InBev, Fieldwork, OKRs e Scrum permanecem explícitas — a
          Alquemia não reivindica autoria exclusiva.
        </p>
      </div>
      <div className="mt-8">
        <TemplateLibrary templates={templates} />
      </div>
    </SpacePage>
  )
}

export function PracticesView() {
  return (
    <SpacePage
      eyebrow="Metodologia · Referências"
      title="55 práticas. Um contexto por vez."
      description="Uma biblioteca atribuída de práticas Danaher DBS e AB InBev para apoiar diagnóstico e desenho — não uma receita pronta."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Danaher DBS" value="30" detail="Processos, ferramentas e crescimento" />
        <StatCard label="AB InBev" value="25" detail="Pessoas, cultura e performance" tone="gold" />
        <StatCard label="Áreas funcionais" value="12" detail="Da operação à inovação" tone="neutral" />
      </div>
      <div className="mt-8">
        <PracticeLibrary practices={practices} pillars={pillars} />
      </div>
    </SpacePage>
  )
}
