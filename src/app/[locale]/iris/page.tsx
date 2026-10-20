import type { Metadata } from 'next'
import { BookingFlow } from '@/components/iris/booking-flow'
import { COPY, irisLocale } from '@/lib/iris/data'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const copy = COPY[irisLocale((await params).locale)]
  return {
    title: `Iris 2027 · ${copy.tagline}`,
    description: copy.concept,
  }
}

export default async function IrisPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <BookingFlow locale={irisLocale(locale)} />
}
