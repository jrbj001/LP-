import {
  PROMOCAO_META,
  PROMOCAO_KPIS,
  PROMOCAO_BANK_STATS,
  FLOW_BEFORE,
  FLOW_AFTER,
  PROMOCAO_RULES,
  PROMOCAO_EXIBIDORES,
  PROMOCAO_HIGHLIGHTS,
  FIELD_MAPPING,
  TECH_FIXES,
  OUT_OF_SCOPE,
  OPERATE_UI,
  OPERATE_SCRIPTS,
  CODE_DELIVERABLES,
  VALIDATION_STEPS,
  NEXT_STEPS,
} from '@/components/client/documents/colmeia-promocao-inventarios-data'
import { WorkspacePageHeader } from '@/components/client/workspace-page'
import {
  ArrowRight,
  CheckCircle2,
  Database,
  FileCode2,
  GitBranch,
  Layers,
  ListChecks,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  Workflow,
} from 'lucide-react'

function fmt(n: number): string {
  return n.toLocaleString('pt-BR')
}

export function ColmeiaPromocaoInventariosView({
  locale,
  clientSlug,
  accent,
}: {
  locale: string
  clientSlug: string
  accent: string
}) {
  const base = `/${locale}/client/${clientSlug}`
  const totalInserted = PROMOCAO_EXIBIDORES.reduce((s, e) => s + e.inserted, 0)
  const totalInvalidated = PROMOCAO_EXIBIDORES.reduce((s, e) => s + e.invalidated, 0)

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 py-10 sm:py-14">
      <WorkspacePageHeader
        eyebrow={`${PROMOCAO_META.client} · Relatório operacional`}
        title={PROMOCAO_META.title}
        description={`${PROMOCAO_META.lead} Data: ${PROMOCAO_META.date}.`}
        backHref={`${base}/documentos`}
      />

      <div className="flex flex-wrap gap-2 mb-8">
        <MetaChip icon={Database} label={PROMOCAO_META.product} />
        <MetaChip icon={GitBranch} label={PROMOCAO_META.branch} mono />
        <MetaChip icon={Layers} label={PROMOCAO_META.scope} />
      </div>

      {/* Resumo */}
      <section className="mb-10 rounded-2xl border border-teal-900/10 bg-teal-50/40 p-5 sm:p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-teal-800/70 mb-2">
          Resumo executivo
        </p>
        <p className="text-[14px] text-neutral-700 leading-relaxed max-w-4xl">
          Até então, aprovar um lote só mudava o status na análise — os pontos{' '}
          <strong className="font-semibold text-neutral-900">não entravam</strong> no banco usado por
          roteiros, mapas e relatórios. Nesta entrega o fluxo{' '}
          <strong className="font-semibold text-neutral-900">Promover ao banco</strong> passou a
          gravar inventários aprovados em <span className="font-mono text-[13px]">bancoAtivosJoin_ft</span>,
          com preview, confirmação e substituição total por exibidor.
        </p>
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'Fluxo Promover ao banco (preview + confirmação + substituição total)',
            '19 inventários de exibidores já aprovados promovidos',
            '4.881 pontos novos e 17.689 pontos legado invalidados (soft-delete)',
            '0 divergências entre o lote e o que está válido no banco',
          ].map(item => (
            <li key={item} className="flex items-start gap-2 text-[12px] text-neutral-600 leading-relaxed">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" strokeWidth={1.8} />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* KPIs */}
      <section className="mb-10">
        <SectionTitle>Números consolidados</SectionTitle>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-3">
          {PROMOCAO_KPIS.map(kpi => (
            <div key={kpi.label} className="rounded-2xl border border-black/[0.06] bg-white p-4">
              <p className="text-[22px] font-semibold tracking-[-0.03em] text-neutral-900 leading-none tabular-nums">
                {kpi.value}
              </p>
              <p className="text-[12px] font-medium text-neutral-700 mt-2">{kpi.label}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">{kpi.hint}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PROMOCAO_BANK_STATS.map(stat => (
            <div key={stat.label} className="rounded-xl border border-black/[0.06] bg-[#fafaf8] px-4 py-3">
              <p className="text-[11px] text-neutral-400">{stat.label}</p>
              <p className="text-[15px] font-semibold text-neutral-900 mt-0.5 tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fluxos */}
      <section className="mb-10">
        <SectionTitle>O que mudou no produto</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
          <FlowCard title="Antes" tone="muted" steps={FLOW_BEFORE} brokenLast />
          <FlowCard title="Agora" tone="accent" accent={accent} steps={FLOW_AFTER} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {PROMOCAO_RULES.map(rule => (
            <div key={rule.title} className="rounded-2xl border border-black/[0.06] bg-white p-4">
              <p className="text-[13px] font-semibold text-neutral-900">{rule.title}</p>
              <p className="text-[12px] text-neutral-500 mt-1.5 leading-relaxed">{rule.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Por exibidor */}
      <section className="mb-10">
        <SectionTitle>Detalhamento por exibidor</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {PROMOCAO_HIGHLIGHTS.map(item => (
            <div key={item.title} className="rounded-xl border border-black/[0.06] bg-white p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-400">
                {item.title}
              </p>
              <p className="text-[13px] text-neutral-700 mt-1.5 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead>
                <tr className="bg-[#fafaf8] border-b border-black/[0.06]">
                  {['#', 'Exibidor', 'Lote', 'Inseridos', 'Legado invalidado', 'Promovido em (UTC)', 'Por'].map(
                    col => (
                      <th
                        key={col}
                        className="px-4 py-2.5 text-[9px] font-medium uppercase tracking-[0.1em] text-neutral-400"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {PROMOCAO_EXIBIDORES.map(row => (
                  <tr key={row.n} className="border-b border-black/[0.04] last:border-b-0">
                    <td className="px-4 py-2.5 text-[12px] text-neutral-400 tabular-nums">{row.n}</td>
                    <td className="px-4 py-2.5 text-[12px] font-medium text-neutral-800">{row.name}</td>
                    <td className="px-4 py-2.5 text-[12px] font-mono text-neutral-500">{row.lote}</td>
                    <td className="px-4 py-2.5 text-[12px] tabular-nums text-teal-700 font-medium">
                      {fmt(row.inserted)}
                    </td>
                    <td className="px-4 py-2.5 text-[12px] tabular-nums text-amber-700">
                      {fmt(row.invalidated)}
                    </td>
                    <td className="px-4 py-2.5 text-[11px] text-neutral-500">{row.promotedAt}</td>
                    <td className="px-4 py-2.5 text-[11px] text-neutral-500">{row.by}</td>
                  </tr>
                ))}
                <tr className="bg-[#fafaf8]">
                  <td className="px-4 py-3 text-[12px] font-semibold text-neutral-900" colSpan={3}>
                    TOTAL
                  </td>
                  <td className="px-4 py-3 text-[13px] font-semibold tabular-nums text-teal-800">
                    {fmt(totalInserted)}
                  </td>
                  <td className="px-4 py-3 text-[13px] font-semibold tabular-nums text-amber-800">
                    {fmt(totalInvalidated)}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Mapeamento */}
      <section className="mb-10">
        <SectionTitle>Mapeamento de campos</SectionTitle>
        <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 bg-[#fafaf8] px-5 py-2.5 border-b border-black/[0.06]">
            <span className="text-[9px] font-medium uppercase tracking-[0.1em] text-neutral-400">
              Origem · exibidor_inventario_item_dm
            </span>
            <span />
            <span className="text-[9px] font-medium uppercase tracking-[0.1em] text-neutral-400">
              Destino · bancoAtivosJoin_ft
            </span>
          </div>
          {FIELD_MAPPING.map(row => (
            <div
              key={`${row.from}-${row.to}`}
              className="grid grid-cols-[1fr_auto_1fr] gap-3 px-5 py-2.5 border-b border-black/[0.04] last:border-b-0 items-center"
            >
              <span className="text-[11px] font-mono text-neutral-500 break-all">{row.from}</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-300" strokeWidth={2} />
              <span className="text-[11px] font-mono text-neutral-800 break-all">{row.to}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Correções técnicas */}
      <section className="mb-10">
        <SectionTitle>Correções técnicas neste ciclo</SectionTitle>
        <div className="space-y-3">
          {TECH_FIXES.map((fix, index) => (
            <article key={fix.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-[12px] font-semibold"
                  style={{ backgroundColor: accent }}
                >
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-neutral-900">{fix.title}</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FixBlock label="Problema" text={fix.problem} tone="warn" />
                <FixBlock label="Correção" text={fix.fix} tone="neutral" />
                <FixBlock label="Resultado" text={fix.result} tone="good" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Fora do escopo */}
      <section className="mb-10">
        <SectionTitle>O que ainda não entra no banco</SectionTitle>
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-5">
          <div className="flex items-start gap-2.5 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" strokeWidth={1.8} />
            <p className="text-[13px] text-amber-900/80 leading-relaxed">
              Não há lote APROVADO pendente de promoção. O que resta parado é{' '}
              <strong className="font-semibold">dado incompleto na origem</strong>, não falha do fluxo.
            </p>
          </div>
          <ul className="space-y-2">
            {OUT_OF_SCOPE.map(item => (
              <li key={item} className="text-[12px] text-neutral-600 leading-relaxed pl-6 relative">
                <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Como operar */}
      <section className="mb-10">
        <SectionTitle>Como operar daqui pra frente</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Workflow className="w-4 h-4 text-neutral-700" strokeWidth={1.75} />
              <h3 className="text-[13px] font-semibold text-neutral-900">
                UI admin · Inventários de exibidores
              </h3>
            </div>
            <ol className="space-y-2.5">
              {OPERATE_UI.map((step, i) => (
                <li key={step} className="flex items-start gap-2.5 text-[12px] text-neutral-600 leading-relaxed">
                  <span
                    className="inline-flex w-5 h-5 rounded-full text-white text-[10px] font-semibold items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: accent }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileCode2 className="w-4 h-4 text-neutral-700" strokeWidth={1.75} />
              <h3 className="text-[13px] font-semibold text-neutral-900">Scripts operacionais</h3>
            </div>
            <div className="space-y-2.5">
              {OPERATE_SCRIPTS.map(script => (
                <div key={script.command}>
                  <p className="text-[11px] text-neutral-400 mb-1">{script.label}</p>
                  <code className="block rounded-lg bg-neutral-900 text-teal-200 text-[11px] px-3 py-2 font-mono overflow-x-auto">
                    {script.command}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Entregáveis */}
      <section className="mb-10">
        <SectionTitle>Entregáveis de código</SectionTitle>
        <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden">
          <div className="grid grid-cols-[1.1fr_1.4fr] gap-3 bg-[#fafaf8] px-5 py-2.5 border-b border-black/[0.06]">
            <span className="text-[9px] font-medium uppercase tracking-[0.1em] text-neutral-400">Arquivo</span>
            <span className="text-[9px] font-medium uppercase tracking-[0.1em] text-neutral-400">Papel</span>
          </div>
          {CODE_DELIVERABLES.map(row => (
            <div
              key={row.file}
              className="grid grid-cols-[1.1fr_1.4fr] gap-3 px-5 py-3 border-b border-black/[0.04] last:border-b-0 items-start"
            >
              <span className="text-[11px] font-mono text-neutral-700 break-all">{row.file}</span>
              <span className="text-[12px] text-neutral-500 leading-relaxed">{row.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Validação */}
      <section className="mb-10">
        <SectionTitle>Validação realizada</SectionTitle>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <ul className="space-y-2.5">
            {VALIDATION_STEPS.map((step, i) => (
              <li key={step} className="flex items-start gap-2.5 text-[12px] text-neutral-600 leading-relaxed">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-teal-50 text-teal-700 text-[10px] font-semibold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Conclusão */}
      <section className="mb-4">
        <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-6">
          <div className="flex items-start gap-3 mb-4">
            <ShieldCheck className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <p className="text-[15px] font-semibold">Conclusão</p>
              <p className="text-[13px] text-white/60 mt-1.5 leading-relaxed max-w-3xl">
                O inventário aprovado pelo fluxo de exibidores já alimenta o banco de ativos da Colmeia.
                A operação desta data integrou <strong className="text-white">19 exibidores</strong> e{' '}
                <strong className="text-white">4.881 pontos</strong> sob o modelo de substituição total,
                com auditoria, preview na UI e scripts para o que já estava aprovado.
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/40 mb-2">
              Próximos passos (fora deste escopo)
            </p>
            <ul className="space-y-1.5">
              {NEXT_STEPS.map(step => (
                <li key={step} className="flex items-start gap-2 text-[12px] text-white/55 leading-relaxed">
                  <ListChecks className="w-3.5 h-3.5 text-teal-300 mt-0.5 shrink-0" strokeWidth={1.75} />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

function MetaChip({
  icon: Icon,
  label,
  mono,
}: {
  icon: typeof Database
  label: string
  mono?: boolean
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[11px] text-neutral-600">
      <Icon className="w-3.5 h-3.5 text-neutral-400" strokeWidth={1.75} />
      <span className={mono ? 'font-mono' : undefined}>{label}</span>
    </span>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[15px] font-semibold text-neutral-900 tracking-tight mb-4 pb-2 border-b border-black/[0.06]">
      {children}
    </h2>
  )
}

function FlowCard({
  title,
  steps,
  tone,
  accent,
  brokenLast,
}: {
  title: string
  steps: string[]
  tone: 'muted' | 'accent'
  accent?: string
  brokenLast?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        tone === 'accent' ? 'border-teal-200/70 bg-teal-50/30' : 'border-black/[0.06] bg-[#fafaf8]'
      }`}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400 mb-4">{title}</p>
      <div className="space-y-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          const broken = brokenLast && isLast
          return (
            <div key={step}>
              <div
                className={`rounded-xl border px-3 py-2.5 text-[12px] leading-snug ${
                  broken
                    ? 'border-rose-200 bg-rose-50 text-rose-800'
                    : tone === 'accent' && isLast
                      ? 'border-transparent text-white'
                      : 'border-black/[0.07] bg-white text-neutral-700'
                }`}
                style={tone === 'accent' && isLast && !broken ? { backgroundColor: accent } : undefined}
              >
                {step}
              </div>
              {!isLast && (
                <div className="h-5 flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-300 rotate-90" strokeWidth={2} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FixBlock({
  label,
  text,
  tone,
}: {
  label: string
  text: string
  tone: 'warn' | 'neutral' | 'good'
}) {
  const styles = {
    warn: 'border-amber-200/70 bg-amber-50/50',
    neutral: 'border-black/[0.06] bg-[#fafaf8]',
    good: 'border-teal-200/70 bg-teal-50/40',
  }
  const icons = {
    warn: AlertTriangle,
    neutral: Wrench,
    good: CheckCircle2,
  }
  const Icon = icons[tone]
  return (
    <div className={`rounded-xl border p-3 ${styles[tone]}`}>
      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-400 mb-1.5 flex items-center gap-1.5">
        <Icon className="w-3 h-3" strokeWidth={1.8} />
        {label}
      </p>
      <p className="text-[11px] text-neutral-600 leading-relaxed">{text}</p>
    </div>
  )
}
