/** Fala curta. O modo de usar fica no chat, e ele só fala quando alguém chama. */
export const CADENCE_INTRO_SPOKEN =
  'Sou o Cadence, Product Engineer da equipe. O jeito de me usar está no chat.'

/** Mesmo recado de quando ele entra na call: quem ele é e como chamar. */
export const CADENCE_INTRO_CHAT =
  'Sou o Cadence, Product Engineer da PixelPulseLab. Transcrevo a reunião para o resumo, as decisões e os próximos passos. Para me perguntar algo, diga "Cadence," seguido da pergunta ou escreva @Cadence no chat. Eu só falo quando me chamam. O detalhe, os números e as fontes ficam aqui no chat.'

const INTRO_ASK =
  /\b(se apresent\w*|me apresent\w*(?!\s+a\b)|apresent\w* voc[eê]|quem (?:é|e) voc[eê]|o que voc[eê] faz)/i

export function isSelfIntro(question: string): boolean {
  if (/\bpixel|empresa|companhia/i.test(question)) return false
  return INTRO_ASK.test(question)
}
