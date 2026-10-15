import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LikeMeGlp1WorkplanView } from '@/components/client/documents/likeme-glp1-workplan-view'
import { isBacklogEnabled } from '@/lib/backlog/access'
import { getBacklogSnapshot } from '@/lib/backlog/store'
import { getClient } from '@/lib/client/registry'
import { glp1TaskStates, type Glp1TaskState } from '@/lib/plans/likeme-glp1'

type Props = {
  params: Promise<{ locale: string; clientId: string }>
}

// O estado das stories vem do backlog em tempo de request.
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clientId } = await params
  const client = getClient(clientId)

  if (!client || client.slug !== 'likeme') {
    return { title: 'Documento não encontrado | PixelPulseLab' }
  }

  return {
    title: `Plano GLP-1 Dr. Matheus | ${client.name}`,
    description:
      'Plano de trabalho do flagship GLP-1 com o Dr. Matheus: jornada de 15 etapas, roadmap com prazos, esforço por story e envio direto ao backlog.',
    robots: { index: false, follow: false },
  }
}

export default async function LikeMeGlp1WorkplanPage({ params }: Props) {
  const { locale, clientId } = await params
  const client = getClient(clientId)

  if (!client || client.slug !== 'likeme') notFound()

  const backlogReady = isBacklogEnabled(client.slug)
  let taskStates: Glp1TaskState[] = []
  if (backlogReady) {
    try {
      const snapshot = await getBacklogSnapshot(client.slug)
      taskStates = glp1TaskStates(snapshot.cards)
    } catch (error) {
      console.error('[client/plano-glp1] falha ao ler o backlog:', error)
    }
  }

  return (
    <LikeMeGlp1WorkplanView
      locale={locale}
      clientSlug={client.slug}
      accent={client.accent}
      taskStates={taskStates}
      backlogReady={backlogReady}
    />
  )
}
