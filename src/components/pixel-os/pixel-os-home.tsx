import { ArrowDown, ArrowRight } from 'lucide-react'
import { FadeIn } from '@/components/fade-in'
import { PixelOSFooter } from './pixel-os-footer'
import { PixelOSNav } from './pixel-os-nav'
import {
  ActionConsole,
  AdaptiveRuntime,
  CadenceTask,
  ContextFlywheel,
  EnterpriseContextGraph,
  FragmentedEnterprise,
  InfrastructureMap,
  ModelSwitcher,
  ProductArchitecture,
  RagComparison,
} from './pixel-os-diagrams'
import { ENTERPRISE_QUESTIONS } from './pixel-os-data'

function SectionIndex({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`font-mono text-[9px] uppercase tracking-[0.2em] ${dark ? 'text-white/28' : 'text-neutral-400'}`}>
      {children}
    </p>
  )
}

function Downlink({ dark = false }: { dark?: boolean }) {
  return (
    <div className="mx-auto flex h-20 w-px items-end justify-center" aria-hidden>
      <span className={`h-full w-px ${dark ? 'bg-white/12' : 'bg-black/10'}`} />
      <ArrowDown className={`-ml-px h-3 w-3 shrink-0 ${dark ? 'text-white/25' : 'text-neutral-300'}`} />
    </div>
  )
}

