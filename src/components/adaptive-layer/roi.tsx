'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { AnimatedMark } from '@/components/animated-mark'
import { FadeIn } from '@/components/fade-in'

const WEEKS_PER_YEAR = 48
const HOURS_PER_MONTH = 160

const INPUTS = [
  {
    id: 'people',
    label: 'Pessoas na operação',
    hint: 'quem consulta, redigita ou procura informação',
    min: 10,
    max: 500,
    step: 5,
    default: 60,
    format: (v: number) => `${v} pessoas`,
  },
  {
    id: 'cost',
    label: 'Custo médio mensal por pessoa',
    hint: 'salário + encargos',
    min: 3000,
    max: 30000,
    step: 500,
    default: 9000,
    format: (v: number) => brl(v),
  },
  {
    id: 'hours',
    label: 'Horas por semana perdidas por pessoa',
    hint: 'procurando informação, redigitando, conferindo planilha',
    min: 1,
    max: 15,
    step: 0.5,
    default: 6,
    format: (v: number) => `${v} h/semana`,
  },
  {
    id: 'recovery',
    label: 'Recuperado com a Layer',
    hint: 'premissa conservadora: nem toda hora volta',
    min: 20,
    max: 90,
    step: 5,
    default: 60,
    format: (v: number) => `${v}%`,
  },
  {
    id: 'invest',
    label: 'Investimento mensal na Layer',
    hint: 'plataforma + operação, estimado',
    min: 5000,
    max: 100000,
    step: 1000,
    default: 18000,
    format: (v: number) => brl(v),
  },
] as const

type InputId = (typeof INPUTS)[number]['id']

