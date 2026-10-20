export type IrisLocale = 'pt' | 'en'

export function irisLocale(locale: string | null | undefined): IrisLocale {
  return locale === 'en' ? 'en' : 'pt'
}

export function normalizeWhatsapp(value: string): string | null {
  const digits = value.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15) return null
  return digits
}

export function formatWhatsapp(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  if (digits.length === 13 && digits.startsWith('55')) {
    return `+55 (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`
  }
  return digits ? `+${digits}` : value
}

export type Localized = Record<IrisLocale, string>

export interface IrisPod {
  id: string
  name: string
  place: Localized
  timeZone: string
  openHour: number
  closeHour: number
  redLight: boolean
  headrest: boolean
}

export const SESSION_MINUTES = 15
export const BUFFER_MINUTES = 5
export const STEP_MINUTES = SESSION_MINUTES + BUFFER_MINUTES
export const BOOKING_HORIZON_DAYS = 7

export const PODS: IrisPod[] = [
  {
    id: 'miami-lobby',
    name: 'Iris · Lobby',
    place: { pt: 'Mindspace Miami, térreo', en: 'Mindspace Miami, ground floor' },
    timeZone: 'America/New_York',
    openHour: 8,
    closeHour: 20,
    redLight: true,
    headrest: true,
  },
  {
    id: 'miami-3f',
    name: 'Iris · 3rd floor',
    place: { pt: 'Mindspace Miami, 3º andar', en: 'Mindspace Miami, 3rd floor' },
    timeZone: 'America/New_York',
    openHour: 9,
    closeHour: 18,
    redLight: false,
    headrest: false,
  },
  {
    id: 'sp-paulista',
    name: 'Iris · Paulista',
    place: { pt: 'São Paulo, Av. Paulista', en: 'São Paulo, Paulista Ave.' },
    timeZone: 'America/Sao_Paulo',
    openHour: 8,
    closeHour: 19,
    redLight: true,
    headrest: true,
  },
]

export function podById(id: string | null | undefined): IrisPod | null {
  return PODS.find(pod => pod.id === id) ?? null
}

export interface IrisExperience {
  id: string
  name: Localized
  benefit: Localized
  needs?: 'redLight' | 'headrest'
}

export const EXPERIENCES: IrisExperience[] = [
  {
    id: 'calm',
    name: { pt: 'Calm', en: 'Calm' },
    benefit: { pt: 'Meditação guiada para baixar o ritmo.', en: 'Guided meditation to slow things down.' },
  },
  {
    id: 'deep-breath',
    name: { pt: 'Deep Breath', en: 'Deep Breath' },
    benefit: { pt: 'Luz que respira com você. Ansiedade cai.', en: 'Light that breathes with you. Anxiety drops.' },
  },
  {
    id: 'reset',
    name: { pt: 'Reset', en: 'Reset' },
    benefit: { pt: 'Pausa curta entre reuniões, volta focado.', en: 'A short pause between meetings. Back focused.' },
  },
  {
    id: 'breath-of-fire',
    name: { pt: 'Breath of Fire', en: 'Breath of Fire' },
    benefit: { pt: 'Respiração ativa para recuperar energia.', en: 'Active breathwork to get energy back.' },
  },
  {
    id: 'good-vibes',
    name: { pt: 'Good Vibes', en: 'Good Vibes' },
    benefit: { pt: 'Vibroacústica: o corpo sente a frequência.', en: 'Vibroacoustics: your body feels the frequency.' },
  },
  {
    id: 'red-light',
    name: { pt: 'Red Light', en: 'Red Light' },
    benefit: { pt: 'Luz vermelha com meditação para recuperação.', en: 'Red light with meditation for recovery.' },
    needs: 'redLight',
  },
  {
    id: 'nap',
    name: { pt: 'Power Nap', en: 'Power Nap' },
    benefit: { pt: 'Cochilo de 10 a 15 min com apoio de cabeça.', en: '10 to 15 min nap with full head support.' },
    needs: 'headrest',
  },
]

export function experiencesFor(pod: IrisPod): IrisExperience[] {
  return EXPERIENCES.filter(item => !item.needs || pod[item.needs])
}

