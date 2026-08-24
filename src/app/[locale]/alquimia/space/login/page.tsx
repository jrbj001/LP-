import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AlquimiaLoginForm } from '@/components/alquimia/space/login-form'
import { getAlquimiaSession } from '@/lib/alquimia/auth'

export const metadata: Metadata = {
  title: 'Acesso ao space · Alquemia',
  description: 'Ambiente privado de transformação organizacional da Alquemia.',
}

export const dynamic = 'force-dynamic'

export default async function AlquimiaLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await getAlquimiaSession()
  if (session) redirect(`/${locale}/alquimia/space`)

  return (
    <main className="alquimia-scope min-h-screen bg-[#F7F5ED] text-black">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden border-r border-black/10 bg-[#00435D] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-32 -top-28 h-96 w-96 rounded-full bg-[#E0CE7A]/30 blur-3xl" />
          <div className="absolute -bottom-24 left-12 h-80 w-80 rounded-full bg-[#AEADCC]/25 blur-3xl" />
          <a href={`/${locale}/alquimia`} className="relative text-[18px] tracking-[0.2em]">
            ALQUEMIA
          </a>
          <div className="relative max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E0CE7A]">
              Space de transformação
            </p>
            <h1 className="mt-5 text-[clamp(2.8rem,5vw,5.5rem)] font-light leading-[0.98] tracking-[-0.045em]">
              Potencial vira capacidade quando o método encontra a prática.
            </h1>
            <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-white/60">
              Um ambiente compartilhado para transformar diagnóstico em foco, foco em execução e
              execução em capacidades que permanecem.
            </p>
          </div>
          <p className="relative text-[11px] text-white/35">Alquemia × PixelPulseLab</p>
        </section>

        <section className="flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <a
              href={`/${locale}/alquimia`}
              className="text-[15px] tracking-[0.18em] text-[#00435D] lg:hidden"
            >
              ALQUEMIA
            </a>
            <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3A5976] lg:mt-0">
              Ambiente privado
            </p>
            <h2 className="mt-3 text-[32px] font-semibold tracking-[-0.035em] text-[#00435D]">
              Acesse o seu space
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-black/50">
              Entre como time Alquemia para conduzir engagements ou como cliente para acompanhar a
              sua jornada.
            </p>
            <AlquimiaLoginForm locale={locale} />
            <p className="mt-6 text-center text-[11px] leading-relaxed text-black/35">
              O acesso é individual e limitado aos engagements autorizados.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
