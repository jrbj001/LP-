import type { JourneyStageId, PillarId, Template, TemplateFamily } from './types'

/**
 * Modelos da consultoria extraídos de docs/alquimia/2026-08-7_Alquemia_Templates-2026.
 * Material estratégico de uso interno. Origens de terceiros (AB InBev, Fieldwork,
 * OKRs/Scrum) permanecem atribuídas; exemplos de cliente foram generalizados.
 */
export const templateFamilies: Array<{ id: TemplateFamily; name: string; description: string }> = [
  { id: 'planning', name: 'Planejamento', description: 'Prioridades, calendário, marca e comercial.' },
  { id: 'facilitation', name: 'Facilitação', description: 'Rituais de sala, escuta e alinhamento.' },
  { id: 'analysis', name: 'Análise', description: 'Causa, fluxo, concentração e decomposição.' },
  { id: 'people', name: 'Gente', description: 'Ciclo anual, escuta e desenvolvimento.' },
  { id: 'fieldwork', name: 'Fieldwork', description: 'Propósito, princípios e incorporação cultural.' },
]

function tpl(
  number: number,
  id: string,
  title: string,
  family: TemplateFamily,
  source: string,
  status: Template['status'],
  summary: string,
  howTo: string,
  journeyStageIds: JourneyStageId[],
  pillarIds: PillarId[],
  extra: Pick<Template, 'fields' | 'sections'> = {}
): Template {
  return { number, id, title, family, source, status, summary, howTo, journeyStageIds, pillarIds, ...extra }
}

