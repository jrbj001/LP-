import { after } from 'next/server'
import { prepareMondayAgentRequest } from '@/lib/monday-agent/inbound'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: Request): Promise<Response> {
  const prepared = await prepareMondayAgentRequest(request)
  if (prepared.work) {
    after(() =>
      prepared.work!().catch(error => {
        console.error('[monday/agent]', error)
      })
    )
  }
  return prepared.response
}
