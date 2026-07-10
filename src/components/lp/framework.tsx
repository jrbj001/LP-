'use client'

import { motion } from 'framer-motion'
import { FadeIn } from '@/components/fade-in'

const STEPS = [
  {
    n: '01',
    title: 'Kickoff',
    description: 'Definimos escopo, stack, acessos e prioridades juntos. Nada começa sem alinhamento total. Resultado: documento de escopo assinado.',
    detail: 'Duração: 1–2 dias',
  },
  {
    n: '02',
    title: 'Build em Milestones',
    description: 'Cada entrega tem milestone com data, horas estimadas e entregáveis concretos. Você acompanha tudo em tempo real no workspace dedicado.',
    detail: '1–2 semanas por milestone',
  },
  {
    n: '03',
    title: 'Validação',
    description: 'Sessão de uso real com você antes do aceite final. Ajustes de UX, acurácia e performance incorporados nesta fase — sem custo extra.',
    detail: 'Ao final de cada fase',
  },
  {
    n: '04',
    title: 'Handover',
    description: 'Documentação técnica completa, código-fonte entregue e treinamento da equipe. Você fica 100% independente ao final do projeto.',
    detail: 'Última semana do projeto',
  },
]

export function FrameworkV2() {
  return (
    <section className="py-28 px-6 bg-white border-t border-neutral-100" id="framework">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">
            Framework de trabalho
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-semibold tracking-[-0.03em] text-neutral-900 max-w-2xl mb-4 leading-[1.1]">
            Entregas previsíveis,{' '}
            <span className="text-neutral-400">sem surpresas.</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-[16px] text-neutral-400 max-w-lg mb-20 leading-relaxed">
            Todo projeto segue o mesmo processo — transparente, iterativo e com o cliente no centro de cada decisão.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-100 rounded-2xl overflow-hidden">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              className="bg-white p-8 hover:bg-neutral-50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[12px] font-mono font-medium">
                  {s.n}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block flex-1 h-px bg-neutral-100" />
                )}
              </div>
              <h3 className="text-[16px] font-semibold text-neutral-900 mb-3">{s.title}</h3>
              <p className="text-[13px] text-neutral-500 leading-relaxed mb-4">{s.description}</p>
              <span className="text-[11px] font-medium text-neutral-400 bg-neutral-50 border border-neutral-100 px-2.5 py-1 rounded-full">
                {s.detail}
              </span>
            </motion.div>
          ))}
        </div>

        <FadeIn delay={0.4} className="mt-12">
          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-8">
            <p className="text-[14px] font-medium text-neutral-900 mb-2">
              Cada projeto tem um workspace dedicado.
            </p>
            <p className="text-[13px] text-neutral-500 leading-relaxed max-w-2xl">
              Roadmap, arquitetura, módulos, horas e documentos — tudo em um único painel acessível 24h pelo cliente. Sem precisar pedir update por WhatsApp.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
