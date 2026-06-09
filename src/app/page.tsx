import { Nav } from '@/components/nav'
import { Hero } from '@/components/hero'
import { WhatWeBuild } from '@/components/what-we-build'
import { Thesis } from '@/components/thesis'
import { HowItWorks } from '@/components/how-it-works'
import { Enterprise } from '@/components/enterprise'
import { Platforms } from '@/components/platforms'
import { Ventures } from '@/components/ventures'
import { AdaptiveCore } from '@/components/adaptive-core'
import { WhyPixelPulse } from '@/components/why-pixelpulse'
import { Principles } from '@/components/principles'
import { FinalCTA } from '@/components/final-cta'
import { Footer } from '@/components/footer'

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WhatWeBuild />
        <Thesis />
        <HowItWorks />
        <Enterprise />
        <Platforms />
        <Ventures />
        <AdaptiveCore />
        <WhyPixelPulse />
        <Principles />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
