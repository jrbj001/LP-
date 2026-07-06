import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { Onboarding } from '@/components/client/onboarding'
import { DocsPortal } from '@/components/client/docs-portal'

export default function ClientPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 border-b border-white/[0.06]">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-text-muted">
                Portal do Cliente
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.04em] max-w-3xl leading-[1.05]">
              Bem-vindo à{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">
                sua área exclusiva
              </span>
            </h1>
            <p className="mt-6 text-lg text-white/50 max-w-xl leading-relaxed">
              Tudo em um só lugar — onboarding, documentação, status dos projetos
              e canais de suporte direto com nossa equipe.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 mt-12">
              {[
                { label: 'Uptime médio', value: '99.98%' },
                { label: 'Resposta de suporte', value: '< 4h' },
                { label: 'Deploy frequency', value: 'diário' },
              ].map(stat => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span className="text-2xl font-bold tracking-tight text-white">{stat.value}</span>
                  <span className="text-xs font-mono text-white/30 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Onboarding />
        <DocsPortal />
      </main>
      <Footer />
    </>
  )
}
