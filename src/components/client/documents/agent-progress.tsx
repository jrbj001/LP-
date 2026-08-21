'use client'

import { AlertCircle, Check, Loader2 } from 'lucide-react'

export type AgentStepId = 'upload' | 'extract' | 'analyze' | 'artifacts'

export type AgentStepState = 'pending' | 'running' | 'done' | 'failed'

const STEPS: { id: AgentStepId; label: string; hint: string }[] = [
  { id: 'upload', label: 'Upload', hint: 'Arquivo salvo com segurança' },
  { id: 'extract', label: 'Leitura', hint: 'Conteúdo extraído do formato original' },
  { id: 'analyze', label: 'Análise', hint: 'Documento cruzado com o código no GitHub' },
  { id: 'artifacts', label: 'Artefatos', hint: 'Plano, arquitetura e backlog gerados' },
]

function StepIcon({ state, accent }: { state: AgentStepState; accent: string }) {
  if (state === 'running') {
    return <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: accent }} />
  }
  if (state === 'done') return <Check className="h-3.5 w-3.5 text-emerald-600" />
  if (state === 'failed') return <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
  return <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
}

export function AgentProgress({
  states,
  accent,
  error,
}: {
  states: Record<AgentStepId, AgentStepState>
  accent: string
  /** Etapa que falhou e o motivo, exibidos abaixo do stepper. */
  error?: { step: AgentStepId; message: string } | null
}) {
  return (
    <div className="rounded-xl border border-black/[0.07] bg-neutral-50/60 p-3.5">
      <ol className="grid gap-2.5 sm:grid-cols-4">
        {STEPS.map(step => {
          const state = states[step.id]
          return (
            <li key={step.id} className="flex items-start gap-2">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  state === 'done'
                    ? 'border-emerald-200 bg-emerald-50'
                    : state === 'failed'
                      ? 'border-rose-200 bg-rose-50'
                      : 'border-black/[0.08] bg-white'
                }`}
              >
                <StepIcon state={state} accent={accent} />
              </span>
              <div className="min-w-0">
                <p
                  className={`text-[11px] font-semibold ${
                    state === 'pending' ? 'text-neutral-400' : 'text-neutral-800'
                  }`}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 text-[10px] leading-snug text-neutral-400">{step.hint}</p>
              </div>
            </li>
          )
        })}
      </ol>

      {error && (
        <p className="mt-3 flex items-start gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] leading-relaxed text-rose-700">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            <strong className="font-semibold">
              {STEPS.find(step => step.id === error.step)?.label ?? 'Etapa'}:
            </strong>{' '}
            {error.message}
          </span>
        </p>
      )}
    </div>
  )
}
