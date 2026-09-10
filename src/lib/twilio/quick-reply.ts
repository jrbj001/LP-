import { firstTurnWelcome, isOrientationAsk } from '@/lib/backlog/welcome'
import { routeWhatsappSender } from './routing'

const CLIENT_NAMES: Record<string, string> = {
  'be180-ooh': 'Be180 OOH',
  likeme: 'Like:Me',
  pixelpulselab: 'PixelPulseLab',
}

/** Menu do oi — sem Copilot, banco, GitHub ou persistência. */
export function orientationWelcome(
  to: string,
  body: string
): { from: string; clientSlug: string; reply: string } | null {
  if (!isOrientationAsk(body)) return null
  const route = routeWhatsappSender(to)
  if (!route) return null
  const name = CLIENT_NAMES[route.clientSlug]
  if (!name) return null
  return {
    from: route.from,
    clientSlug: route.clientSlug,
    reply: firstTurnWelcome(route.clientSlug, name),
  }
}
