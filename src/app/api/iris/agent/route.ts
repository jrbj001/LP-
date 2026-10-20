import { NextResponse } from 'next/server'
import { hasDatabase } from '@/lib/postgres'
import { callOpenAiJson, chatModel } from '@/lib/backlog/llm'
import { experiencesFor, faqAnswer, irisLocale, KNOWLEDGE, podById, type IrisPod } from '@/lib/iris/data'
import { generateSlots, podDays } from '@/lib/iris/slots'
import { listTakenStarts } from '@/lib/iris/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface Turn {
  role: 'user' | 'assistant'
  text: string
}

function parseHistory(value: unknown): Turn[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((turn): turn is Turn =>
      Boolean(turn) &&
      (turn.role === 'user' || turn.role === 'assistant') &&
      typeof turn.text === 'string'
    )
    .slice(-6)
    .map(turn => ({ role: turn.role, text: turn.text.slice(0, 500) }))
}

async function nextFree(pod: IrisPod): Promise<string[]> {
  if (!hasDatabase()) return []
  const now = new Date()
  const out: string[] = []
  for (const day of podDays(pod, now).slice(0, 2)) {
    const taken = await listTakenStarts(pod, day)
    for (const slot of generateSlots(pod, day, now, taken)) {
      if (slot.status === 'free') out.push(`${day} ${slot.time}`)
      if (out.length >= 4) return out
    }
  }
  return out
}

function system(locale: 'pt' | 'en'): string {
  return [
    'You are Iris, the booking concierge for the OpenSeed Iris 2027 meditation pod.',
    `Answer in ${locale === 'pt' ? 'Brazilian Portuguese' : 'English'}, in at most three short, calm sentences.`,
    'Only talk about the pod, its experiences and booking. If asked anything else, gently steer back.',
    'Never make medical claims: say "supports relaxation", never "treats" or "cures". Suggest a doctor for health conditions.',
    'Never invent prices, availability or personal data. Use only the facts and free times given.',
    'Return JSON: {"answer": string, "experience": string | null}. Set "experience" to one of the available experience ids only when recommending one.',
    '',
    KNOWLEDGE,
  ].join('\n')
}

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid' }, { status: 400 })
  }

  const question = typeof body.question === 'string' ? body.question.trim().slice(0, 500) : ''
  if (!question) return NextResponse.json({ ok: false, reason: 'invalid' }, { status: 400 })
  const locale = irisLocale(typeof body.locale === 'string' ? body.locale : null)
  const pod = podById(typeof body.podId === 'string' ? body.podId : null)
  const available = pod ? experiencesFor(pod) : []
  const allowed = new Set(available.map(item => item.id))

  const fallback = () => {
    const faq = faqAnswer(question, locale)
    return NextResponse.json({
      ok: true,
      source: 'faq',
      answer: faq.answer,
      experience: faq.experience && allowed.has(faq.experience) ? faq.experience : null,
    })
  }

  if (!process.env.OPENAI_API_KEY) return fallback()

  try {
    const free = pod ? await nextFree(pod).catch(() => []) : []
    const history = parseHistory(body.history)
    const context = [
      pod
        ? `Selected pod: ${pod.name}, ${pod.place.en}. Open ${pod.openHour}:00 to ${pod.closeHour}:00 local time. Red light: ${pod.redLight ? 'yes' : 'no'}. Headrest for naps: ${pod.headrest ? 'yes' : 'no'}.`
        : 'No pod selected yet.',
      `Available experience ids: ${available.map(item => `${item.id} (${item.name.en})`).join(', ') || 'none'}.`,
      free.length ? `Next free times (pod local): ${free.join(', ')}.` : 'Free times unknown.',
      history.length ? `Conversation so far:\n${history.map(turn => `${turn.role}: ${turn.text}`).join('\n')}` : '',
      `User: ${question}`,
    ]
      .filter(Boolean)
      .join('\n')

    const result = (await callOpenAiJson(system(locale), context, {
      model: chatModel(),
      maxTokens: 300,
      temperature: 0.3,
    })) as { answer?: unknown; experience?: unknown }

    const answer = typeof result.answer === 'string' ? result.answer.trim().slice(0, 700) : ''
    if (!answer) return fallback()
    const experience = typeof result.experience === 'string' && allowed.has(result.experience) ? result.experience : null
    return NextResponse.json({ ok: true, source: 'model', answer, experience })
  } catch (error) {
    console.error('[iris/agent]', error)
    return fallback()
  }
}
