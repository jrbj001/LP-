'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { FadeIn } from '@/components/fade-in'
import {
  GUIDE_META,
  SECTIONS,
  SUMMARY_BANDS,
  MARKET_SOURCES,
  HOUR_DISCIPLINES,
  PROFILE_RATES,
  COMMERCIAL_MODELS,
  SUSTAINABLE_RATE,
  BLENDED_EXAMPLE,
  PIXEL_RATES,
  PIXEL_PACKAGES,
  BUDGET_EXAMPLES,
  PRICE_FACTORS,
  COMPARISON_CHECKLIST,
  WARNING_SIGNS,
  HIRING_STEPS,
  SOURCES,
  EXECUTIVE_BULLETS,
} from '@/components/guides/valor-hora-data'
import { Download, ExternalLink } from 'lucide-react'

function Table({
  headers,
  rows,
}: {
  headers: string[]
  rows: string[][]
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-black/[0.06]">
      <table className="w-full text-left min-w-[560px] text-[13px]">
        <thead>
          <tr className="border-b border-black/[0.06] bg-[#f5f5f4]">
            {headers.map(h => (
              <th key={h} className="px-4 py-3 font-medium text-neutral-600 text-[12px]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-black/[0.04] last:border-0 bg-white">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 text-neutral-700 ${j === 0 ? 'font-medium text-neutral-900' : ''}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Callout({ title, children, tone = 'neutral' }: { title: string; children: React.ReactNode; tone?: 'neutral' | 'dark' | 'amber' }) {
  const styles = {
    neutral: 'border-black/[0.08] bg-white',
    dark: 'border-neutral-800 bg-neutral-900 text-white',
    amber: 'border-amber-200 bg-amber-50',
  }
  const titleStyles = {
    neutral: 'text-neutral-900',
    dark: 'text-white',
    amber: 'text-amber-900',
  }
  const bodyStyles = {
    neutral: 'text-neutral-600',
    dark: 'text-white/70',
    amber: 'text-amber-800/80',
  }
  return (
    <div className={`rounded-xl border p-5 ${styles[tone]}`}>
      <p className={`text-[13px] font-semibold mb-2 ${titleStyles[tone]}`}>{title}</p>
      <div className={`text-[13px] leading-relaxed ${bodyStyles[tone]}`}>{children}</div>
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 mb-16">
      <h2 className="text-xl font-semibold tracking-[-0.02em] text-neutral-900 mb-5 pb-3 border-b border-black/[0.06]">
        {title}
      </h2>
      <div className="space-y-5 text-[15px] text-neutral-600 leading-relaxed">{children}</div>
    </section>
  )
}

export function ValorHoraGuide() {
  const locale = useLocale()
  const [active, setActive] = useState<string>(SECTIONS[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div className="lp-scope min-h-screen bg-[#fbfbfa] text-neutral-900">
      <Nav />

      {/* Hero */}
      <header className="pt-28 pb-16 px-6 border-b border-black/[0.06] bg-[#f5f5f4]">
        <div className="mx-auto max-w-[1120px]">
          <FadeIn>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">
              PixelPulseLab · Market Guide 2026
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-semibold tracking-[-0.04em] leading-[1.06] text-neutral-900 max-w-3xl">
              {GUIDE_META.subtitle}
            </h1>
            <p className="mt-5 text-[17px] text-neutral-500 max-w-2xl leading-relaxed">
              {GUIDE_META.description}
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-4">
              <div className="rounded-xl border border-black/[0.06] bg-white px-5 py-4">
                <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">Faixa de mercado</p>
                <p className="text-[22px] font-semibold text-neutral-900">
                  R$ {GUIDE_META.marketRange.min}–{GUIDE_META.marketRange.max}/h
                </p>
              </div>
              <div className="rounded-xl border border-black/[0.06] bg-white px-5 py-4">
                <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">Blended rate</p>
                <p className="text-[22px] font-semibold text-neutral-900">
                  R$ {GUIDE_META.marketRange.blended.min}–{GUIDE_META.marketRange.blended.max}/h
                </p>
              </div>
              <div className="rounded-xl border border-neutral-900 bg-neutral-900 text-white px-5 py-4">
                <p className="text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1">Taxa-base PixelPulseLab</p>
                <p className="text-[22px] font-semibold">R$ {GUIDE_META.baseRate}/h</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={GUIDE_META.pdfPath}
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-[13px] font-medium hover:bg-neutral-800 transition-colors"
              >
                <Download className="w-4 h-4" strokeWidth={1.75} />
                Baixar PDF
              </a>
              <Link
                href={`/${locale}#cta`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-black/[0.1] text-[13px] font-medium text-neutral-700 hover:bg-white transition-colors"
              >
                Falar com a PixelPulseLab
              </Link>
            </div>
            <p className="mt-4 text-[12px] text-neutral-400">Edição: {GUIDE_META.edition}</p>
          </FadeIn>
        </div>
      </header>

      {/* Content + TOC */}
      <div className="mx-auto max-w-[1120px] px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12">
          <aside className="hidden lg:block">
            <nav className="sticky top-24">
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-400 mb-4">Índice</p>
              <ul className="space-y-1">
                {SECTIONS.map(s => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`block text-[12px] py-1.5 leading-snug transition-colors ${
                        active === s.id ? 'text-neutral-900 font-medium' : 'text-neutral-400 hover:text-neutral-700'
                      }`}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className="min-w-0 max-w-[720px]">
            <Section id="resumo" title="1. Resumo executivo">
              <p>
                O preço de um projeto de software não representa apenas as horas de programação. Uma entrega
                profissional inclui entendimento do problema, desenho de produto, arquitetura, desenvolvimento, testes,
                segurança, infraestrutura, gestão, documentação, implantação e suporte.
              </p>
              <Callout title="Referência central" tone="dark">
                Para projetos sob medida no mercado brasileiro, recomendamos considerar{' '}
                <strong className="text-white">R$ {GUIDE_META.baseRate}/h</strong> como taxa média de planejamento
                de uma equipe multidisciplinar.
              </Callout>
              <ul className="space-y-2 list-disc pl-5">
                {EXECUTIVE_BULLETS.map(b => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <Table
                headers={['Modalidade', 'Faixa de mercado', 'Uso mais comum']}
                rows={SUMMARY_BANDS.map(b => [b.modality, b.range, b.use])}
              />
            </Section>

            <Section id="pesquisa" title="2. O que a pesquisa de mercado mostra">
              <p>
                As referências públicas apresentam faixas diferentes porque medem coisas distintas: preço de empresas,
                remuneração de profissionais, contratos em plataformas ou terceirização internacional.
              </p>
              <Table
                headers={['Fonte', 'Indicador publicado', 'Como interpretar']}
                rows={MARKET_SOURCES.map(s => [s.source, s.indicator, s.note])}
              />
              <Callout title="Atenção à comparação" tone="amber">
                US$ 40/h de um desenvolvedor remoto não equivale a US$ 40/h de uma consultoria responsável por produto,
                arquitetura, QA, DevOps e gestão. Verifique quais funções, responsabilidades e garantias estão incluídas.
              </Callout>
            </Section>

            <Section id="hora" title="3. O que existe dentro de uma hora de software">
              <p>
                Mesmo com valor-hora único, a execução distribui o investimento entre disciplinas. Um projeto saudável
                raramente é 100% programação.
              </p>
              <Table
                headers={['Disciplina', 'Participação típica', 'Entregas']}
                rows={HOUR_DISCIPLINES.map(d => [d.discipline, d.share, d.deliverables])}
              />
              <p className="text-[13px] text-neutral-400">
                Os percentuais variam por fase e podem se sobrepor — mostram que o valor financia uma cadeia de entrega.
              </p>
            </Section>

            <Section id="perfis" title="4. Faixas de valor por perfil e especialidade">
              <Table
                headers={['Perfil', 'Freelancer', 'Software house', 'Observação']}
                rows={PROFILE_RATES.map(p => [p.profile, p.freelancer, p.house, p.note])}
              />
              <p className="text-[13px] text-neutral-400">
                Faixas indicativas para contratação comercial no Brasil em 2026. Projetos regulados, urgentes ou de
                altíssimo risco podem excedê-las.
              </p>
            </Section>

            <Section id="modelos" title="5. Modelos comerciais">
              {COMMERCIAL_MODELS.map(m => (
                <div key={m.title} className="rounded-xl border border-black/[0.06] bg-white p-5">
                  <h3 className="text-[15px] font-semibold text-neutral-900 mb-2">{m.title}</h3>
                  <p className="mb-3">{m.body}</p>
                  <p><span className="font-medium text-neutral-800">Vantagens:</span> {m.pros}</p>
                  <p className="mt-1"><span className="font-medium text-neutral-800">Cuidados:</span> {m.cautions}</p>
                </div>
              ))}
            </Section>

            <Section id="taxa" title="6. Como calcular uma taxa sustentável">
              <Callout title="Fórmula de referência">
                <code className="font-mono text-[13px]">{SUSTAINABLE_RATE.formula}</code>
              </Callout>
              <p>
                O denominador correto são as horas faturáveis, não todas as horas do mês. Férias, treinamentos,
                reuniões internas e capacidade ociosa reduzem a capacidade faturável.
              </p>
              <Table
                headers={['Componente mensal', 'Valor ilustrativo']}
                rows={SUSTAINABLE_RATE.rows.map(r => [r.component, r.value])}
              />
            </Section>

            <Section id="blended" title="7. O que é blended rate">
              <p>
                Taxa média que combina profissionais com valores diferentes. Simplifica a contratação e permite
                organizar a equipe conforme a necessidade do projeto.
              </p>
              <Table
                headers={['Composição', 'Horas', 'Taxa interna', 'Subtotal']}
                rows={[
                  ...BLENDED_EXAMPLE.map(r => [r.role, String(r.hours), r.rate, r.subtotal]),
                  ['Total', '160', '—', 'R$ 44.000'],
                ]}
              />
              <Callout title="Resultado">
                Taxa média de <strong>R$ 275/h</strong> — equipe equilibrada com flexibilidade para alocar a competência
                adequada em cada etapa.
              </Callout>
            </Section>

            <Section id="pixel" title="8. Referência comercial PixelPulseLab">
              <p>
                A PixelPulseLab combina engenharia de software, produto, arquitetura e inteligência artificial.
              </p>
              <Callout title="Taxa-base recomendada" tone="dark">
                Para estimativas preliminares, adotamos <strong className="text-white">R$ {GUIDE_META.baseRate}/h</strong>.
                A proposta final considera complexidade, composição da equipe, prazo, volume, risco e responsabilidades.
              </Callout>
              <Table
                headers={['Categoria', 'Faixa sugerida', 'Aplicação']}
                rows={PIXEL_RATES.map(r => [r.category, r.range, r.use])}
              />
              <h3 className="text-[15px] font-semibold text-neutral-900 pt-2">Pacotes ilustrativos</h3>
              <Table
                headers={['Formato', 'Capacidade', 'Investimento indicativo']}
                rows={PIXEL_PACKAGES.map(p => [p.format, p.capacity, p.investment])}
              />
              <p className="text-[13px] text-neutral-400">
                Valores ilustrativos — não constituem proposta comercial. Escopo, alocação, impostos e condições
                contratuais devem ser definidos em cada contratação.
              </p>
            </Section>

            <Section id="orcamentos" title="9. Exemplos de orçamento">
              <Table
                headers={['Tipo de iniciativa', 'Esforço provável', 'Investimento indicativo']}
                rows={BUDGET_EXAMPLES.map(b => [b.initiative, b.effort, b.investment])}
              />
              <p className="text-[13px] text-neutral-400">
                Faixas deliberadamente amplas — integrações, dados, segurança, volume e legado alteram significativamente o custo.
              </p>
            </Section>

            <Section id="preco" title="10. O que aumenta ou reduz o preço">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
                  <p className="text-[13px] font-semibold text-emerald-900 mb-3">Tende a reduzir</p>
                  <ul className="space-y-1.5">
                    {PRICE_FACTORS.reduces.map(f => (
                      <li key={f} className="text-[13px] text-emerald-800/80 flex gap-2">
                        <span>+</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-5">
                  <p className="text-[13px] font-semibold text-rose-900 mb-3">Tende a aumentar</p>
                  <ul className="space-y-1.5">
                    {PRICE_FACTORS.increases.map(f => (
                      <li key={f} className="text-[13px] text-rose-800/80 flex gap-2">
                        <span>−</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>

            <Section id="comparar" title="11. Como comparar propostas">
              <p>Antes de escolher pelo menor valor, confirme se as propostas respondem às mesmas perguntas:</p>
              <ul className="space-y-2">
                {COMPARISON_CHECKLIST.map(q => (
                  <li key={q} className="flex gap-2">
                    <span className="text-neutral-300">·</span>{q}
                  </li>
                ))}
              </ul>
              <Callout title="Regra prática" tone="amber">
                Uma proposta barata que exclui QA, gestão, documentação, implantação e suporte pode terminar mais cara.
                Compare o custo total até a solução funcionar e permanecer sustentável.
              </Callout>
            </Section>

            <Section id="alerta" title="12. Sinais de alerta">
              <ul className="space-y-2">
                {WARNING_SIGNS.map(w => (
                  <li key={w} className="flex gap-2">
                    <span className="text-rose-400">⚠</span>{w}
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="ia" title="13. Como a IA está mudando o preço do desenvolvimento">
              <p>
                Ferramentas de IA aumentam produtividade em geração de código, testes, documentação e análise — mas
                não eliminam arquitetura, validação, segurança, entendimento de negócio e responsabilidade.
              </p>
              <Callout title="Nova unidade de valor">
                O mercado migra de &ldquo;quantas horas foram gastas?&rdquo; para &ldquo;qual resultado foi entregue com
                segurança?&rdquo;. Mesmo assim, horas continuam úteis para capacidade, governança e transparência.
              </Callout>
            </Section>

            <Section id="contratacao" title="14. Estrutura recomendada para uma contratação">
              <ol className="space-y-2 list-decimal pl-5">
                {HIRING_STEPS.map((step, i) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </Section>

            <Section id="conclusao" title="15. Conclusão">
              <p>
                Não existe um único valor correto para a hora de desenvolvimento. Existe uma faixa compatível com o
                problema, a equipe, a responsabilidade e o nível de risco. Em 2026,{' '}
                <strong className="text-neutral-900">R$ {GUIDE_META.baseRate}/h</strong> é referência consistente para
                planejar uma equipe multidisciplinar no Brasil.
              </p>
              <Callout title="Sobre a PixelPulseLab">
                AI Product & Infrastructure Company. Desenvolvemos software sob medida, plataformas digitais, agentes de
                IA e infraestrutura adaptativa, combinando produto, engenharia e estratégia.
              </Callout>
            </Section>

            <section className="mb-8 pt-8 border-t border-black/[0.06]">
              <h2 className="text-[15px] font-semibold text-neutral-900 mb-4">Fontes e referências</h2>
              <ul className="space-y-2">
                {SOURCES.map(s => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      {s.label}
                      <ExternalLink className="w-3 h-3" strokeWidth={2} />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[12px] text-neutral-400 leading-relaxed">
                Metodologia: síntese de referências públicas internacionais, perfis de empresas no Brasil e práticas de
                composição de preço em serviços profissionais. As faixas em reais são estimativas comerciais para
                orientação — não constituem tabela oficial, promessa de preço ou recomendação jurídica, fiscal ou contábil.
              </p>
            </section>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