export function experienceById(id: string | null | undefined): IrisExperience | null {
  return EXPERIENCES.find(item => item.id === id) ?? null
}

export const KNOWLEDGE = `
Iris 2027 is a meditation pod by OpenSeed, designed to accelerate nervous system regulation.
It combines natural materials (wood and wool felt), sound insulation (blocks about 20 dB), light therapy synced to audio for breathwork cues, sound therapy, vibroacoustic therapy (six transducers under floor, seat and backrest), red light therapy (630, 660 and 850 nm, only in pods with the add-on), guided mindfulness meditation and aromatherapy (lavender, chamomile, frankincense sprays: shake and mist 2 to 3 times).
A built-in tablet lets the user pick an experience and adjust vibroacoustics, red light, volume and light intensity. Headphones are included.
Experiences: Calm, Deep Breath, Reset, Breath of Fire, Good Vibes (vibroacoustic, for gratitude and mood), Red Light (relaxation, mental clarity, recovery), Power Nap (only in pods with high backrest and headrest).
A soft lock keeps the session private and an external red indicator shows the pod is occupied. Ventilation is automatic with four fans.
Pods average about 11 sessions per day across workplaces, hospitals and residential buildings.
Booking rules: sessions are ${SESSION_MINUTES} minutes, followed by ${BUFFER_MINUTES} minutes for airflow and a quick wipe. You can book up to ${BOOKING_HORIZON_DAYS} days ahead, one session per person per day. Choosing the experience is optional; you can decide inside the pod. Cancel any time with your booking code and email on the booking page. Arrive 2 minutes early, use the headphones and slide the soft lock.
`.trim()

