'use client'

import { FadeIn, FadeInStagger, FadeInItem } from '@/components/fade-in'

const FOUNDERS = [
  {
    initials: 'JB',
    name: 'José Roberto Baptista Jr.',
    role: 'Co-founder & Principal Engineer',
    focus: ['Arquitetura de sistema', 'Backend & IA', 'Product strategy'],
    quote: 'Construo sistemas que escalam porque foram pensados certos desde o início.',
  },
  {
    initials: 'ML',
    name: 'Marco Lúcio Moreira',
    role: 'Co-founder & CEO',
    focus: ['Frontend & Design systems', 'Produto & UX', 'Relacionamento com clientes'],
    quote: 'O produto só termina quando o cliente consegue usar sem precisar de manual.',
  },
]

const VALUES = [
  { label: 'Escopo fechado', text: 'Sem surpresas de custo ou prazo. Cada projeto começa com um documento assinado.' },
  { label: 'Transparência total', text: 'Workspace dedicado para o cliente ver cada commit, milestone e decisão.' },
  { label: 'Entregas, não horas', text: 'Cobramos por resultado. Você paga pelo que foi entregue, não pelo tempo.' },
  { label: 'Código que você fica', text: 'Ao final você tem o código-fonte, a documentação e independência total.' },
]

export function TeamV2() {
  return (
    <section className="py-28 px-6 bg-neutral-50 border-t border-neutral-100" id="team">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">
            Time
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-semibold tracking-[-0.03em] text-neutral-900 max-w-2xl mb-4 leading-[1.1]">
            Um estúdio pequeno.{' '}
            <span className="text-neutral-400">Um padrão alto.</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-[16px] text-neutral-400 max-w-lg mb-16 leading-relaxed">
            Somos dois founders que constroem produto há mais de 4 anos. Cada projeto é tratado como se fosse o nosso próprio.
          </p>
        </FadeIn>

        {/* Founders */}
        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {FOUNDERS.map(f => (
            <FadeInItem key={f.initials}>
              <div className="rounded-2xl border border-neutral-200 bg-white p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[14px] font-semibold flex-shrink-0">
                    {f.initials}
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-neutral-900">{f.name}</p>
                    <p className="text-[13px] text-neutral-400 mt-0.5">{f.role}</p>
                  </div>
                </div>
                <p className="text-[15px] text-neutral-600 leading-relaxed italic mb-6">
                  &ldquo;{f.quote}&rdquo;
                </p>
                <div className="flex flex-wrap gap-2">
                  {f.focus.map(item => (
                    <span key={item} className="text-[11px] text-neutral-500 bg-neutral-50 border border-neutral-100 px-2.5 py-1 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>

        {/* Values */}
        <FadeIn>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-6">
            Nossos princípios
          </p>
        </FadeIn>
        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUES.map(v => (
            <FadeInItem key={v.label}>
              <div className="p-6 rounded-2xl border border-neutral-200 bg-white">
                <p className="text-[13px] font-semibold text-neutral-900 mb-2">{v.label}</p>
                <p className="text-[12px] text-neutral-500 leading-relaxed">{v.text}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}
