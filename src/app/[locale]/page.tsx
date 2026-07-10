import { NavLight } from '@/components/lp/nav'
import { HeroV2 } from '@/components/lp/hero'
import { ServicesV2 } from '@/components/lp/services'
import { CasesV2 } from '@/components/lp/cases'
import { FrameworkV2 } from '@/components/lp/framework'
import { TeamV2 } from '@/components/lp/team'
import { CtaV2 } from '@/components/lp/cta'
import { FooterLight } from '@/components/lp/footer'

export default function Page() {
  return (
    <div className="bg-white">
      <NavLight />
      <main>
        <HeroV2 />
        <ServicesV2 />
        <CasesV2 />
        <FrameworkV2 />
        <TeamV2 />
        <CtaV2 />
      </main>
      <FooterLight />
    </div>
  )
}
