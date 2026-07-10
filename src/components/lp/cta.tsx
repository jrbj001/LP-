'use client'

import { FadeIn } from '@/components/fade-in'

export function CtaV2() {
  return (
    <section className="py-28 px-6 bg-neutral-900 overflow-hidden relative" id="cta">

      {/* subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] text-center">
        <FadeIn>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/30 mb-6">
            Próximo projeto
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-[32px] sm:text-[48px] lg:text-[64px] font-semibold tracking-[-0.04em] text-white leading-[1.0] mb-6 max-w-3xl mx-auto">
            Tem um problema que merece uma solução de verdade?
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-[16px] text-white/50 max-w-xl mx-auto mb-12 leading-relaxed">
            Conta pra gente o que você quer construir. Respondemos em até 24h com uma análise inicial sem compromisso.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:ze@pixelpulselab.dev"
              className="px-8 py-4 text-[14px] font-medium bg-white text-neutral-900 rounded-full hover:bg-neutral-100 transition-all"
            >
              Enviar e-mail
            </a>
            <a
              href="https://wa.me/5511981058468"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 text-[14px] font-medium border border-white/20 text-white/70 rounded-full hover:border-white/50 hover:text-white transition-all"
            >
              WhatsApp
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
