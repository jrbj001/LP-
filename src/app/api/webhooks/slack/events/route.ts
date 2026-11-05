import { after } from 'next/server'
import { prepareSlackEvent } from '@/lib/slack/inbound'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: Request): Promise<Response> {
  const prepared = await prepareSlackEvent(request)
  if (prepared.work) {
    after(() =>
      prepared.work!().catch(error => {
        console.error('[slack/events]', error)
      })
    )
  }
  return prepared.response
}