function brl(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export function RoiPage() {
  const locale = useLocale()
  const [values, setValues] = useState<Record<InputId, number>>(
    Object.fromEntries(INPUTS.map(i => [i.id, i.default])) as Record<InputId, number>
  )

  const hourCost = values.cost / HOURS_PER_MONTH
  const hoursPerYear = values.people * values.hours * WEEKS_PER_YEAR * (values.recovery / 100)
  const valuePerYear = hoursPerYear * hourCost
  const costPerYear = values.invest * 12
  const roi = costPerYear > 0 ? ((valuePerYear - costPerYear) / costPerYear) * 100 : 0
  const paybackMonths = valuePerYear > 0 ? (costPerYear / valuePerYear) * 12 : Infinity
  const positive = valuePerYear > costPerYear
  const maxBar = Math.max(valuePerYear, costPerYear)

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-neutral-900">
      <nav className="border-b border-black/[0.06] bg-[#fbfbfa]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
          <a href={`/${locale}/pixel`} className="flex items-center gap-2.5">
            <AnimatedMark className="h-7 w-7 flex-shrink-0" />
            <span className="text-[14px] font-semibold tracking-[-0.03em]">
              Adaptive Layer™
              <span className="ml-1.5 font-normal text-neutral-400">roi</span>
            </span>
          </a>
          <a href={`/${locale}/pixel`} className="text-[13px] text-neutral-400 hover:text-neutral-900">
            Voltar à LP
          </a>
        </div>
      </nav>

      <main className="mx-auto max-w-[1120px] px-6 pb-20 pt-12">
        <FadeIn>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            <span className="font-mono normal-case tracking-normal text-neutral-300">{'// '}</span>
            Para CEOs
          </p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <h1 className="max-w-3xl text-[30px] font-semibold tracking-[-0.03em] sm:text-[40px]">
            Quanto vale um sistema operacional de IA na sua empresa?
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-neutral-500">
            Ajuste as premissas para a sua operação. O cálculo considera só o tempo que as pessoas
            recuperam — sem contar os novos outputs que o OS destrava.
          </p>
        </FadeIn>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_440px]">
          {/* inputs */}
          <FadeIn delay={0.14}>
            <div className="space-y-6">
              {INPUTS.map(input => (
                <div key={input.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <label htmlFor={input.id} className="text-[14px] font-semibold text-neutral-900">
                      {input.label}
                    </label>
                    <span className="font-mono text-[13px] font-medium text-neutral-900">
                      {input.format(values[input.id])}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-neutral-400">{input.hint}</p>
                  <input
                    id={input.id}
                    type="range"
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    value={values[input.id]}
                    onChange={e =>
                      setValues(v => ({ ...v, [input.id]: Number(e.target.value) }))
                    }
                    className="mt-4 w-full accent-neutral-900"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[10px] text-neutral-300">
                    <span>{input.format(input.min)}</span>
                    <span>{input.format(input.max)}</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* result */}
          <FadeIn delay={0.18}>
            <div className="lg:sticky lg:top-8">
              <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-[#171717] shadow-[0_32px_96px_-40px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
                  <span className="h-[8px] w-[8px] rounded-full bg-neutral-600" />
                  <span className="h-[8px] w-[8px] rounded-full bg-neutral-600" />
                  <span className="h-[8px] w-[8px] rounded-full bg-neutral-600" />
                  <span className="ml-2 font-mono text-[11px] text-white/30">adaptive-layer — roi</span>
                </div>
                <div className="p-6 font-mono text-[12.5px] leading-[2]">
                  <p className="text-white/90">
                    <span className="text-emerald-400/90">$ </span>layer roi --pessoas {values.people}
                  </p>
                  <div className="mt-4 space-y-1">
                    <ResultLine label="horas recuperadas / ano" value={`${Math.round(hoursPerYear).toLocaleString('pt-BR')} h`} />
                    <ResultLine label="valor recuperado / ano" value={brl(valuePerYear)} strong />
                    <ResultLine label="investimento / ano" value={brl(costPerYear)} />
                    <div className="my-3 border-t border-white/[0.08]" />
                    <ResultLine
                      label="roi ano 1"
                      value={`${roi >= 0 ? '+' : ''}${Math.round(roi)}%`}
                      strong
                      accent={positive}
                    />
                    <ResultLine
                      label="payback"
                      value={
                        Number.isFinite(paybackMonths)
                          ? `${paybackMonths < 10 ? paybackMonths.toFixed(1) : Math.round(paybackMonths)} meses`
                          : '—'
                      }
                      accent={positive}
                    />
                  </div>

                  {/* bars */}
                  <div className="mt-6 space-y-3">
                    <Bar label="retorno" value={valuePerYear} max={maxBar} accent />
                    <Bar label="custo" value={costPerYear} max={maxBar} />
                  </div>

                  <p className="mt-6 text-[10.5px] leading-relaxed text-white/30">
                    premissas conservadoras — só tempo recuperado. relatórios, código e forecast que o
                    OS passa a gerar não entram na conta.{' '}
                    <a href={`/${locale}/pixel#output`} className="text-white/50 underline hover:text-white">
                      ver outputs
                    </a>
                  </p>
                </div>
              </div>

              <a
                href="mailto:ze@pixelpulselab.dev?subject=ROI%20—%20Adaptive%20Layer"
                className="mt-4 flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3.5 text-[14px] font-medium text-white hover:bg-neutral-800"
              >
                Validar esse número com a PixelPulseLab
              </a>
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  )
}

function ResultLine({
  label,
  value,
  strong = false,
  accent = false,
}: {
  label: string
  value: string
  strong?: boolean
  accent?: boolean
}) {
  return (
    <p className="flex items-baseline justify-between gap-4">
      <span className="text-white/40">{label}</span>
      <span
        className={`${strong ? 'text-[15px] font-semibold' : ''} ${
          accent ? 'text-emerald-400' : 'text-white/90'
        }`}
      >
        {value}
      </span>
    </p>
  )
}

function Bar({ label, value, max, accent = false }: { label: string; value: number; max: number; accent?: boolean }) {
  const pct = max > 0 ? Math.max((value / max) * 100, 2) : 0
  return (
    <div>
      <div className="mb-1 flex justify-between text-[10px] text-white/40">
        <span>{label}</span>
        <span>{brl(value)}</span>
      </div>
      <div className="h-[8px] overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            accent ? 'bg-emerald-400' : 'bg-white/30'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
