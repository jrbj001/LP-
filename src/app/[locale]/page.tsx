import type { Metadata } from 'next'
import Script from 'next/script'
import { PixelOSHome } from '@/components/pixel-os/pixel-os-home'

export const metadata: Metadata = {
  metadataBase: new URL('https://pixelpulselab.dev'),
  title: 'Pixel — The AI Operating System for the Enterprise',
  description:
    'Pixel gives AI models and agents the context, memory, permissions and tools they need to understand and operate your enterprise.',
  alternates: {
    canonical: '/',
    languages: {
      'pt-BR': '/pt',
      en: '/en',
      'zh-CN': '/zh',
    },
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'PixelPulseLab.dev',
    title: 'The AI Operating System for the Enterprise.',
    description: 'Any model. One enterprise context.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The AI Operating System for the Enterprise.',
    description: 'Any model. One enterprise context.',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://pixelpulselab.dev/#organization',
      name: 'PixelPulseLab',
      url: 'https://pixelpulselab.dev',
      email: 'ze@pixelpulselab.dev',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://pixelpulselab.dev/#pixel',
      name: 'Pixel',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'The AI Operating System for the Enterprise. Pixel gives AI models and agents shared enterprise context, memory, identity, permissions, policies and tools.',
      creator: { '@id': 'https://pixelpulselab.dev/#organization' },
    },
  ],
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <>
      <Script
        id="pixel-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PixelOSHome locale={locale} />
    </>
  )
}
