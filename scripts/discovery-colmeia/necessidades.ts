/**
 * Necessidades da reunião "Discovery Simulador & Feedback [Colmeia]" de 12/11/2026, com o que o código, as APIs e o
 * banco do Colmeia já têm para cada uma. O texto de `reuniao` vem das notas da reunião; `base` vem do repositório
 * PixelPulseLab/colmeia---meusroteirosdefault e do SQL Server (schemas lab_product_be180 e serv_product_be180).
 */

export interface Necessidade {
  slug: string
  titulo: string
  reuniao: string
  base: string
}

export interface Epico extends Necessidade {
  filhas: Necessidade[]
}

export const REUNIAO = {
  titulo: 'Discovery Simulador & Feedback [Colmeia] · 12/11/2026',
  url: 'https://app.notion.com/p/4165615ab2748176ad03ff60322d3df8',
}

export const OBJETIVO = `Objetivo da reunião: transformar o Colmeia de simulador de cobertura e frequência em planejador completo, a ponto de
um briefing gerar o plano a partir do histórico. O planejamento em Excel precisa acabar, para não existirem duas fontes de
informação, e o Colmeia precisa entregar o modelo operacional da execução. Fim de novembro e dezembro são para tirar
obstáculos; a partir de janeiro o time foca 100% no comercial.`

