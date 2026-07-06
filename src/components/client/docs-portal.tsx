'use client'

import { motion } from 'framer-motion'

const CATEGORIES = [
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M9 4.804A7.968 7.968 0 0 0 5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0 1 5 14c1.396 0 2.7.37 3.82 1.016A7.967 7.967 0 0 1 10 14.804V4.804zM11 4.804A7.968 7.968 0 0 1 15 4c1.255 0 2.443.29 3.5.804v10A7.969 7.969 0 0 0 15 14a7.97 7.97 0 0 0-4 1.016V4.804z" />
      </svg>
    ),
    title: 'Getting Started',
    description: 'Setup inicial, credenciais de acesso, primeiros passos e visão geral da arquitetura.',
    articles: ['Acesso ao workspace', 'Configuração do ambiente local', 'Fluxo de deploy', 'Primeiros testes'],
    color: '#6366f1',
    badge: 'Essencial',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 0 1 .633 1.265l-4 12a1 1 0 1 1-1.898-.632l4-12a1 1 0 0 1 1.265-.633zM5.707 6.293a1 1 0 0 1 0 1.414L3.414 10l2.293 2.293a1 1 0 1 1-1.414 1.414l-3-3a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 0zm8.586 0a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 1 1-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 0 1 0-1.414z" clipRule="evenodd" />
      </svg>
    ),
    title: 'API Reference',
    description: 'Endpoints, autenticação, rate limits, exemplos de request/response e SDKs.',
    articles: ['Autenticação & tokens', 'Endpoints disponíveis', 'Webhooks', 'SDK TypeScript'],
    color: '#8b5cf6',
    badge: 'Técnico',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M11 3a1 1 0 1 0-2 0v1a1 1 0 1 0 2 0V3zM6.343 4.929a1 1 0 0 0-1.414 0l-.707.707a1 1 0 0 0 1.414 1.414l.707-.707a1 1 0 0 0 0-1.414zM15.071 4.929a1 1 0 0 0-1.414 1.414l.707.707a1 1 0 0 0 1.414-1.414l-.707-.707zM2 9a1 1 0 0 0 0 2h1a1 1 0 1 0 0-2H2zm16 0a1 1 0 1 0 0 2h1a1 1 0 1 0 0-2h-1zm-7 4a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      </svg>
    ),
    title: 'Integrações',
    description: 'Guias passo a passo para conectar Supabase, OpenAI, Stripe, Slack e outros parceiros.',
    articles: ['Supabase + Auth0', 'OpenAI / Claude', 'Stripe Billing', 'Slack Notifications'],
    color: '#a78bfa',
    badge: 'Guias',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
        <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
        <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
      </svg>
    ),
    title: 'Arquitetura',
    description: 'Decisões de design, ADRs, diagramas de infraestrutura e padrões adotados.',
    articles: ['Visão geral do sistema', 'Decisões de arquitetura', 'Diagrama de infra', 'Padrões de código'],
    color: '#c4b5fd',
    badge: 'Design',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0 0 10 1.944 11.954 11.954 0 0 0 17.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Segurança & Compliance',
    description: 'Políticas de acesso, LGPD, backups, auditoria de logs e resposta a incidentes.',
    articles: ['Política de acesso', 'LGPD & privacidade', 'Backup & recovery', 'Runbook de incidentes'],
    color: '#ddd6fe',
    badge: 'Compliance',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-3a1 1 0 0 0-.867.5 1 1 0 1 1-1.731-1A3 3 0 0 1 13 8a3.001 3.001 0 0 1-2 2.83V11a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1 1 1 0 1 0 0-2zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Suporte',
    description: 'Canais de atendimento, SLAs de resposta, como abrir tickets e escalonamento.',
    articles: ['Abrir um ticket', 'SLAs de resposta', 'Escalonamento', 'Contato direto'],
    color: '#ede9fe',
    badge: 'Suporte',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export function DocsPortal() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-[1200px] px-6">

        <div className="mb-16">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted mb-4">
            Documentation
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] max-w-xl">
              Tudo que você precisa{' '}
              <span className="text-text-secondary">em um só lugar</span>
            </h2>

            {/* Search bar (visual) */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/30 text-sm w-full sm:w-64 flex-shrink-0">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              Buscar documentação…
              <span className="ml-auto font-mono text-[10px] border border-white/[0.1] rounded px-1.5 py-0.5">⌘K</span>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.title}
              variants={item}
              className="group relative flex flex-col gap-5 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Hover glow */}
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: cat.color }}
              />

              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: cat.color + '1a', color: cat.color }}
                >
                  {cat.icon}
                </div>
                <span
                  className="font-mono text-[10px] tracking-widest uppercase px-2 py-1 rounded-full border"
                  style={{ color: cat.color, borderColor: cat.color + '33' }}
                >
                  {cat.badge}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-base font-semibold text-white/90 mb-1.5">{cat.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{cat.description}</p>
              </div>

              {/* Article list */}
              <ul className="flex flex-col gap-1.5 mt-auto">
                {cat.articles.map(article => (
                  <li key={article} className="flex items-center gap-2 text-xs text-white/30 group-hover:text-white/50 transition-colors">
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color + '80' }} />
                    {article}
                  </li>
                ))}
              </ul>

              {/* Arrow */}
              <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" style={{ color: cat.color }}>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <div className="flex-1">
            <p className="text-sm font-medium text-white/70">Não encontrou o que precisa?</p>
            <p className="text-xs text-white/30 mt-0.5">Nossa equipe responde em até 4 horas no horário comercial.</p>
          </div>
          <a
            href="mailto:hello@pixelpulselab.dev"
            className="flex-shrink-0 px-5 py-2.5 text-sm font-medium bg-white text-black rounded-full hover:bg-white/90 transition-all"
          >
            Falar com a equipe
          </a>
        </div>

      </div>
    </section>
  )
}