export const templates: Template[] = [
  tpl(1, 'gantt', 'Gantt — cronograma com interdependência', 'planning', 'Alquemia · Templates 2026', 'draft',
    'Um cronograma visual que torna explícita a sequência, a duração e a dependência entre marcos.',
    'Meses sem marco definido ficam em branco — preencha ao planejar. Marque o que bloqueia o que, não só o que acontece quando.',
    ['design', 'execution'], ['purpose-direction', 'management-system'],
    { fields: ['Iniciativa', 'Dono', 'Início', 'Fim', 'Predecessor', 'Status'] }),

  tpl(2, 'five-w-two-h', '5W2H — plano de ação', 'planning', 'Alquemia · Templates 2026', 'draft',
    'O quê, por quê, quem, onde, quando, como e quanto — para cada ação prioritária.',
    'Uma linha por ação. “O quê” precisa ser específico e mensurável; “Como” deve indicar o primeiro passo executável.',
    ['focus', 'design', 'execution'], ['purpose-direction', 'management-system'],
    { fields: ['Nº', 'O quê?', 'Por quê?', 'Quem?', 'Onde?', 'Quando?', 'Como?', 'Quanto custa?'] }),

  tpl(3, 'brand-positioning', 'Posicionamento de marca', 'planning', 'Alquemia · Templates 2026', 'draft',
    'Constrói o posicionamento a partir de valores: funcional, emocional, personalidade e razões para acreditar, ancorados no propósito central.',
    'Preencha cada campo em linguagem do consumidor. O propósito no centro precisa ser maior do que a marca — o que ela resolve na vida de quem escolhe.',
    ['diagnostic', 'focus'], ['purpose-direction', 'innovation-growth'],
    { fields: ['Ideal da marca', 'Segmento', 'Valores do consumidor', 'Benefício funcional', 'Benefício emocional', 'Personalidade', 'Razões para acreditar'] }),

  tpl(4, 'integrated-commercial-plan', 'Plano comercial integrado', 'planning', 'Alquemia · Templates 2026', 'draft',
    'Conecta metas de receita, marca, distribuição e comportamento às iniciativas por canal — DTC, B2B, varejo, marketing e experiential.',
    'Comece pelas metas (número + variação). Depois preencha iniciativas só onde houver dono. Metas sem iniciativa ficam visíveis como gap.',
    ['focus', 'design'], ['purpose-direction', 'innovation-growth', 'management-system'],
    { sections: [
      { title: 'Camadas de meta', items: ['Faturamento total e por canal', 'Margem de contribuição', 'Inovação e novos fluxos', 'NPS / preferência / conhecimento', 'Distribuição ponderada, ruptura e share de espaço'] },
      { title: 'Frentes típicas', items: ['DTC e recorrência', 'B2B e contas novas', 'Varejo e trade', 'Marketing e mídia', 'Experiential e eventos'] },
    ] }),

  tpl(5, 'plan-priorities', 'Plano — prioridades', 'planning', 'Alquemia · Templates 2026', 'draft',
    'Uma página que amarra de onde viemos, para onde vamos e o desafio desta fase — com o playbook como ativo central.',
    'Escreva a história recente em uma frase verificável. A visão precisa caber em uma sentença. O desafio da fase é a pergunta que o time ainda não sabe responder.',
    ['focus'], ['purpose-direction'],
    { fields: ['De onde viemos', 'Para onde vamos', 'O que esta fase pede', 'Pergunta crítica', 'Ativo central a explicitar'] }),

  tpl(6, 'plan-calendar', 'Plano — calendário', 'planning', 'Alquemia · Templates 2026', 'draft',
    'Calendário semestral de marcos. Células em cinza-claro ainda não têm data confirmada.',
    'Preencha só o que está decidido. O vazio é informação: mostra onde o plano ainda é intenção.',
    ['design', 'execution'], ['management-system'],
    { fields: ['Mês', 'Marco', 'Dono', 'Status'] }),

  tpl(7, 'plan-360', 'Plano 360', 'planning', 'Alquemia · Templates 2026', 'draft',
    'Desdobra um conceito de marca em campanha, conteúdo, PDV, eventos, relacionamento, loyalty e D2C.',
    'Um conceito no centro. Cada frente lista só o que torna o conceito tangível naquele canal — não um inventário de atividades.',
    ['design', 'execution'], ['innovation-growth', 'management-system'],
    { sections: [
      { title: 'Frentes', items: ['Campanha', 'Conteúdo / conversas', 'Trade e PDV', 'Eventos e experiências', 'Relacionamento', 'Loyalty / D2C'] },
    ] }),

  tpl(8, 'plan-expansion', 'Plano — expansão', 'planning', 'Alquemia · Templates 2026', 'draft',
    'Matriz canal × oferta × ativação para decidir onde crescer sem diluir o que torna o negócio único.',
    'Nas linhas, canais. Nas colunas, produtos, formatos e alavancas de ativação. Marque só o cruzamento que entra neste ciclo.',
    ['focus', 'design'], ['innovation-growth', 'purpose-direction'],
    { fields: ['Canal', 'Oferta', 'Ativação', 'Prioridade', 'Restrição'] }),

  tpl(9, 'knowledge-island', 'Ilha do conhecimento', 'facilitation', 'Alquemia · Templates 2026', 'draft',
    'Talking circle em três perguntas: o que você aprendeu sobre a empresa, o projeto e você.',
    'Cada pessoa fala nas três ilhas antes de debate. O valor está no que se torna comum — não no relatório.',
    ['diagnostic', 'sustain'], ['people-culture'],
    { fields: ['Empresa', 'Projeto', 'Você'] }),

  tpl(10, 'bdd', 'BDD — Bom, Difícil e Diferente', 'facilitation', 'Alquemia · Templates 2026', 'draft',
    'Três lentes sobre uma iniciativa: o que é bom, o que é difícil e o que se faria diferente.',
    'Comece pelo Bom para não colapsar em crítica. O Diferente precisa ser uma ação, não um desejo.',
    ['diagnostic', 'execution'], ['continuous-improvement', 'people-culture'],
    { fields: ['Bom', 'Difícil', 'Diferente'] }),

  tpl(11, 'change-journey', 'Jornada da mudança', 'facilitation', 'Alquemia · Templates 2026', 'draft',
    'Onde o funil clássico de consultoria encontra a energia real da mudança em campo — duas lentes, um mesmo processo.',
    'Use as duas colunas juntas. O funil descreve o trabalho; a montanha-russa descreve a energia do sistema. Atrito não é falha — é dado.',
    ['diagnostic', 'design', 'execution'], ['people-culture', 'management-system'],
    { sections: [
      { title: 'Funil clássico', items: ['Diagnostic', 'Discovery', 'Hypothesis', 'Roadmap', 'Implementation', 'Follow-through'] },
      { title: 'Energia em campo', items: ['Immersion', 'Spark', 'Friction', 'Prototype', 'Test & Learn', 'Traction', 'Integration', 'Momentum'] },
    ] }),

  tpl(12, 'change-state', 'Estado da mudança', 'facilitation', 'Alquemia · Templates 2026', 'draft',
    'Oito direções, cada uma com uma energia disponível e sua distorção-sombra. O mesmo mapa serve para pessoa, time, iniciativa ou cultura.',
    'Marque a energia dominante e a sombra que já aparece. O trabalho é recuperar a energia sem cair na distorção — não “escolher um quadrante certo”.',
    ['diagnostic', 'focus'], ['people-culture', 'purpose-direction'],
    { sections: [
      { title: 'Cardinais', items: ['Descoberta — curiosidade viva / sombra: ocupação compulsiva', 'Ação — execução decisiva / sombra: controle rígido', 'Integração — síntese que aprende / sombra: plano fixo, surdo ao campo', 'Intenção — clareza de propósito / sombra: fechamento prematuro'] },
      { title: 'Diagonais', items: ['Exploração — abertura ao inesperado / sombra: fuga disfarçada de busca', 'Compromisso — decisão compartilhada / sombra: pensamento de manada', 'Pertencimento — colaboração real / sombra: responsabilidade diluída', 'Time — confiança coletiva / sombra: dispersão sem foco'] },
    ] }),

  tpl(13, 'meeting-rules', 'Regras de reunião / trabalho', 'facilitation', 'Alquemia · Templates 2026', 'draft',
    'Combinados mínimos para proteger a dinâmica da sala.',
    'Leia em voz alta no início. A agenda apertada é proposital. Sair da sala quebra o processo.',
    ['diagnostic', 'design'], ['people-culture', 'management-system'],
    { fields: ['Presentes e engajados', 'Celulares desligados', 'Intervalos combinados', 'Não sair da sala no meio'] }),

  tpl(14, 'ico3', 'ICO3 — intenção, contexto e objetivos', 'facilitation', 'Alquemia · Templates 2026', 'draft',
    'Abre um workshop com intenção, contexto, objetivos concretos, outputs visíveis e outcomes invisíveis.',
    'Outputs são entregas que se pode apontar. Outcomes são o que muda nas pessoas. Os dois precisam estar explícitos antes de começar.',
    ['design', 'execution'], ['purpose-direction', 'management-system'],
    { fields: ['Intenção', 'Contexto', 'Objetivos concretos', 'Outputs', 'Outcomes'] }),

  tpl(15, 'pdca-sdca', 'PDCA e SDCA', 'analysis', 'AB InBev · Continuous Improvement (adaptado)', 'ready',
    'Um motor melhora o nível de performance. O outro garante que o novo nível não se perde. 80% dos problemas do dia a dia vivem em SDCA; 20% pedem PDCA.',
    'Quando o PDCA termina, a melhoria vira o novo padrão — e passa a ser sustentada pelo SDCA. Sem essa ponte, o ganho se perde com o tempo.',
    ['execution', 'sustain'], ['continuous-improvement', 'management-system'],
    { sections: [
      { title: 'PDCA — Manage to Improve', body: 'Usado quando o problema é um gap real. Exige análise (White/Green/Black Belt) e fecha a distância entre o nível atual e um novo nível de performance.' },
      { title: 'SDCA — Manage to Sustain', body: 'Usado na rotina, quando o padrão não foi seguido. Checa SOPs e GOPs. Garante que o nível já alcançado não regride.' },
      { title: 'Problema bom vs. problema ruim', items: ['Problema bom: há um gap real — precisa de análise (PDCA).', 'Problema ruim: o padrão existe e não está sendo seguido (SDCA).', 'C com consequência: checar não basta — checar tem que ter consequência real.'] },
      { title: 'Onde entram no ano', items: ['Plano estratégico desdobra ambição.', 'Rotina (SDCA/MCRS) acompanha a maioria dos casos.', 'Gap abre PDCA.', 'Revisão de performance retroalimenta o próximo ciclo.'] },
      { title: 'O que compõe um bom PDCA', items: ['Plan ≈ Define + Measure + Analyze — o trabalho mais pesado do ciclo.', 'Do ≈ Improve — piloto, não aposta.', 'Check — verifica com dados, não com impressão.', 'Act ≈ Control / Sustain — padroniza e entrega ao SDCA.'] },
      { title: 'Erros-padrão por fase', items: ['Plan: meta vaga, pular mapeamento, causa-raiz sem dado, clientes do processo não identificados.', 'Do: implementar em escala sem piloto, testar sem métrica, pular análise de risco.', 'Check: “parece que funcionou”, não comparar com a linha de base, medição nunca validada.', 'Act: não virar SOP/GOP, nenhuma consequência se o padrão falhar, não documentar o aprendido.'] },
    ] }),

  tpl(16, 'okrs-sprints-squads', 'OKRs, sprints e squads', 'analysis', 'Andy Grove · John Doerr · Scrum · modelo Spotify (adaptado)', 'ready',
    'Alinha o “para onde vamos” com o “como saberemos que chegamos”, e transforma isso em ritmo de execução por times donos de uma missão.',
    'Nenhuma dessas ferramentas substitui as outras. A pergunta certa é onde a incerteza mora.',
    ['focus', 'design', 'execution'], ['purpose-direction', 'management-system', 'innovation-growth'],
    { sections: [
      { title: 'Objective', items: ['Qualitativo, inspirador, memorável.', 'Poucos por vez — 1 a 3 por time.', 'Ambicioso o suficiente para exigir esforço real.'] },
      { title: 'Key Results', items: ['Quantitativos e verificáveis — um número, não uma tarefa.', '2 a 5 por objective.', 'Resultado, não atividade.', 'Metade deve ser difícil de bater.'] },
      { title: 'Sprint', items: ['1–4 semanas, duração fixa.', 'Planning: puxa trabalho de um Key Result específico.', 'Daily: 15 min entre pares, não status para o chefe.', 'Review: o que foi entregue funcionando.', 'Retro: o que muda no próximo ciclo.'] },
      { title: 'Squad', items: ['6–10 pessoas.', 'Missão clara ligada a um Objective.', 'Autonomia no como, alinhamento no porquê.', 'Composição completa o suficiente para não depender de aprovação externa no dia a dia.'] },
      { title: 'Três contextos', items: ['Processo estável que só precisa melhorar → PDCA.', 'Número previsível que não pode mudar no meio do ano → plano anual.', 'Caminho ainda em descoberta → OKRs.'] },
    ] }),

  tpl(17, 'life-story', 'História de vida', 'facilitation', 'Alquemia · Templates 2026', 'draft',
    'Trajetória do nascimento até hoje, entre os momentos mais desafiadores e os mais gratificantes. Serve para pessoa, time ou organização.',
    'O gráfico é para ser preenchido livremente. Pontos de período são só referência — o valor está na forma da curva, não na escala.',
    ['diagnostic'], ['people-culture', 'purpose-direction'],
    { fields: ['Origem / nascimento', 'Formação e desafios', 'Consolidação', 'Presente e direção'] }),

  tpl(18, 'fishtank', 'Fishtank (Mekko)', 'analysis', 'Alquemia · Templates 2026', 'draft',
    'Duas dimensões ao mesmo tempo: a largura mostra o peso de cada grupo, a altura mostra sua composição interna.',
    'A largura de cada grupo some 100% na base. Dentro de cada grupo, empilhe os itens até 100% de altura.',
    ['diagnostic', 'focus'], ['purpose-direction', 'innovation-growth']),

  tpl(19, 'fishbone', 'Espinha de peixe (Ishikawa)', 'analysis', 'Alquemia · Templates 2026', 'draft',
    'Decompõe um efeito em categorias de causa, e cada categoria em causas específicas a investigar.',
    'Substitua as categorias pelas dimensões relevantes (ex.: 6M — método, mão de obra, máquina, material, meio ambiente, medição).',
    ['diagnostic', 'execution'], ['continuous-improvement'],
    { fields: ['Efeito', 'Pessoas', 'Processo', 'Tecnologia', 'Mercado'] }),

  tpl(20, 'waterfall', 'Cascata (waterfall)', 'analysis', 'Alquemia · Templates 2026', 'draft',
    'Decompõe a variação entre dois totais nos componentes que a explicam — o que somou e o que subtraiu.',
    'Substitua rótulos e valores pelos componentes reais: receita, custos, margem, headcount, o que for.',
    ['diagnostic', 'focus'], ['management-system'],
    { fields: ['Base inicial', 'Componentes (+/−)', 'Resultado final'] }),

  tpl(21, 'pareto', 'Pareto', 'analysis', 'Alquemia · Templates 2026', 'draft',
    'Mostra onde a concentração mora: quantas praças, SKUs ou contas explicam 50%, 70%, 80% e 90% da malha.',
    'Declare a base. Marque os cortes. O restante é cauda — tratar como cauda, não como prioridade disfarçada.',
    ['focus'], ['purpose-direction', 'continuous-improvement']),

  tpl(22, 'flowchart', 'Fluxograma', 'analysis', 'Alquemia · Templates 2026', 'draft',
    'Início/fim (oval), processo (retângulo), decisão (losango) — os elementos clássicos para tornar um fluxo discutível.',
    'Troque as caixas pelas etapas reais. Mantenha o padrão de formas para a leitura permanecer compartilhada.',
    ['design', 'execution'], ['management-system', 'continuous-improvement']),

  tpl(23, 'org-chart', 'Organograma', 'analysis', 'Alquemia · Templates 2026', 'draft',
    'Estrutura de governança do engagement: patrocínio, comitê, líder e frentes, com reporte direto e funcional visíveis.',
    'Linha sólida = reporte direto. Linha tracejada = reporte funcional ou consultivo. Nomeie a cadência do comitê.',
    ['design'], ['management-system', 'people-culture'],
    { fields: ['Patrocinador', 'Comitê diretivo', 'Líder do projeto', 'Frentes', 'Reporte direto', 'Reporte funcional'] }),

  tpl(24, 'bubble-chart', 'Bubble / dispersion chart', 'analysis', 'Alquemia · Templates 2026', 'draft',
    'Cruza duas métricas (ex.: score × crescimento) com o tamanho do ponto como terceira dimensão (peso, share, potencial).',
    'A leitura útil é o quadrante: alto peso e baixo crescimento pede disciplina; alto crescimento em base pequena pede escolha, não euforia.',
    ['diagnostic', 'focus'], ['innovation-growth', 'purpose-direction']),

  tpl(25, 'people-cycle', 'Ciclo de gente', 'people', 'Alquemia · orientação aos times', 'ready',
    'O que cada pessoa pode esperar da organização ao longo do ano — do primeiro dia ao reconhecimento contínuo.',
    'As mesmas atividades, todo ano, no mesmo ritmo — é isso que transforma processo em cultura. Pesquisa sem plano de ação vira ruído.',
    ['sustain', 'execution'], ['people-culture', 'management-system'],
    { sections: [
      { title: 'O ciclo', items: ['Recrutamento e onboarding — os primeiros 90 dias definem muito do resto.', 'Desenvolvimento e carreira — PDI escrito pela pessoa com o gestor.', 'Aprendizagem — trilhas de liderança, método e ofício, no ritmo de cada um.', 'Engajamento e comunicação — ouvir, agir, informar.', 'Reconhecimento e recompensas — visível e frequente, não um evento isolado.', 'Segurança e bem-estar — parte do ciclo, não apêndice.'] },
      { title: 'Calendário', items: ['T1: metas, plano de treino, início do ciclo.', 'T2: pesquisa de engajamento e plano de ação com cada gestor.', 'T3: escuta, ajuste, trilhas em andamento, revisão de potencial.', 'T4: revisão formal, reconhecimento do ano, planejamento do próximo.', 'O ano todo: onboarding a cada contratação, comunicação mensal, reconhecimento contínuo.'] },
      { title: 'Duas avaliações que não podem faltar', items: ['Engajamento — como as pessoas estão. Pulso frequente, cada pesquisa vira plano com dono e prazo.', 'Competências — para onde podem ir. Performance e potencial ao menos uma vez ao ano, com sucessão das posições críticas.'] },
    ] }),

  tpl(26, 'shifting-business', 'Shifting Business', 'fieldwork', 'Alchemia · Fieldwork (atribuído)', 'ready',
    'Purpose Quest organizacional: descobrir por que a organização existe e construir uma cultura que vive esse propósito no dia a dia — não em uma parede.',
    'Um pequeno grupo representativo faz a jornada em nome de todos e traz a organização inteira para dentro dela. É escuta, não sessão de estratégia.',
    ['diagnostic', 'focus', 'sustain'], ['purpose-direction', 'people-culture'],
    { sections: [
      { title: 'Estágio 1 — Remembering', body: 'Workshop de 2h com o máximo de pessoas possível. Mapa de 7 gerações: história, o que está vivo, o que ficou para trás, o que ainda pesa. Matéria-prima bruta — não um plano.' },
      { title: 'Estágio 2 — Questing', body: 'Retiro de 3 dias na natureza com 4 a 8 líderes. Quatro formas de conhecer — intelecto, emoção, corpo e intuição — para uma única declaração de propósito, evocativa e verdadeira. A liderança entrega o propósito em pessoa, não por e-mail.' },
      { title: 'Estágio 3 — Incorporation', body: 'Doze meses. Projetos de ruptura, resistência cultural nomeada e enfrentada, propósito embutido em contratação, feedback, promoção e decisão cotidiana. Checkpoints mensais e revisões trimestrais.' },
      { title: 'Backbone — cinco perguntas', items: ['Story — de onde viemos?', 'Brand — onde estamos agora?', 'Purpose — por que estamos aqui?', 'Vision — para onde vamos?', 'Strategy — como vamos chegar lá?'] },
      { title: 'Para quem é', body: 'Times de liderança em transição estratégica ou cultural; fundadores, boards e CEOs cuja organização cresceu além da própria história; fusão, reestruturação ou novo mercado; culturas que resistem à mudança necessária.' },
    ] }),

  tpl(27, 'ten-principles', 'Dez princípios → comportamento', 'fieldwork', 'Cultura de alta performance (referência AB InBev, adaptada)', 'ready',
    'O propósito só ganha vida quando vira princípios claros o suficiente para orientar decisões todos os dias — e princípios só orientam quando viram comportamentos observáveis.',
    'Traduza cada princípio em evidência visível. Avaliação 360 usa matriz auto × pares. Promoção e sucessão passam a referenciar o comportamento vivido, não só o número.',
    ['sustain', 'design'], ['people-culture', 'purpose-direction', 'management-system'],
    { sections: [
      { title: 'Os dez princípios (exemplo de referência)', items: [
        'Nosso sonho compartilhado energiza todos a trabalhar na mesma direção.',
        'Nossa maior força são as pessoas. Elas crescem no ritmo do seu talento e são recompensadas de acordo.',
        'Recrutamos, desenvolvemos e retemos pessoas que podem ser melhores do que nós.',
        'Nunca estamos completamente satisfeitos com os resultados — eles são o combustível da empresa.',
        'O consumidor é o chefe. Servimos com experiências de marca relevantes e responsáveis.',
        'Somos uma empresa de donos. Donos assumem os resultados pessoalmente.',
        'Gerenciamos custos com rigor, para liberar recursos para o crescimento sustentável.',
        'Nunca tomamos atalhos. Integridade, trabalho duro, qualidade e responsabilidade constroem a empresa.',
        'Liderança pelo exemplo pessoal está no centro da nossa cultura.',
        'Bom senso e simplicidade são melhores guias do que sofisticação desnecessária.',
      ] },
      { title: 'De princípios a comportamento', items: ['Seis clusters: sonhar grande, buscar a excelência, executar com excelência, desenvolver pessoas, viver a cultura, demonstrar resiliência.', '360°: gestor direto, pares, liderados, autoavaliação.', 'Matriz auto × pares: força reconhecida, ponto cego, força não reconhecida, só eu vejo.', 'Não-negociáveis: integridade cotidiana, segurança, compromissos públicos.'] },
      { title: 'Jornada de incorporação — ano um', items: ['T1 Fundação — traduzir princípios em comportamentos e atualizar contratação.', 'T2 Ritual — 1:1s, onboarding e reuniões passam a citar comportamentos, não impressões.', 'T3 Avaliação — primeiro ciclo 360° e conversas de desenvolvimento.', 'T4 Consequência — promoção e sucessão referenciam o comportamento vivido.'] },
    ] }),
]

