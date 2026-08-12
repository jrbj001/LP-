import type { AssessmentHome } from '@/lib/assessment/types'

export const home: AssessmentHome = {
  problem:
    'A Banana Brasil já venceu a gôndola. O próximo salto não é de marca nem de produto — é de motor de demanda digital e de uma camada que faça os sistemas conversarem.',
  narrative: [
    'Em mais de 40 anos, a marca construiu três ativos caros e difíceis de replicar: autoridade em saudabilidade, distribuição nacional e um portfólio largo de produtos de impulso. O que ainda não existe é o motor que converte esses ativos em demanda digital — criadores em escala, comércio social e uma camada de inteligência que mede tudo.',
    'Na operação, o padrão do briefing se repete: Consistem, VTEX, Mtrix e Power BI resolvem pedaços do fluxo, mas os indicadores só se juntam no fechamento mensal. O diagnóstico é direto — a lacuna é de motor e de instrumentação, a mais barata de fechar e a de maior retorno, porque os ativos caros já estão pagos.',
    'Este assessment traduz esse cenário em uma sequência acionável: quick wins que limpam a operação, a Adaptive Layer™ que unifica a verdade e agentes de IA que passam a trabalhar sobre um fluxo rastreável.',
  ],
  stats: [
    { value: '12', label: 'Sistemas mapeados', hint: 'do ERP ao WhatsApp Business' },
    { value: '7', label: 'Agentes propostos', hint: 'copilotos por área' },
    { value: '9', label: 'Quick wins', hint: 'na ordem QW → Layer → IA' },
    { value: '6', label: 'Dimensões avaliadas', hint: 'marca a inteligência' },
  ],
  journey: [
    { id: 'diagnostico', title: 'Diagnóstico', description: 'Mercado, operação digital e a lacuna de motor e instrumentação.', status: 'active' },
    { id: 'layer', title: 'Adaptive Layer™', description: 'O stack atual mapeado numa verdade operacional única.', status: 'upcoming' },
    { id: 'agentes', title: 'Squad de agentes', description: 'Copilotos por área sobre a mesma camada.', status: 'upcoming' },
    { id: 'roadmap', title: 'Roadmap', description: 'Quick wins sequenciados por impacto, risco e esforço.', status: 'upcoming' },
  ],
  deliverables: [
    { metric: 'Diagnóstico Digital', label: 'Mercado + operação', description: 'Onde estão os ativos maduros, as lacunas e a oportunidade mensurável.' },
    { metric: 'Adaptive Layer™ Map', label: 'Stack → camada', description: 'Como cada sistema atual entra na verdade operacional única.' },
    { metric: 'Adaptive Roadmap™', label: 'QW → Layer → IA', description: 'Um plano priorizado que instala a camada e deixa cada quick win ampliá-la.' },
  ],
}
