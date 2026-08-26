import { DiagnosticView } from '@/components/alquimia/space/engagement-views'

export default async function AlquimiaDiagnosticPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params
  return <DiagnosticView clientId={clientId} />
}
