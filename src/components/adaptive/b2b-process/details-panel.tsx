'use client'

import { X } from 'lucide-react'
import type { ProcessNodeData } from '@/lib/adaptive/b2b-process/types'
import { quickWinById } from '@/lib/adaptive/b2b-process/quick-wins'

export function DetailsPanel({
  data,
  onClose,
}: {
  data: ProcessNodeData | null
  onClose: () => void
}) {
  if (!data) return null
  const d = data.details
  const qw = d?.quickWinId ? quickWinById(d.quickWinId) : undefined

  return (
    <aside className="absolute top-0 right-0 z-20 h-full w-full max-w-sm border-l border-black/[0.08] bg-white shadow-xl overflow-y-auto">
      <div className="sticky top-0 flex items-start justify-between gap-3 bg-white border-b border-black/[0.06] px-5 py-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
            {data.area ?? data.kind}
          </p>
          <h2 className="text-[16px] font-semibold text-neutral-900 mt-1 leading-snug">{data.label}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      <div className="px-5 py-5 space-y-5 text-[13px]">
        {d?.intervention && (
          <Field label="Intervenção manual" tone="rose">
            {d.intervention}
          </Field>
        )}
        {qw && (
          <Field label="Quick win que resolve" tone="emerald">
            <span className="font-mono text-[11px] text-emerald-700">{qw.id}</span>
            <br />
            {qw.title}
          </Field>
        )}
        {d?.description && <Field label="Descrição">{d.description}</Field>}
        {d?.owner && <Field label="Responsável / fonte">{d.owner}</Field>}
        {d?.system && <Field label="Sistema">{d.system}</Field>}
        {d?.input && <Field label="Entrada">{d.input}</Field>}
        {d?.output && <Field label="Saída">{d.output}</Field>}
        {d?.risks && d.risks.length > 0 && (
          <Field label="Riscos">
            <ul className="list-disc pl-4 space-y-1">
              {d.risks.map(r => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </Field>
        )}
        {d?.automation && <Field label="Automação / plano">{d.automation}</Field>}
        {d?.planPhase && <Field label="Fase do plano">{d.planPhase}</Field>}
        {qw?.layer && (
          <Field label="Adaptive Layer™" tone="sky">
            Este QW nasce plugado na camada — sem novo silo.
          </Field>
        )}
        {qw?.llm && (
          <Field label="LLM" tone="amber">
            Após limpar a intervenção, habilita consulta/status em linguagem natural.
          </Field>
        )}
      </div>
    </aside>
  )
}

function Field({
  label,
  children,
  tone,
}: {
  label: string
  children: React.ReactNode
  tone?: 'rose' | 'emerald' | 'sky' | 'amber'
}) {
  const box =
    tone === 'rose'
      ? 'bg-rose-50 border-rose-100'
      : tone === 'emerald'
        ? 'bg-emerald-50 border-emerald-100'
        : tone === 'sky'
          ? 'bg-sky-50 border-sky-100'
          : tone === 'amber'
            ? 'bg-amber-50 border-amber-100'
            : 'bg-neutral-50 border-neutral-100'
  return (
    <div className={`rounded-xl border px-3.5 py-3 ${box}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">{label}</p>
      <div className="text-neutral-800 leading-relaxed">{children}</div>
    </div>
  )
}
