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
import { TechStack } from '@/components/tech-stack'
import { FinalCTA } from '@/components/final-cta'
import { Footer } from '@/components/footer'

export default function Page() {
  return (
    <div className="lp-scope min-h-screen bg-[#fbfbfa] text-neutral-900">
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
        <TechStack />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