export interface TemplateFilters {
  family?: TemplateFamily
  search?: string
}

export function getTemplate(id: string): Template | undefined {
  return templates.find(item => item.id === id)
}

export function listTemplates(filters: TemplateFilters = {}): Template[] {
  const search = filters.search?.trim().toLocaleLowerCase('pt-BR')
  return templates.filter(item =>
    (!filters.family || item.family === filters.family) &&
    (!search || `${item.title} ${item.summary} ${item.howTo} ${item.source}`.toLocaleLowerCase('pt-BR').includes(search))
  )
}

export function templateStats(items: Template[] = templates) {
  const byFamily = Object.fromEntries(templateFamilies.map(item => [item.id, 0])) as Record<TemplateFamily, number>
  for (const item of items) byFamily[item.family] += 1
  return { total: items.length, byFamily }
}

export function validateTemplates(): void {
  const ids = new Set<string>()
  const numbers = new Set<number>()
  const families = new Set(templateFamilies.map(item => item.id))
  for (const item of templates) {
    if (ids.has(item.id)) throw new Error(`Alquemia: template duplicado: ${item.id}`)
    if (numbers.has(item.number)) throw new Error(`Alquemia: número de template duplicado: ${item.number}`)
    if (!families.has(item.family)) throw new Error(`Alquemia: família inválida em ${item.id}`)
    if (!item.journeyStageIds.length || !item.pillarIds.length) throw new Error(`Alquemia: template sem referências: ${item.id}`)
    ids.add(item.id)
    numbers.add(item.number)
  }
}

validateTemplates()
