import { ArchiveHome } from '@/components/alquimia/space/archive-pages'

export default async function AlquimiaArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <ArchiveHome locale={locale} />
}
