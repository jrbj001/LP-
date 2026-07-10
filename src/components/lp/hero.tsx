'use client'

import { motion } from 'framer-motion'

export function HeroV2() {
  return (
    <section className="relative min-h-screen flex items-center pt-[68px] bg-white overflow-hidden">

      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-24 md:py-32 w-full">

        {/* Eyebrow */}
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 bg-neutral-50 mb-10"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[12px] font-medium text-neutral-500 tracking-wide">
            Estúdio de produto digital · São Paulo, BR
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-[42px] sm:text-[56px] md:text-[72px] lg:text-[88px] font-semibold leading-[1.0] tracking-[-0.04em] text-neutral-900 max-w-5xl mb-8"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          Construímos produtos{' '}
          <span className="text-neutral-400">que transformam dados em valor.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          className="text-[16px] sm:text-[18px] text-neutral-500 max-w-xl leading-relaxed mb-12"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          Plataformas web, apps mobile e IA integrada — do escopo ao deploy.
          Entregas em milestones, sem caixa-preta.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
        >
          <a
            href="#cta"
            className="px-7 py-3.5 text-[14px] font-medium bg-neutral-900 text-white rounded-full hover:bg-neutral-700 transition-all"
          >
            Iniciar um projeto
          </a>
          <a
            href="#cases"
            className="px-7 py-3.5 text-[14px] font-medium border border-neutral-200 text-neutral-600 rounded-full hover:border-neutral-400 hover:text-neutral-900 transition-all"
          >
            Ver cases
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex flex-wrap gap-10 mt-20 pt-12 border-t border-neutral-100"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {[
            { n: '4+', label: 'anos de estúdio' },
            { n: '20+', label: 'produtos entregues' },
            { n: '100%', label: 'entregas com escopo fechado' },
            { n: '3', label: 'linguagens · PT · EN · 中文' },
          ].map(s => (
            <div key={s.n}>
              <p className="text-[28px] font-semibold text-neutral-900 tracking-[-0.03em]">{s.n}</p>
              <p className="text-[13px] text-neutral-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