export function PixelOSHome({ locale }: { locale: string }) {
  return (
    <div className="pixel-os-scope min-h-screen bg-[#080808] text-white">
      <PixelOSNav />
      <main>
        <section className="relative overflow-hidden bg-[#080808] px-5 pb-16 pt-32 md:px-6 md:pb-24 md:pt-40">
          <div className="pixel-os-grid absolute inset-0 opacity-60" aria-hidden />
          <div className="relative mx-auto max-w-[1200px]">
            <FadeIn>
              <SectionIndex dark>Pixel / Enterprise infrastructure</SectionIndex>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h1 className="mt-8 max-w-5xl">
                <span className="block font-mono text-[clamp(1rem,2vw,1.35rem)] font-medium tracking-[0.28em] text-white/55">PIXEL</span>
                <span className="mt-7 block text-[clamp(3.2rem,8.7vw,7.6rem)] font-semibold leading-[0.91] tracking-[-0.065em]">
                  The AI Operating System
                  <br />
                  for the Enterprise.
                </span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.13}>
              <p className="mt-10 max-w-xl text-xl leading-snug tracking-[-0.02em] text-white/48 md:text-2xl">
                Any model.
                <br />
                One enterprise context.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href={`/${locale}/pixel`} className="inline-flex items-center gap-3 bg-white px-5 py-3 text-xs font-medium text-neutral-950 transition-colors hover:bg-emerald-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300">
                  Explore Adaptive <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <a href={`/${locale}/cadence`} className="inline-flex items-center gap-3 border border-white/18 px-5 py-3 text-xs font-medium text-white/72 transition-colors hover:border-white/45 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300">
                  Explore Cadence <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </FadeIn>
            <div className="mt-24 md:mt-32">
              <InfrastructureMap />
            </div>
            <p className="mt-6 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-300/48">
              The company is becoming computable.
            </p>
          </div>
        </section>

        <section className="bg-[#101010] px-5 pt-24 md:px-6 md:pt-36" id="context">
          <div className="mx-auto max-w-[1200px]">
            <SectionIndex dark>01 / Intelligence without context</SectionIndex>
            <FadeIn>
              <h2 className="mt-7 max-w-5xl text-[clamp(2.8rem,7vw,6.5rem)] font-semibold leading-[0.94] tracking-[-0.06em]">
                AI is getting smarter.
                <span className="mt-3 block text-white/30">But it still doesn’t understand the enterprise.</span>
              </h2>
            </FadeIn>
            <div className="mt-20">
              <FragmentedEnterprise />
            </div>
            <div className="grid gap-12 py-24 md:grid-cols-2 md:py-32">
              <p className="max-w-md text-xl leading-relaxed text-white/42">
                Models can see fragments. They do not share a living representation of the organization.
              </p>
              <ul className="border-t border-white/10">
                {ENTERPRISE_QUESTIONS.map((question, index) => (
                  <li key={question} className="flex items-center justify-between border-b border-white/10 py-3.5 text-sm text-white/58">
                    <span>{question}</span>
                    <span className="font-mono text-[8px] text-white/18">0{index + 1}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative flex min-h-[82svh] items-center overflow-hidden border-t border-white/12 py-28">
              <span className="pointer-events-none absolute -right-[0.08em] top-1/2 -translate-y-1/2 font-mono text-[clamp(9rem,28vw,27rem)] leading-none text-white/[0.018]" aria-hidden>C</span>
              <FadeIn>
                <div>
                  <p className="max-w-4xl text-[clamp(1.7rem,4vw,3.8rem)] font-medium uppercase leading-[0.98] tracking-[-0.045em] text-white/38">
                    The next bottleneck in enterprise AI isn’t intelligence.
                  </p>
                  <p className="mt-10 text-[clamp(4.6rem,14vw,13rem)] font-semibold uppercase leading-[0.76] tracking-[-0.075em] text-emerald-300">
                    It’s<br />context.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
          <Downlink dark />
        </section>

        <section className="relative min-h-[100svh] overflow-hidden bg-[#09100d] px-5 py-28 md:px-6 md:py-40" id="adaptive">
          <div className="pixel-os-grid absolute inset-0 opacity-35" aria-hidden />
          <div className="relative mx-auto max-w-[1200px]">
            <SectionIndex dark>02 / The Enterprise Intelligence Layer</SectionIndex>
            <div className="mt-7 grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
              <FadeIn>
                <h2 className="text-[clamp(3.2rem,7vw,6.8rem)] font-semibold leading-[0.9] tracking-[-0.065em]">Meet<br />Adaptive.</h2>
              </FadeIn>
              <p className="max-w-xl text-xl leading-relaxed text-white/46 md:text-2xl">
                The intelligence layer between your enterprise and every AI.
              </p>
            </div>
            <div className="mt-28 md:mt-36">
              <AdaptiveRuntime />
            </div>
          </div>
        </section>

        <section className="bg-[#f4f4f1] px-5 py-28 text-neutral-900 md:px-6 md:py-40" id="enterprise-state">
          <div className="mx-auto max-w-[1200px]">
            <SectionIndex>03 / Enterprise Context Engine</SectionIndex>
            <FadeIn>
              <h2 className="mt-7 max-w-5xl text-[clamp(2.8rem,6.4vw,6rem)] font-semibold leading-[0.94] tracking-[-0.06em]">
                Models know the world.
                <span className="mt-2 block text-neutral-400">Pixel learns how your company works.</span>
              </h2>
            </FadeIn>
            <div className="mt-24 md:mt-32">
              <EnterpriseContextGraph />
            </div>
            <div className="mt-12 grid gap-4 border-t border-black/10 pt-8 md:grid-cols-[1fr_2fr]">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-800">Enterprise State</p>
              <p className="max-w-2xl text-xl leading-relaxed text-neutral-500">
                A continuously evolving operational representation of your organization.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#e9e9e5] px-5 py-24 text-neutral-900 md:px-6 md:py-32">
          <div className="mx-auto max-w-[1200px]">
            <SectionIndex>04 / Retrieval and operational context</SectionIndex>
            <h2 className="mt-7 max-w-3xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Beyond retrieval.</h2>
            <p className="mt-4 max-w-xl text-neutral-500">RAG remains useful. Enterprise context answers a different, operational question.</p>
            <div className="mt-14"><RagComparison /></div>
          </div>
        </section>

        <section className="bg-[#080808] px-5 py-28 md:px-6 md:py-40" id="action">
          <div className="mx-auto max-w-[1200px]">
            <SectionIndex dark>05 / Governed execution</SectionIndex>
            <div className="mt-7 grid gap-8 lg:grid-cols-2 lg:items-end">
              <FadeIn><h2 className="text-[clamp(3rem,6.6vw,6.2rem)] font-semibold leading-[0.92] tracking-[-0.06em]">From context<br />to action.</h2></FadeIn>
              <p className="max-w-lg text-xl leading-relaxed text-white/45">AI can act. But the enterprise stays in control.</p>
            </div>
            <div className="mt-20 md:mt-28"><ActionConsole /></div>
            <div className="relative mt-28 flex min-h-[68svh] items-center overflow-hidden border-t border-emerald-300/20 md:mt-40">
              <span className="pointer-events-none absolute right-0 text-[clamp(15rem,38vw,36rem)] font-light leading-none text-emerald-300/[0.025]" aria-hidden>✓</span>
              <FadeIn>
                <p className="text-[clamp(3.15rem,10vw,10rem)] font-semibold uppercase leading-[0.78] tracking-[-0.075em] text-white">
                  Governed
                  <span className="mt-5 block text-emerald-300">autonomy.</span>
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        <section className="bg-[#f4f4f1] px-5 py-24 text-neutral-900 md:px-6 md:py-36" id="cadence">
          <div className="mx-auto max-w-[1200px]">
            <SectionIndex>06 / The human operating environment</SectionIndex>
            <div className="mt-7 grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <FadeIn><h2 className="text-[clamp(3.5rem,8vw,7.8rem)] font-semibold leading-none tracking-[-0.065em]">CADENCE</h2></FadeIn>
              <div>
                <p className="text-2xl font-medium tracking-[-0.03em] md:text-3xl">Where humans and AI agents work together.</p>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-500">Product management that understands your code — and brings AI agents into the work.</p>
              </div>
            </div>
            <div className="mt-20 md:mt-28"><CadenceTask /></div>
            <div className="mt-28 min-h-[68svh] border-t border-black/12 pt-20 md:mt-40 md:pt-28">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">One team.</p>
              <FadeIn>
                <p className="mt-12 text-[clamp(4.2rem,12vw,12rem)] font-semibold uppercase leading-[0.75] tracking-[-0.078em]">
                  Humans
                  <span className="my-4 block font-mono text-[clamp(1rem,2vw,1.5rem)] font-normal tracking-[0.2em] text-neutral-300">+</span>
                  <span className="block text-teal-700">Agents.</span>
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        <section className="bg-[#101010] px-5 py-24 md:px-6 md:py-36">
          <div className="mx-auto max-w-[1200px]">
            <SectionIndex dark>07 / Product architecture</SectionIndex>
            <div className="mt-7 grid gap-10 lg:grid-cols-2">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.045em] md:text-6xl">Infrastructure below.<br />Work above.</h2>
              <div className="max-w-lg text-base leading-relaxed text-white/45">
                <p>Adaptive is the infrastructure.</p>
                <p className="mt-3">Cadence is the first operating environment built on it.</p>
              </div>
            </div>
            <div className="mt-20 md:mt-28"><ProductArchitecture /></div>
          </div>
        </section>

        <section className="bg-[#f4f4f1] px-5 py-28 text-neutral-900 md:px-6 md:py-40">
          <div className="mx-auto max-w-[1200px]">
            <SectionIndex>08 / Model agnostic by design</SectionIndex>
            <FadeIn>
              <h2 className="mt-7 max-w-5xl text-[clamp(2.8rem,6.5vw,6.2rem)] font-semibold leading-[0.94] tracking-[-0.06em]">
                Models will change.
                <span className="block text-neutral-400">Your enterprise context shouldn’t.</span>
              </h2>
            </FadeIn>
            <div className="mt-24 md:mt-32"><ModelSwitcher /></div>
            <div className="mt-24 flex min-h-[55svh] items-center justify-end border-t border-black/10 md:mt-32">
              <FadeIn>
                <p className="text-right text-[clamp(3.5rem,9vw,8.5rem)] font-semibold uppercase leading-[0.8] tracking-[-0.07em]">
                  Any model.
                  <span className="mt-5 block text-emerald-800">One enterprise<br />context.</span>
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        <section className="bg-[#080808] px-5 py-24 md:px-6 md:py-36">
          <div className="mx-auto max-w-[1200px]">
            <SectionIndex dark>09 / The enterprise flywheel</SectionIndex>
            <div className="mt-7 grid gap-8 lg:grid-cols-2">
              <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.045em] md:text-6xl">Every interaction makes your enterprise context more valuable.</h2>
              <p className="max-w-md self-end text-lg leading-relaxed text-white/42">Actions produce outcomes. Outcomes become decisions and memory. Memory makes the next action better.</p>
            </div>
            <div className="mt-16"><ContextFlywheel /></div>
            <div className="mt-16 border-t border-white/10 pt-8 md:flex md:justify-between">
              <p className="text-white/35">Models learn about the world.</p>
              <p className="mt-2 text-emerald-200 md:mt-0">Pixel learns how your company works.</p>
            </div>
          </div>
        </section>

        <section className="relative min-h-[100svh] overflow-hidden bg-[#edede9] px-5 py-28 text-neutral-950 md:px-6 md:py-40" id="vision">
          <div className="pixel-os-grid-light absolute inset-0" aria-hidden />
          <div className="relative mx-auto flex min-h-[75svh] max-w-[1200px] flex-col justify-between">
            <div>
              <SectionIndex>10 / Vision</SectionIndex>
              <FadeIn>
                <h2 className="mt-10 max-w-6xl text-[clamp(3.4rem,9.5vw,9rem)] font-semibold uppercase leading-[0.85] tracking-[-0.07em]">
                  Every enterprise
                  <br />will have
                  <br /><span className="text-emerald-800">an AI workforce.</span>
                </h2>
              </FadeIn>
            </div>
            <div className="mt-24 grid gap-12 border-t border-black/12 pt-10 lg:grid-cols-2">
              <p className="max-w-xl text-lg leading-relaxed text-neutral-500">
                Those agents may come from OpenAI, Anthropic, Google, xAI, open-source models — and companies that don’t exist yet. They will all need to understand the same company.
              </p>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">PIXEL</p>
                <p className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.045em] md:text-5xl">The AI Operating System<br />for the Enterprise.</p>
                <p className="mt-5 text-neutral-500">Any model. One enterprise context.</p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a href="mailto:ze@pixelpulselab.dev?subject=Build%20with%20Pixel" className="inline-flex items-center gap-3 bg-neutral-950 px-5 py-3 text-xs font-medium text-white transition-colors hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800">
                    Build with Pixel <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <a href="https://wa.me/5511981058468" className="inline-flex items-center gap-3 border border-black/15 px-5 py-3 text-xs font-medium transition-colors hover:border-black/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800">
                    Talk to us <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PixelOSFooter />
    </div>
  )
}