export const NECESSIDADES: Necessidade[] = [
  {
    slug: 'volume-manual-da-praca',
    titulo: 'Usar o volume manual da praça enquanto o banco de ativos estiver incompleto',
    reuniao: `Praças distantes (Belém, Cuiabá, Recife) têm inventário incompleto. Exemplo citado: Cuiabá tem 250 ativos, mas só
10 no Colmeia, e a cobertura fica irreal. Solução provisória combinada: a ferramenta usa o volume manual da praça informado
pelo time até o banco de ativos superar esse número.`,
    base: `Dado real hoje: serv_product_be180.bancoAtivos_ft tem 57 ativos ativos em Cuiabá, 739 em Belém, 2.291 em Recife; a
base GeoFusion (serv_product_be180.baseGeofusion_ft) tem 123 pontos em Cuiabá, 2.653 em Belém e 7.332 em Recife.
A cobertura agregada vem de lab_product_be180.reportDataIndicadoresViasPublicasTotal_dm_vw (pontosPracaTotal_vl,
pontosPracaPropTotal_vl, coberturaLimiteTotal_vl, oohLimitProp_vl), lida por handlers/lab-indicadores.js (GET /api/lab-indicadores?pk=).
O inventário da praça e o sorteio usam a contagem real do banco: handlers/lab-inventario.js e handlers/inventario-cidade.js
(serv_product_be180.baseAtivosJoinGrupoSubCount_ft_vw.count_vl), handlers/lab-inventario-pontos.js (baseAtivosJoin_ft_vw) e
lab.sp_amostrar (POST /api/lab-amostrar). A memória de cálculo da praça está em handlers/lab-auditoria.js (memoriaCadeiaPraca_vw)
e em src/screens/CriarRoteiroNew/memoria/CadeiaPraca.tsx. Já existe um corretor por praça vigente em
lab_product_be180.fluxoCorretorPraca_dm (fator_vl, vigenteDesde_dt, vigenteAte_dt, motivo_st, definidoPor_st), que serve de
modelo de tabela parametrizável com vigência e autor.
Lacuna: nenhum campo de "volume manual da praça"; volume_praca em handlers/inventario-enriquecimento.js só prioriza a fila de
endereços. A deflação de frequência depende do tamanho da praça (serv_product_be180.cidadeTamanhoPraca_dm), que só classifica 10
cidades (SP, RJ, Campinas, BH = G; Curitiba, Porto Alegre, Brasília, Salvador, Fortaleza, Recife = M): Cuiabá e Belém não estão lá.`,
  },
  {
    slug: 'geofusion-x-deflacionado',
    titulo: 'Mostrar números GeoFusion e números deflacionados do Colmeia em duas colunas',
    reuniao: `Mostrar os números GeoFusion e os números deflacionados do Colmeia em duas colunas separadas, para o mercado ver
números comparáveis. O deflator considera a parte da audiência realmente comprada (slots de 10 segundos, horários exclusivos):
a fórmula é a mesma, mas o dado é tratado de forma mais coerente. O Colmeia precisa falar a língua do mercado.`,
    base: `A frequência deflacionada já é calculada: lab_product_be180.indicadorSemana_ft guarda frequenciaTeorica_vl,
deflacaoFrequencia_vl e frequencia_vl (frequencia = frequenciaTeorica × deflacao / 100, como em CriarRoteiro.tsx). A escada
de deflação está em serv_product_be180.deflacaoFrequencia_dm (de_vl, ate_vl, deflacao_vl por tamanhoPraca_st; ex.: praça G
de 0 a 0,5 deflaciona 14, de 5 a 5,5 deflaciona 50) e a memória por execução em lab_product_be180.memoriaDeflator_ft.
O fluxo bruto GeoFusion (fluxoEstimado_vl) e o calculado (calculatedFluxoEstimado_vl) aparecem lado a lado só em Analytics:
handlers/analytics-comparar.js (GET /api/analytics-comparar?modo=comparar|pontos), CompararPontos.tsx e CompararFicha.tsx.
A tela de resultados (src/screens/CriarRoteiroNew/ResultadosLab.tsx, via GET /api/lab-indicadores) mostra só o número já
deflacionado; a escada aparece em GET /api/lab?action=auditoria&parte=escada.
Lacuna: não há duas colunas GeoFusion × Colmeia na tabela principal de resultados nem no Excel exportado.`,
  },
  {
    slug: 'frequencia-por-perimetro',
    titulo: 'Calcular frequência contra um perímetro próximo ou recorte de bairro',
    reuniao: `A frequência sai baixa ou inconsistente depois dos deflatores (exemplo: 0,82 numa campanha pequena e localizada).
Compras de horário exclusivo complicam. Proposta: calcular contra um perímetro próximo em vez do inventário da praça
inteira. O recorte por bairro já está no pipeline. Também foi dito que frequência 6 com impacto muito grande é difícil de
defender, e houve dúvida se o deflator deveria cair sobre o impacto em vez da frequência (vai para um grupo de trabalho).`,
    base: `Hoje a frequência é calculada na escala da praça inteira: hexágonos (lab_product_be180.hexagono_ft,
memoriaHexagonoVP_vw), população e deflator pelo % do inventário. Na memória: CadeiaPraca.tsx (frequenciaRazao_vl ×
deflator_vl) e handlers/lab-auditoria.js (parte=hexagonos|cadeia). O bairro só serve para busca de inventário:
handlers/lab-inventario-pontos.js (g.bairro_st LIKE @q), handlers/bairros.js (GET /api/referencia?action=bairros, coluna
district de bancoAtivosJoin_ft), e raw GeoFusion tem bairro_st, microarea_st e microregiao_st. O raio em CompararPontos.tsx é
só visual (Leaflet). Os limites por cidade existem em serv_product_be180.bancoAtivosCidadeLimites_dm (bounding box).
Lacuna: o motor não aceita perímetro nem recorte por bairro como universo de cobertura e frequência.`,
  },
  {
    slug: 'download-relatorio-travado',
    titulo: 'Corrigir download de relatório que fica carregando e diverge da planilha',
    reuniao: `A tela de resultados fica carregando sem terminar, e os números da plataforma e da planilha baixada são diferentes.
Revisar o bug de download do relatório do Colmeia em relação à plataforma.`,
    base: `Fluxo atual: aba 6 de CriarRoteiro.tsx (carregarDadosResultados, verificarStatusECarregarDados, baixarRelatorioBlob,
regerarRelatorio) dispara 12 POSTs em paralelo (Promise.allSettled) com src/config/axios.ts em timeout: 0, e
useRoteiroStatusPolling.ts consulta GET /api/roteiro-status a cada 3 s sem teto enquanto planoMidiaGrupo_dm_vw.inProgress_bl
estiver ligado. A tela lê views em tempo real (POST /api/report-indicadores-vias-publicas →
reportDataIndicadoresViasPublicasTotal_dm_vw; POST /api/report-indicadores-summary →
reportDataIndicadoresViasPublicasTotalSummary_dm_vw). O xlsx é um snapshot no Azure Blob (relatorio_{pk}_*.xlsx, POST
/api/blob-relatorio-download) gerado por uma Azure Function (REPORT_FUNCTION_URL em lab_product_be180.appParametroGlobal_dm), e
POST /api/relatorio-regerar aborta no servidor em 240 s. VisualizarResultados.tsx ainda soma os totais no cliente (média de
frequencia_vl, coberturaProp_vl manual) em vez da view Summary.
Itens já abertos no quadro Colmeia sobre o mesmo sintoma: 13255167905 (planilha exportada diferente dos resultados, frequência
no target), 12022599206 (exportação da aba ft sem algumas praças e sem IPV) e 13345321088 (pontos Hello com impacto IPV errado).
Causas prováveis: inProgress_bl preso, requisições sem timeout, polling sem limite e snapshot do blob desatualizado.`,
  },
  {
    slug: 'retorno-de-ocorrencia',
    titulo: 'Avisar o usuário quando a ocorrência que ele abriu for corrigida',
    reuniao: `Não há retorno quando um bug reportado é corrigido. Pedido: dar feedback ao usuário quando o problema que ele
reportou for resolvido. Mensagem de fechamento: tratar o Colmeia como seu e reportar até o menor problema.`,
    base: `Hoje o fluxo é só de ida: OcorrenciaWidget.tsx (montado em src/index.tsx) chama POST /api/ocorrencia-criar
(api/ocorrencia.js → handlers/ocorrencia-criar.js), que cria uma página no Notion (NOTION_OCORRENCIAS_DB) com Status
"Aberto", Tipo, Gravidade, Descrição, Usuário e URL. Não há tabela SQL de ocorrências, nem leitura de status, e-mail, push ou
aviso dentro do app. O app já tem cron autenticado por CRON_SECRET em vercel.json (padrão dos crons de enriquecimento).`,
  },
  {
    slug: 'manutencao-e-alerta-slack',
    titulo: 'Avisar manutenção com antecedência e alertar a infra no Slack quando a simulação demorar',
    reuniao: `Manutenções sem aviso bloquearam simulações de madrugada. A infra disse que não houve esse problema nos últimos dois
ou três meses e pediu para ser avisada se voltar. Pedido: comunicar janelas de manutenção e atualização com antecedência, e
reportar à infra pelo Slack (suporte 24x7) qualquer processamento acima de 3 a 5 minutos.`,
    base: `Não existe banner de manutenção nem integração com Slack (nenhuma variável SLACK_*). A simulação é disparada por POST
/api/roteiro-simulado e POST /api/databricks-roteiro-simulado (handlers/databricks-roteiro-simulado.js, Logic App/Databricks) e
acompanhada por GET /api/roteiro-status; a duração só aparece como timer local (tempoDecorrido em CriarRoteiro.tsx). O lab
registra execuções em lab_product_be180.execucao_ft e execucaoEtapa_ft (sp_abrirExecucao, sp_fecharExecucao), base para
medir duração. Parâmetros globais ficam em lab_product_be180.appParametroGlobal_dm (chave_st, valor_st, active_bl), candidato
para a janela de manutenção. Funções api/*.js têm maxDuration 600 em vercel.json.`,
  },
  {
    slug: 'benchmark-de-resultados',
    titulo: 'Benchmark de resultados ruins, bons e ótimos',
    reuniao: `Entregar a funcionalidade de benchmark: uma referência do que é resultado ruim, bom e ótimo. A maioria do time não se
sente pronta para escolher os pontos dos planos.`,
    base: `Não há nada chamado benchmark no repositório. O que serve de base: handlers/analytics-historico-vp.js (GET
/api/analytics-historico-vp?modo=limites|lista, distribuições P10 a P90 de planos reais), handlers/analytics-comparar.js
(histórico por praça), src/screens/Analytics/compararAnalise.ts (verificar(): selos de teto, escada e inventário) e
GraficoCenarios.tsx (faixa do histórico e alvo). Resultados por roteiro e semana: lab_product_be180.resultadoSemana_ft e
reportSemana_ft (coberturaProp_vl, frequencia_vl, grp_vl, trp_vl, cpm_vl, impactosIpv_vl, cidade_st, kantarTarget*).
Lacuna: sem faixas calibradas por praça, target e tipo de plano, e sem exibição na tela de resultados.`,
  },
  {
    slug: 'guia-de-metodologia',
    titulo: 'Guia de metodologia dentro do app para cobertura, frequência e deflatores',
    reuniao: `O time não se sente seguro para explicar cobertura, frequência e deflatores ao cliente. A frequência do Colmeia
difere da convenção do mercado, que costuma usar impacto e cobertura. Pedido: treinamento e guia de metodologia, do
estagiário ao diretor. Um slide de metodologia apresentado à Unilever nunca foi questionado.`,
    base: `A metodologia existe, mas espalhada: aba Memória de cálculo (src/screens/CriarRoteiroNew/memoria/MemoriaCalculoLab.tsx,
HistoriaMemoria.tsx, EntradaMemoria.tsx com tooltips de deflator e pontos), glossário em CompararResumo.tsx e dicas em
CompararPlanos.tsx (METRICAS). Dados da memória: GET /api/lab?action=auditoria&parte=entrada|conta|cadeia|escada sobre
memoriaMatrizVP_vw, memoriaContaVP_vw, memoriaRegrasVP_vw e memoriaTresNumeros_vw. Documento: docs/WHITE_PAPER_COLMEIA.md.
Lacuna: não há um guia único, nem explicação contextual ao lado de cada número na tela de resultados.`,
  },
  {
    slug: 'reportar-ativo-inconsistente',
    titulo: 'Reportar ponto faltando ou inconsistente direto do banco de ativos',
    reuniao: `Usar o banco de ativos e reportar ao time qualquer ponto faltando ou inconsistente. O banco de ativos cresceu mais de
200% no último mês, com exibidores priorizados por porte, e o enriquecimento continua diário; os usuários devem dizer se isso
aparece nos relatórios.`,
    base: `Banco de ativos: api/banco-ativos.js (GET /api/banco-ativos-dashboard, -mapa, -centroids, -perimetro, -health, busca) sobre
serv_product_be180.bancoAtivosJoin_ft e bancoAtivos_ft (126.070 linhas; code, latitude, longitude, district, city_id,
media_exhibitor_id, is_active, is_deleted, observations). Telas BancoDeAtivos.tsx e BancoAtivosHealthCheck.tsx. Enriquecimento
diário por cron (api/cron-inventario-enriquecimento.js, fila banco_ativos_enriquecimento_dm) e push de parceiros
(POST /api/inventario-parceiro → exibidor_inventario_item_dm). Comentários hoje só existem no fluxo de exibidores
(serv_product_be180.exibidor_solicitacao_comentario_dm).
Lacuna: reportar problema só pelo OcorrenciaWidget global, sem o code ou a coordenada do ativo, e sem retorno ao usuário.`,
  },
  {
    slug: 'reprodutibilidade-e-plano-master',
    titulo: 'Resultados reproduzíveis entre rodadas e plano master explícito',
    reuniao: `Planos dão resultados diferentes entre revisões mesmo com os mesmos ativos, muitas vezes porque o mix de ativos mudou.
A simulação sorteia pontos; a funcionalidade de plano master (fixar pontos definidos) já endereça isso.`,
    base: `Sorteio: handlers/lab-amostrar.js → lab.sp_amostrar com modo 'sorteio', disparado em fundo por handlers/lab-motor.js
(amostrarEmFundo). Pontos gravados em lab_product_be180.pontoMidia_ft (ordemSorteio_vl), amostra_ft, amostraLote_ft e
amostraSequencia_ft. Plano master: lab_product_be180.roteiro_dm.roteiroMaster_pk e versao_vl (só 71 de 4.655 roteiros ativos
têm versão/master), handlers/lab-roteiro-salvar.js (sp_ingerirRoteiro, sp_criarVersaoSimulado, sp_vincularMaster),
sp_revisarAmostra e herdado_bl. Reprocessar com a mesma amostra: POST /api/lab-processar com --usar-amostra-atual. Fixar
coordenadas: POST /api/lab-importar-pontos (lab.sp_importarPontos) e edição por sp_editarPontos.
Lacuna: o usuário não vê a semente nem o motivo da variação, e não há botão explícito de "fixar sorteio".`,
  },
  {
    slug: 'projetos-especiais',
    titulo: 'Medir impacto de projetos especiais em produção e visibilidade pelo cadastro de grupo',
    reuniao: `Ajudaria medir o impacto de projetos especiais na produção e na visibilidade. O cadastro de grupo vai resolver isso.
Projetos especiais, custos de produção e escolha manual de pontos são parte da flexibilidade que hoje só o Excel dá.`,
    base: `Cadastro de grupo: handlers/plano-midia-grupo.js (POST /api/plano-midia-grupo, sp_planoMidiaGrupoInsert) e
plano-midia-grupo-target.js (sp_planoMidiaGrupoUpdateTarget) sobre serv_product_be180.planoMidiaGrupo_dm; catálogo de grupo e
subgrupo com IPV em grupo_dm (10) e grupoSub_dm (151; ipv_vl, status_st, criadoPor_st, validadoPor_st), administrado por
src/screens/CadastroMidia/CadastroMidia.tsx e handlers/admin-cadastro-midia.js
(GET /api/referencia?action=admin-cadastro-midia&mode=grupos). O impacto indoor por linha está em handlers/lab-indoor-plano.js
(impactoIndoorDaLinha). O parser do plano já lê custoInstalacao_vl e producaoFinalizacao_st (src/utils/parsePlanoOohExcel.ts).
Lacuna: não existe entidade de projeto especial nem medição dedicada de produção × visibilidade.`,
  },
  {
    slug: 'template-de-upload-tolerante',
    titulo: 'Template de upload mais simples e que aceite o formato que o time já usa',
    reuniao: `O template de upload é difícil de usar (copiar e colar semana 1, semana 2). O formato exigido pelo Colmeia é diferente
dos dados que o time já tem, embora possa ser remodelado.`,
    base: `Upload: api/uploads.js (POST /api/uploads?action=roteiros|plano-midia|pontos-unicos|inventario-insert) e
POST /api/lab-importar-plano (handlers/lab-importar-plano.js, sp_guardarPlanilha em lab_product_be180.planoMidiaPlanilha_ft).
O parser src/utils/parsePlanoOohExcel.ts exige semanas week01_vl a week52_vl em colunas fixas e acha o cabeçalho pelo de-para
administrável em lab_product_be180.planilhaCampo_dm (80 campos) e planilhaCampoNome_dm (99 nomes aceitos), via
handlers/admin-colunas-planilha.js (GET /api/admin?action=colunas-planilha). Há seletor semanaDe/semanaAte, mas não há
"replicar semana". Templates em três lugares: Blob, public/template_plano_midia.xlsx e handlers/_templates/plano_midia_v14.xlsx.
Lacuna: importador tolerante a layouts do time e assistente para repetir semanas.`,
  },
  {
    slug: 'relatorio-semanal-por-veiculo',
    titulo: 'Relatório semanal da campanha com detalhe por veículo',
    reuniao: `O Colmeia não tem o detalhe semana a semana por veículo; o time faz contas proporcionais a partir dos impactos do plano.`,
    base: `O semanal do roteiro é praça × semana: handlers/report-indicadores-week.js e report-indicadores-week-vias-publicas.js
(POST /api/report-indicadores-week*, views reportDataIndicadoresConsolidadoWeek_dm_vw e
reportDataIndicadoresViasPublicasWeek_dm_vw; lab_product_be180.reportSemana_ft tem cidade_st e week_vl, sem exibidor). Semana ×
exibidor só existe no relatório P1A (api/relatorio-p1a.js: POST /api/relatorio-p1a-exibidor →
sp_reportResultExibidorGeoClosed/PracaClosed/UfClosed; P1aExibidorTab.tsx). Por ponto e semana existem
lab_product_be180.pontoSemana_ft e pontoResultado_ft, e o exibidor vem de bancoAtivos_ft.media_exhibitor_id
(bancoAtivosExibidor_dm).
Lacuna: o detalhe por veículo não está na aba 6 nem no xlsx do roteiro.`,
  },
  {
    slug: 'importar-planos-historicos',
    titulo: 'Importar em lote os planos históricos que estão em planilhas',
    reuniao: `O histórico de planos vive em planilhas, e largar isso de um dia para o outro seria um caos. O objetivo de longo prazo
é o briefing gerar o plano a partir desse histórico.`,
    base: `Hoje cada plano histórico entra por upload manual: parsePlanoOohExcel.ts → POST /api/lab-importar-plano, ou pelo legado
POST /api/plano-midia?action=desc|sp-from-import|sp-ooh-insert (sp_planoMidiaFromImport, sp_planoMidiaOohInsert,
sp_planoMidiaDescInsert) e POST /api/upload-roteiros. Roteiros já processados entram como versão anterior via
sp_ingerirRoteiro. Destino das linhas: serv_product_be180.planoMidiaImport_ft (38.179 linhas, 144 colunas) e
planoMidiaImportFile_dm (576 arquivos; filename_st, source_st, firstWeekStart_dt, planoMidiaGrupo_pk).
Lacuna: sem importação em lote, sem fila com relatório de erro por arquivo e sem conferência em massa de grupo e formato.`,
  },
]

