'use client'

import { motion } from 'framer-motion'
import type { ClientWorkspace, DocCategory } from '@/lib/client/types'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

function CategoryIcon({ id }: { id: string }) {
  const className = 'w-5 h-5'
  switch (id) {
    case 'getting-started':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
          <path d="M9 4.804A7.968 7.968 0 0 0 5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0 1 5 14c1.396 0 2.7.37 3.82 1.016A7.967 7.967 0 0 1 10 14.804V4.804zM11 4.804A7.968 7.968 0 0 1 15 4c1.255 0 2.443.29 3.5.804v10A7.969 7.969 0 0 0 15 14a7.97 7.97 0 0 0-4 1.016V4.804z" />
        </svg>
      )
    case 'projeto':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
          <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
          <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
          <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
        </svg>
      )
    case 'integracoes':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
          <path d="M11 3a1 1 0 1 0-2 0v1a1 1 0 1 0 2 0V3zM6.343 4.929a1 1 0 0 0-1.414 0l-.707.707a1 1 0 0 0 1.414 1.414l.707-.707a1 1 0 0 0 0-1.414zM15.071 4.929a1 1 0 0 0-1.414 1.414l.707.707a1 1 0 0 0 1.414-1.414l-.707-.707zM2 9a1 1 0 0 0 0 2h1a1 1 0 1 0 0-2H2zm16 0a1 1 0 1 0 0 2h1a1 1 0 1 0 0-2h-1zm-7 4a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
          <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-3a1 1 0 0 0-.867.5 1 1 0 1 1-1.731-1A3 3 0 0 1 13 8a3.001 3.001 0 0 1-2 2.83V11a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1 1 1 0 1 0 0-2zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
        </svg>
      )
  }
}

function DocCard({ cat, accent }: { cat: DocCategory; accent: string }) {
  return (
    <div className="group relative flex flex-col gap-4 p-5 rounded-2xl border border-black/[0.06] bg-white hover:border-black/[0.12] transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${accent}14`, color: accent }}
        >
          <CategoryIcon id={cat.id} />
        </div>
        <span
          className="font-mono text-[10px] tracking-widest uppercase px-2 py-1 rounded-full border"
          style={{ color: accent, borderColor: `${accent}33` }}
        >
          {cat.badge}
        </span>
      </div>

      <div>
        <h3 className="text-[15px] font-semibold text-neutral-900 mb-1">{cat.title}</h3>
        <p className="text-[13px] text-neutral-500 leading-relaxed">{cat.description}</p>
      </div>

      <ul className="flex flex-col gap-1.5 mt-auto">
        {cat.articles.map(article => (
          <li key={article} className="flex items-center gap-2 text-[12px] text-neutral-400">
            <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: accent }} />
            {article}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DocsPortal({ client }: { client: ClientWorkspace }) {
  const { eyebrow, title, titleAccent, categories, supportEmail } = client.docs
  const accent = client.accent

  return (
    <section id="docs" className="py-20 sm:py-24 border-t border-black/[0.05] scroll-mt-20">
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="mb-12">
          <p className="text-[12px] font-mono uppercase tracking-[0.18em] text-neutral-400 mb-3">
            {eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] max-w-xl text-neutral-900">
            {title}{' '}
            <span className="text-neutral-500">{titleAccent}</span>
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {categories.map(cat => (
            <motion.div key={cat.id} variants={item}>
              <DocCard cat={cat} accent={accent} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl border border-black/[0.06] bg-white">
          <div className="flex-1">
            <p className="text-[14px] font-medium text-neutral-800">Não encontrou o que precisa?</p>
            <p className="text-[12px] text-neutral-500 mt-0.5">
              Nossa equipe responde em até 4 horas no horário comercial.
            </p>
          </div>
          <a
            href={`mailto:${supportEmail}`}
            className="shrink-0 px-4 py-2.5 text-[13px] font-medium bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
          >
            Falar com a equipe
          </a>
        </div>
      </div>
    </section>
  )
}