export const COPY = {
  pt: {
    tagline: 'Step in. Reset.',
    concept: 'Um pod para regular o sistema nervoso em 15 minutos. Madeira, feltro, luz, som e vibração. Você reserva, entra, e o tablet conduz o resto.',
    materials: 'Madeira · Feltro · Luz · Som · Vibração',
    story: 'A sessão',
    bookCta: 'Reservar um horário',
    title: 'Reserve um horário',
    subtitle: 'Escolha o pod e 15 minutos. A experiência você decide aqui ou lá dentro.',
    stepPod: 'Pod',
    stepTime: 'Horário',
    stepYou: 'Você',
    today: 'Hoje',
    tomorrow: 'Amanhã',
    nextFree: 'Próximo livre',
    noSlots: 'Sem horários livres neste dia. Tente o próximo.',
    loadingSlots: 'Buscando horários…',
    minutes: 'min',
    experience: 'Experiência',
    decideInPod: 'Decidir no pod',
    name: 'Nome',
    email: 'E-mail',
    whatsapp: 'WhatsApp',
    whatsappPlaceholder: '(11) 99999-9999',
    confirm: 'Confirmar reserva',
    confirming: 'Reservando…',
    change: 'Trocar',
    booked: 'Reservado.',
    bookedBody: 'Seu pod te espera. Guarde o código para cancelar.',
    code: 'Código',
    addCalendar: 'Adicionar ao calendário',
    cancel: 'Cancelar reserva',
    cancelling: 'Cancelando…',
    cancelled: 'Reserva cancelada. O horário voltou para a agenda.',
    bookAnother: 'Fazer outra reserva',
    tips: ['Chegue 2 min antes.', 'Use o fone e deslize a trava.', 'Escolha a experiência no tablet, se ainda não escolheu.'],
    taken: 'Acabou de ser reservado. Veja o próximo horário.',
    sameDay: 'Você já tem uma sessão neste dia. Uma por dia, para todo mundo caber.',
    invalid: 'Confira nome, e-mail e WhatsApp.',
    language: 'Idioma',
    unavailable: 'Agenda indisponível no momento.',
    genericError: 'Não deu certo agora. Tente de novo.',
    podTime: 'Horário local do pod',
    sessionLength: 'Sessão de 15 min',
    ask: 'Pergunte ao Iris',
    askPlaceholder: 'Dúvida sobre o pod ou a reserva…',
    send: 'Enviar',
    useExperience: 'Usar esta experiência',
    agentHello: 'Oi. Posso ajudar a escolher a experiência ou tirar dúvidas da reserva.',
    suggestions: ['Qual experiência para ansiedade?', 'Posso cochilar?', 'Red light é seguro?', 'Como cancelo?'],
    close: 'Fechar',
    footer: 'Iris 2027 por OpenSeed. Sessões de 15 min, até 7 dias à frente.',
  },
  en: {
    tagline: 'Step in. Reset.',
    concept: 'A pod that regulates the nervous system in 15 minutes. Wood, felt, light, sound and vibration. You book, step in, and the tablet does the rest.',
    materials: 'Wood · Felt · Light · Sound · Vibration',
    story: 'The session',
    bookCta: 'Book a time',
    title: 'Book a time',
    subtitle: 'Pick the pod and 15 minutes. Choose the experience here, or inside.',
    stepPod: 'Pod',
    stepTime: 'Time',
    stepYou: 'You',
    today: 'Today',
    tomorrow: 'Tomorrow',
    nextFree: 'Next free',
    noSlots: 'No free times this day. Try the next one.',
    loadingSlots: 'Finding times…',
    minutes: 'min',
    experience: 'Experience',
    decideInPod: 'Decide in the pod',
    name: 'Name',
    email: 'Email',
    whatsapp: 'WhatsApp',
    whatsappPlaceholder: '+1 555 000 0000',
    confirm: 'Confirm booking',
    confirming: 'Booking…',
    change: 'Change',
    booked: 'Booked.',
    bookedBody: 'Your pod is waiting. Keep the code to cancel.',
    code: 'Code',
    addCalendar: 'Add to calendar',
    cancel: 'Cancel booking',
    cancelling: 'Cancelling…',
    cancelled: 'Booking cancelled. The time is back on the schedule.',
    bookAnother: 'Book another',
    tips: ['Arrive 2 min early.', 'Use the headphones and slide the lock.', 'Pick the experience on the tablet if you have not yet.'],
    taken: 'Someone just took it. Check the next time.',
    sameDay: 'You already have a session that day. One per day so everyone fits.',
    invalid: 'Check your name, email and WhatsApp.',
    language: 'Language',
    unavailable: 'Schedule unavailable right now.',
    genericError: 'That did not work. Try again.',
    podTime: 'Pod local time',
    sessionLength: '15 min session',
    ask: 'Ask Iris',
    askPlaceholder: 'Question about the pod or booking…',
    send: 'Send',
    useExperience: 'Use this experience',
    agentHello: 'Hi. I can help you pick an experience or answer booking questions.',
    suggestions: ['Which experience for anxiety?', 'Can I nap?', 'Is red light safe?', 'How do I cancel?'],
    close: 'Close',
    footer: 'Iris 2027 by OpenSeed. 15 min sessions, up to 7 days ahead.',
  },
} satisfies Record<IrisLocale, Record<string, string | string[]>>

export type IrisCopy = (typeof COPY)['pt']

export type StoryScene = 'arrive' | 'lock' | 'choose' | 'leave'

export const STORY: Record<IrisLocale, Array<{ scene: StoryScene; title: string; body: string }>> = {
  pt: [
    { scene: 'arrive', title: 'Chegue', body: 'O indicador está apagado. O pod está livre.' },
    { scene: 'lock', title: 'Entre', body: 'Deslize a trava. Lá fora, o vermelho avisa que está ocupado.' },
    { scene: 'choose', title: 'Escolha', body: 'No tablet: respiração, luz, som ou vibração. Quinze minutos.' },
    { scene: 'leave', title: 'Saia', body: 'Mais calmo. O próximo horário já voltou para a agenda.' },
  ],
  en: [
    { scene: 'arrive', title: 'Arrive', body: 'The indicator is off. The pod is free.' },
    { scene: 'lock', title: 'Step in', body: 'Slide the lock. Outside, red means it is taken.' },
    { scene: 'choose', title: 'Choose', body: 'On the tablet: breath, light, sound or vibration. Fifteen minutes.' },
    { scene: 'leave', title: 'Step out', body: 'Calmer. The next time is already back on the schedule.' },
  ],
}

