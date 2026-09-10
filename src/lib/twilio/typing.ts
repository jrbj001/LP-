import 'server-only'

/**
 * Mostra os três pontinhos no WhatsApp enquanto o copiloto pensa.
 * A API marca a mensagem recebida como lida e mantém o indicador por ~25s.
 */
export async function sendWhatsappTyping(messageSid?: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const messageId = messageSid?.trim()
  if (!sid || !token || !messageId) return false

  try {
    const response = await fetch('https://messaging.twilio.com/v3/Indicators/Typing.json', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channel: 'WHATSAPP', messageId }),
    })
    if (!response.ok) {
      const detail = await response.text()
      console.warn('[twilio/typing]', response.status, detail.slice(0, 200))
      return false
    }
    return true
  } catch (error) {
    console.warn('[twilio/typing]', error instanceof Error ? error.message : error)
    return false
  }
}

/** Renova o indicador a cada 20s enquanto o trabalho roda (WhatsApp corta em ~25s). */
export async function withWhatsappTyping<T>(messageSid: string | undefined, work: () => Promise<T>): Promise<T> {
  await sendWhatsappTyping(messageSid)
  if (!messageSid?.trim()) return work()

  const timer = setInterval(() => {
    void sendWhatsappTyping(messageSid)
  }, 20_000)
  try {
    return await work()
  } finally {
    clearInterval(timer)
  }
}