export const EPICO_PLANILHA: Epico = {
  slug: 'epico-planilha-colmeia',
  titulo: 'Épico · Planilha Colmeia: usabilidade de Excel, exportação em vários formatos espelhando o banco e co-pilot',
  reuniao: `Por que o Excel persiste: agilidade (copiar e colar, adaptar rápido, mídia nova sem esperar cadastro), histórico,
segurança para lançar dado do veículo na hora, flexibilidade (células abertas, resumos criativos, descrições, projetos
especiais, custo de produção, escolha manual de pontos), comentários como contexto e cultura do mercado (o mercado trabalha em
Excel; o plano pode continuar sendo entregue em Excel como saída). Recomendação: espelhar o template Excel no Colmeia com
colunas editáveis e texto livre. Pedido do produto: construir uma ferramenta com a usabilidade do Excel, exportação em vários
formatos (inclusive Excel espelhando o banco e os dados) e co-pilot de IA, para acabar com as duas fontes de informação.`,
  base: `O que já existe: exportação fiel ao template em handlers/lab-exportar-plano.js (GET|POST /api/lab-exportar-plano; template
handlers/_templates/plano_midia_v14.xlsx; fórmulas em handlers/lab-formulas-plano.js; procedência de cada linha
calculado/sugerido/em branco; registro em lab_product_be180.memoriaExportacao_ft), linhas importadas em
serv_product_be180.planoMidiaImport_ft (144 colunas), dicionário de colunas em lab_product_be180.planilhaCampo_dm e
planilhaCampoNome_dm, link público em planoMidiaLinkPublico_dm (GET/POST /api/link-publico, GET /api/visualizar-publico),
versões em roteiro_dm (roteiroMaster_pk, versao_vl) e co-pilot em api/copilot.js (handlers/copilot-agent.js com as tools
consultar_sql, chamar_api_colmeia, buscar_dicionario, github e sugerir_tarefa; log em serv_product_be180.copilot_log_ft).
A biblioteca de planilha é xlsx 0.18. A tela LinhasDoPlanoLab.tsx só lê; a edição depende de baixar, editar e reimportar.`,
  filhas: [
    {
      slug: 'grade-tipo-excel',
      titulo: 'Grade do plano com usabilidade de Excel',
      reuniao: `Espelhar o template Excel com colunas e linhas editáveis, descrição em texto livre e campo de custo de produção.
Agilidade de copiar e colar e de incluir mídia nova sem esperar cadastro.`,
      base: `Linhas do plano: serv_product_be180.planoMidiaImport_ft (campanha_st, praca_st, exibidor_st, formato_st, descricao_st,
grupo_st, especificacoes_st, numeroInsercoesCompradas_vl, week01_vl a week52_vl...) e lab_product_be180.planoMidiaPlanilha_ft
(linhasJson_st, semanaDe_vl, semanaAte_vl). Campos e rótulos: planilhaCampo_dm (campo_st, rotulo_st, tipo_st, obrigatorio_st,
ordem_vl). O parser já conhece descricao_st, custoInstalacao_vl e producaoFinalizacao_st (parsePlanoOohExcel.ts). Tela atual
somente leitura: src/screens/CriarRoteiroNew/LinhasDoPlanoLab.tsx (GET /api/lab-exportar-plano?formato=linhas). Gravação
existente: POST /api/lab-importar-plano (sp_guardarPlanilha, lab.sp_importarPlano). Lacuna: edição célula a célula, colar
bloco do Excel, desfazer, filtros, colunas fixas e autosave.`,
    },
    {
      slug: 'comentarios-por-celula',
      titulo: 'Comentários por célula no plano',
      reuniao: `As notas do Excel dão contexto descritivo, e o Colmeia precisa de algo equivalente.`,
      base: `Não há campo de comentário no plano (parsePlanoOohExcel.ts não lê comentários) nem tabela de comentário de plano. O único
modelo de comentário no banco é serv_product_be180.exibidor_solicitacao_comentario_dm (comentario_pk, lote_fk, autor_st,
mensagem_st, dataCriacao_dh), do fluxo de exibidores. A exportação (lab-exportar-plano.js) monta o xlsx a partir do template, e
a biblioteca xlsx 0.18 só escreve comentários de célula de forma limitada.`,
    },
    {
      slug: 'diferenca-entre-versoes',
      titulo: 'Diferença entre versões do plano e congelar pontos que não mudaram',
      reuniao: `Rastrear mudanças entre versões do plano (pontos que entraram, saíram ou ficaram) e deixar o Colmeia congelar os
pontos que não mudaram.`,
      base: `Já existe o diff: handlers/lab-plano-revisao.js (compararCelulas: ficam, entram, saem por célula IBGE × semana × grupoSub;
regra ficam = Math.min(n, p)), POST /api/lab-comparar-plano, POST /api/lab-comparar-pontos (identidade lat 4 casas + lng +
tipoMidia_st), GET /api/lab-pontos-versao (mantido/incluido), GET /api/lab-versoes-anteriores; telas RevisaoPlanoLab.tsx
(ComparacaoPlano) e PontosLab.tsx; versões em CriarRoteiroNew.tsx (gerarNovaVersao, salvarProximaVersao). Cadeia de versões
por lab_product_be180.roteiro_dm.roteiroMaster_pk; procedures sp_criarVersaoCompleto, sp_criarVersaoSimulado,
sp_mudarPeriodoVersao, sp_revisarAmostra (herdado_bl).
Lacuna: não existe ação explícita de congelar ponto ou célula; a manutenção é só a regra automática.`,
    },
    {
      slug: 'exportacao-multiformato',
      titulo: 'Exportar o plano em vários formatos, com Excel espelhando o banco',
      reuniao: `O mercado trabalha em Excel; o plano pode continuar sendo entregue em Excel como saída enquanto a operação interna roda
na tecnologia. Pedido: exportar em vários formatos, inclusive Excel espelhando o banco e os dados.`,
      base: `Exportação atual: handlers/lab-exportar-plano.js remenda o template v14, preenche o impacto linha a linha com procedência
(coluna EI: calculado, sugerido ou em branco; o que não tem número sai em branco, nunca zero) e replica fórmulas
(lab-formulas-plano.js); tela ExportarPlanoLab.tsx; memória em lab_product_be180.memoriaExportacao_ft (exportacao_st, linha_vl,
procedencia_st, motivo_st, arquivo_st, usuarioName_st). Outros downloads separados: relatório do roteiro no blob (POST
/api/blob-relatorio-download), P1A (api/relatorio-p1a.js), RelatorioXlsxLab.tsx. Link público: planoMidiaLinkPublico_dm.
Lacuna: só xlsx; sem CSV, PDF ou Google Sheets; sem aba com as colunas do banco e a origem de cada número num único arquivo.`,
    },
    {
      slug: 'reimportar-excel-editado',
      titulo: 'Reimportar o Excel editado fora do Colmeia com conferência antes de gravar',
      reuniao: `Agilidade e cultura do mercado: parte do trabalho continua no Excel. O Colmeia precisa aceitar o arquivo de volta sem
virar uma segunda fonte de verdade.`,
      base: `Importação: POST /api/lab-importar-plano (handlers/lab-importar-plano.js, sp_guardarPlanilha, lab.sp_importarPlano), que já
compara com a versão anterior (handlers/lab-comparar-plano.js). Validação de cabeçalho no navegador por acharCabecalho em
src/utils/parsePlanoOohExcel.ts, com o de-para de planilhaCampo_dm e planilhaCampoNome_dm. Linhas da exportação são
identificáveis por memoriaExportacao_ft (exportacao_st, linha_vl).
Lacuna: o arquivo exportado não carrega identificador estável de linha e versão para casar na volta.`,
    },
    {
      slug: 'copilot-na-planilha',
      titulo: 'Co-pilot dentro da planilha: explicar números, checar coerência e montar plano a partir do briefing',
      reuniao: `Sugestão de um agente de IA para julgar se os resultados são coerentes. Objetivo de longo prazo: o briefing gerar o plano
automaticamente a partir do histórico de planos.`,
      base: `Co-pilot existente: api/copilot.js (GET ?action=status|tarefas, POST ?action=chat; só usuário interno; COPILOT_ENABLED
desligado em produção por padrão), handlers/copilot-agent.js (executarCopilot), tools em handlers/copilot-tools
(consultar_sql com sql-guard e docs/copilot/sql-whitelist.json, chamar_api_colmeia com docs/copilot/api-catalog.json,
buscar_dicionario, github, sugerir_tarefa), log em serv_product_be180.copilot_log_ft. Coerência hoje é regra fixa em
src/screens/Analytics/compararAnalise.ts (verificar). Geração de variações a partir de um plano de referência:
handlers/analytics-comparar.js (modo=gerar) e GerarCenarios.tsx; histórico em analytics-historico-vp.js.
Lacuna: sem tool de avaliação de coerência pós-processamento, sem briefing → plano e sem co-pilot no contexto da grade.`,
    },
  ],
}