interface FaqEntry {
  keywords: string[]
  answer: Localized
  experience?: string
}

export const FAQ: FaqEntry[] = [
  {
    keywords: ['ansied', 'anxi', 'stress', 'estress', 'nervos'],
    answer: {
      pt: 'Para ansiedade, comece pelo Deep Breath: a luz guia a respiração e o ritmo cai em poucos minutos.',
      en: 'For anxiety, start with Deep Breath: the light guides your breathing and your pace drops within minutes.',
    },
    experience: 'deep-breath',
  },
  {
    keywords: ['cochil', 'dormir', 'nap', 'sleep', 'descans'],
    answer: {
      pt: 'Sim, nos pods com encosto alto e apoio de cabeça. Escolha Power Nap: são 10 a 15 min confortáveis.',
      en: 'Yes, in pods with the high backrest and headrest. Pick Power Nap for a comfortable 10 to 15 minutes.',
    },
    experience: 'nap',
  },
  {
    keywords: ['red light', 'red-light', 'vermelh'],
    answer: {
      pt: 'A Red Light usa 630, 660 e 850 nm com meditação guiada para apoiar relaxamento e recuperação. Você controla a intensidade no tablet; se tiver condição de saúde, consulte seu médico.',
      en: 'Red Light uses 630, 660 and 850 nm with guided meditation to support relaxation and recovery. You control intensity on the tablet; if you have a health condition, check with your doctor.',
    },
    experience: 'red-light',
  },
  {
    keywords: ['cancel', 'desmarc'],
    answer: {
      pt: 'Na tela de confirmação, toque em Cancelar reserva. O horário volta para a agenda na hora.',
      en: 'On the confirmation screen, tap Cancel booking. The time goes back on the schedule right away.',
    },
  },
  {
    keywords: ['quanto tempo', 'duração', 'how long', 'minut', 'duration'],
    answer: {
      pt: `Cada sessão tem ${SESSION_MINUTES} min, com ${BUFFER_MINUTES} min entre reservas para ventilar o pod.`,
      en: `Each session is ${SESSION_MINUTES} min, with ${BUFFER_MINUTES} min between bookings to air the pod.`,
    },
  },
  {
    keywords: ['vibra', 'good vibes', 'humor', 'mood'],
    answer: {
      pt: 'Good Vibes ativa os transdutores sob piso, assento e encosto: você sente a frequência no corpo todo.',
      en: 'Good Vibes activates the transducers under floor, seat and backrest: you feel the frequency in your whole body.',
    },
    experience: 'good-vibes',
  },
  {
    keywords: ['energia', 'energy', 'cansa', 'tired', 'foco', 'focus'],
    answer: {
      pt: 'Para energia, Breath of Fire. Para voltar focado entre reuniões, Reset.',
      en: 'For energy, Breath of Fire. To get back focused between meetings, Reset.',
    },
    experience: 'breath-of-fire',
  },
  {
    keywords: ['privac', 'private', 'barulho', 'noise', 'ocupad', 'occupied'],
    answer: {
      pt: 'A trava suave mantém a sessão privada e acende o indicador vermelho de ocupado. O pod bloqueia cerca de 20 dB e tem fone.',
      en: 'The soft lock keeps the session private and lights the red occupied indicator. The pod blocks about 20 dB and has headphones.',
    },
  },
]

export function faqAnswer(question: string, locale: IrisLocale): { answer: string; experience: string | null } {
  const text = question.toLowerCase()
  const hit = FAQ.find(entry => entry.keywords.some(keyword => text.includes(keyword)))
  if (hit) return { answer: hit.answer[locale], experience: hit.experience ?? null }
  return {
    answer:
      locale === 'pt'
        ? 'Posso ajudar com experiências, duração, cochilo, red light e cancelamento. Sessões têm 15 min e você reserva até 7 dias à frente.'
        : 'I can help with experiences, duration, naps, red light and cancelling. Sessions are 15 min and you can book up to 7 days ahead.',
    experience: null,
  }
}
