'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, Sparkles, X } from 'lucide-react'
import { experienceById, type IrisCopy, type IrisLocale } from '@/lib/iris/data'

interface Message {
  role: 'user' | 'assistant'
  text: string
  experience?: string | null
}

export function IrisAgent({
  locale,
  podId,
  copy,
  onUseExperience,
}: {
  locale: IrisLocale
  podId: string
  copy: IrisCopy
  onUseExperience?: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  async function ask(question: string) {
    const text = question.trim()
    if (!text || thinking) return
    const history = messages.map(({ role, text: body }) => ({ role, text: body }))
    setMessages(current => [...current, { role: 'user', text }])
    setDraft('')
    setThinking(true)
    try {
      const res = await fetch('/api/iris/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, locale, podId, history }),
      })
      const data = await res.json()
      setMessages(current => [
        ...current,
        { role: 'assistant', text: data.ok ? data.answer : copy.genericError, experience: data.ok ? data.experience : null },
      ])
    } catch {
      setMessages(current => [...current, { role: 'assistant', text: copy.genericError }])
    } finally {
      setThinking(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[var(--iris-ink)] px-5 py-3.5 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iris-accent)] focus-visible:ring-offset-2"
          >
            <Sparkles className="size-4 text-[var(--iris-wood)]" aria-hidden />
            {copy.ask}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            key="panel"
            role="dialog"
            aria-label={copy.ask}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed inset-x-3 bottom-3 z-50 flex max-h-[min(560px,80vh)] flex-col overflow-hidden rounded-[24px] border border-[var(--iris-line)] bg-[var(--iris-card)] shadow-2xl shadow-black/15 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[380px]"
          >
            <div className="flex items-center justify-between border-b border-[var(--iris-line)] px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-full bg-[var(--iris-accent)] text-white">
                  <Sparkles className="size-4" aria-hidden />
                </span>
                <span className="text-sm font-semibold">{copy.ask}</span>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label={copy.close} className="rounded-full p-1.5 text-[var(--iris-muted)] hover:bg-[var(--iris-line)]">
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4 text-sm" aria-live="polite">
              <Bubble role="assistant">{copy.agentHello}</Bubble>
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {copy.suggestions.map(suggestion => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => ask(suggestion)}
                      className="rounded-full border border-[var(--iris-line)] bg-white px-3 py-1.5 text-xs transition hover:border-[var(--iris-accent)] hover:text-[var(--iris-accent)]"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((message, index) => {
                const experience = experienceById(message.experience)
                return (
                  <div key={index} className="space-y-2">
                    <Bubble role={message.role}>{message.text}</Bubble>
                    {experience && onUseExperience && (
                      <button
                        type="button"
                        onClick={() => {
                          onUseExperience(experience.id)
                          setOpen(false)
                        }}
                        className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-[var(--iris-accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--iris-accent)] transition hover:bg-[var(--iris-accent)] hover:text-white"
                      >
                        {copy.useExperience}: {experience.name[locale]}
                      </button>
                    )}
                  </div>
                )
              })}
              {thinking && (
                <div className="flex gap-1 px-1 py-2" aria-hidden>
                  {[0, 1, 2].map(dot => (
                    <motion.span
                      key={dot}
                      className="size-1.5 rounded-full bg-[var(--iris-muted)]"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.2 }}
                    />
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={event => {
                event.preventDefault()
                ask(draft)
              }}
              className="flex items-center gap-2 border-t border-[var(--iris-line)] p-3"
            >
              <input
                ref={inputRef}
                value={draft}
                onChange={event => setDraft(event.target.value)}
                placeholder={copy.askPlaceholder}
                maxLength={500}
                className="h-11 flex-1 rounded-full border border-[var(--iris-line)] bg-white px-4 text-sm outline-none focus:border-[var(--iris-accent)]"
              />
              <button
                type="submit"
                disabled={!draft.trim() || thinking}
                aria-label={copy.send}
                className="grid size-11 place-items-center rounded-full bg-[var(--iris-accent)] text-white transition disabled:opacity-40"
              >
                <ArrowUp className="size-4" aria-hidden />
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  return (
    <p
      className={
        role === 'user'
          ? 'ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-[var(--iris-ink)] px-3.5 py-2.5 text-white'
          : 'w-fit max-w-[90%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 leading-relaxed'
      }
    >
      {children}
    </p>
  )
}
