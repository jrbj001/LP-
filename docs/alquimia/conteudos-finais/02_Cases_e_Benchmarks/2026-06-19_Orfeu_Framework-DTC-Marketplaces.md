# Framework DTC & Marketplaces — Café Especial Premium
*Alchemia.co · Para: Orfeu · Jun 2026*
*Documento estratégico: arquitetura de canais digitais para marcas premium de café*

---

## 1. O Ecossistema Digital do Café Premium no Brasil

O mercado digital de café no Brasil opera em três camadas com lógicas distintas:

```
┌─────────────────────────────────────────────────────────┐
│  CAMADA 1 — AQUISIÇÃO (alcance, novos clientes)         │
│  Mercado Livre · Amazon Brasil · Ifood/Rappi            │
│  Lógica: volume, visibilidade, conversão de preço       │
├─────────────────────────────────────────────────────────┤
│  CAMADA 2 — FIDELIZAÇÃO (LTV, recorrência, margem)      │
│  Site próprio · Assinatura · WhatsApp Commerce          │
│  Lógica: relacionamento, dado de cliente, margem bruta  │
├─────────────────────────────────────────────────────────┤
│  CAMADA 3 — IMAGEM (brand equity, validação)            │
│  HoReCa fine dining · B2B premium · Gift corporativo    │
│  Lógica: associação de marca, não receita direta        │
└─────────────────────────────────────────────────────────┘
```

**Princípio fundamental**: cada canal deve ser gerido pela sua lógica primária. Tentar extrair margem de ML é errado. Tentar gerar awareness pelo site próprio é ineficiente. A arquitetura funciona quando cada camada faz o que sabe fazer.

---

## 2. Mercado Livre — Arquitetura de Excelência

### 2.1 Por que ML é o canal de aquisição prioritário

- [~] ML representa 40–60% do volume de e-commerce de alimentos no Brasil
- Catálogo de café especial no ML cresce ano a ano — consumidor já busca lá
- Custo de aquisição no ML é menor que tráfego pago direto para marcas novas em digital
- Reviews e reputação constroem prova social orgânica — ativo de longo prazo

### 2.2 Checklist de Excelência ML para Marca Premium

**Credenciais mínimas obrigatórias:**
- [ ] Loja Oficial verificada (Mercado Líderes / Platinum)
- [ ] ML Envios Full (estoque no CD ML → entrega D+1) — impacto de +15–25% na conversão
- [ ] Nota de reputação verde ou platinum em todos os KPIs

**Conteúdo de listing (diferencial real):**
- [ ] Título otimizado para busca: `[Marca] + [tipo] + [origem] + [gramagem]`
  - Exemplo: "Orfeu Café Especial em Grãos Single Origin Cerrado 250g"
- [ ] Fotos: produto no fundo branco (obrigatório) + lifestyle + ficha técnica visual (origem, notas sensoriais)
- [ ] Descrição longa: storytelling de origem, método de preparo sugerido, dados de qualidade (pontuação SCA, processo, altitude)
- [ ] Ficha técnica completa: variedade, altitude, região, processo, torra, sugestão de preparo
- [ ] Vídeo do produto: 30–60s mostrando grão, torra, preparo — alto impacto em conversão mobile

**Arquitetura de SKUs:**
- SKU de entrada (blend, preço acessível do portfolio) → captura novos compradores
- SKUs core (single origins, kits) → ticket médio + margem
- Kits de 2–4 produtos → ticket médio mais alto, melhor custo de envio relativo
- Evitar SKU ultra-premium no ML como entrada — risco de "vulgarizar" pelo contexto

**Precificação no ML:**
- Preço ML ≤ preço site próprio (consumidor ML compara e desconfia de preço superior)
- Absorver comissão ML (~12–16%) na composição de preço — não compensar subindo MSRP
- Kit strategy: kits têm melhor relação ticket/custo operacional

**Reviews como motor:**
- Solicitar review pós-entrega (ML permite comunicação limitada)
- Responder 100% dos reviews negativos com solução concreta — sinal de qualidade para novos compradores
- Meta: >4,7 estrelas com >200 avaliações nos SKUs principais antes de escalar publicidade

**Publicidade ML (Product Ads):**
- Começar com keywords de categoria genérica: "café especial", "café em grãos", "single origin café"
- Depois: keywords de marca (para defesa) e long-tail (alta intenção, menor CPC)
- Budget inicial: R$3.000–8.000/mês para teste, escalar com ACOS <25%
- Priorizar SKUs com reviews consolidados — anunciar produto sem prova social desperdiça verba

---

## 3. Amazon Brasil — Presença Estratégica Crescente

### 3.1 Posicionamento diferente do ML

Amazon Brasil tem perfil distinto do ML:
- Público Prime: classe A/B, maior poder aquisitivo, mais receptivo a premium
- Gifting: Amazon é mais usado que ML para presentes — kits têm performance melhor
- B2B corporativo: muitas empresas usam conta Amazon Business para suprimentos premium

### 3.2 Checklist de Excelência Amazon para Café Premium

**Infraestrutura:**
- [ ] FBA (Fulfillment by Amazon) — Prime elegível → conversão significativamente maior
- [ ] Loja de marca (Amazon Brand Store) — vitrine editorial completa
- [ ] Brand Registry — proteção de marca + acesso a A+ Content e Amazon Posts

**Conteúdo A+ Content (diferencial editorial):**
- Módulos visuais com storytelling de origem: fazenda, altitude, processo, produtor
- Tabela comparativa de blends/single origins — ajuda na escolha, reduz devolução
- Seção "como preparar" com imagens de método
- A+ Content melhora conversão em ~5–15% e reduz devolução

**SKU Strategy:**
- Foco em kits e produtos de regalo (ticket médio Amazon > ML)
- Linha premium e ultra-premium mais adequada ao Amazon que ao ML
- Cápsulas: boa performance se compatibilidade de máquina está clara no título/bullet points

**Amazon Ads:**
- Sponsored Products para keywords de busca genérica e de marca
- Sponsored Brands para awareness da loja
- DSP (Demand-Side Platform) para remarketing — avançado, ativar após base consolidada

---

## 4. Site Próprio (D2C) — Engenharia de Fidelização

### 4.1 Princípio: o site não é o canal de descoberta, é o canal de aprofundamento

O consumidor descobre a marca no ML ou Amazon. Quando recompra, se tiver tido boa experiência, tende a buscar direto — especialmente se houver incentivo (desconto de assinatura, acesso a lotes exclusivos, programa de pontos).

### 4.2 Arquitetura do Site para Café Premium

**UX editorial (diferencial vs. e-commerce genérico):**
- Cada produto com página completa: origem, fazenda, altitude, variedade, processo, notas de degustação, sugestão de preparo, método ideal
- Conteúdo que ensina — transforma compra em experiência educativa
- Storytelling do produtor: foto da fazenda, mapa de origem, história do agricultor

**Assinatura como pilar:**
```
┌──────────────────────────────────────────────────────┐
│  CLUBE DE ASSINATURA — ESTRUTURA RECOMENDADA          │
├──────────────────────────────────────────────────────┤
│  Frequência: mensal ou bimestral (buyer escolhe)     │
│  Volume: 250g / 500g / 1kg                           │
│  Curadoria: lote do mês selecionado pela marca        │
│  Benefício 1: desconto 10–15% vs. avulso             │
│  Benefício 2: acesso antecipado a microlotes          │
│  Benefício 3: carta de curadoria digital (origem)    │
│  Benefício 4: convite a eventos/degustações           │
│  Meta churn: <5%/mês (equivale a LTV ~20 meses)      │
└──────────────────────────────────────────────────────┘
```

**CRM — Cadência educativa vs. promocional:**
- Regra: 70% conteúdo / 30% oferta
- Sequências automáticas:
  - Pós-compra: guia de preparo do lote comprado
  - 20 dias: artigo sobre a fazenda/origem do lote
  - 35 dias: lembrete de recompra + sugestão de próximo lote
  - Bimestral: newsletter com colheitas da temporada, novidades
- Segmentação: assinantes vs. compradores avulsos vs. inativos 90 dias

**WhatsApp Commerce:**
- Atendimento personalizado via WhatsApp Business API
- Catálogo de produtos integrado
- Recompra com 1 clique para clientes recorrentes
- Opção: bot de qualificação (tipo de preparo → recomendação de produto) + humano para fechamento

**Funil ML → Site próprio:**
- Inserir no kit/produto um cartão físico: "Seu próximo pedido: 10% off no site + acesso ao Clube [Marca]"
- QR Code na embalagem levando a landing page de assinatura
- Email trigger pós-ML: se ML compartilha dados (limitado) — usar via retargeting Meta/Google

---

## 5. Pricing Architecture — Hierarquia de Canais

```
CANAL          | PREÇO RELATIVO | LÓGICA
---------------|----------------|----------------------------------
Assinatura     | Base -15%      | Fidelização — maior LTV compensa
Site D2C avulso| Base          | Referência de preço máximo
Amazon         | Base ±0%       | Paridade — público premium
ML             | Base -5%       | Absorver comissão, manter competitividade
Varejo físico  | Base +5–10%   | Custo de canal + margem do varejista
B2B / HoReCa   | Negociado      | Volume e ticket compensam margem menor
```

**Regra de ouro**: nunca deixar ML mais caro que o site. Se acontecer, o consumidor abandona o carrinho e desconfia da marca.

---

## 6. Estratégia de Conteúdo Digital — Cross-Channel

### Conteúdo que serve os três canais simultaneamente

| Tipo de Conteúdo | ML | Amazon | Site | Instagram | Email |
|-----------------|----|---------|----|-----------|-------|
| Ficha técnica de produto | ✓ | ✓ | ✓ | — | — |
| Storytelling de fazenda | — | ✓ (A+) | ✓ | ✓ | ✓ |
| Tutorial de preparo | — | — | ✓ | ✓ | ✓ |
| Review social proof | ✓ | ✓ | ✓ | ✓ | — |
| Temporada de colheita | — | — | ✓ | ✓ | ✓ |
| Lote especial / microlote | — | — | ✓ | ✓ | ✓ |
| Comparativo de blends | — | ✓ (A+) | ✓ | — | ✓ |

**Princípio de conteúdo premium**: não competir por preço — competir por significado. Cada peça de conteúdo deve responder "por que este café vale o que custa?"

---

## 7. KPIs de Execução Digital — Dashboard Recomendado

### Mercado Livre
| KPI | Benchmark Básico | Meta Premium |
|-----|-----------------|-------------|
| Nota reputação | Verde | Platinum |
| % Avaliações positivas | >95% | >98% |
| Avaliações SKU principal | >200 | >1.000 |
| Conversion rate listing | 2–4% | 6–10% |
| ACOS publicidade | <30% | <20% |
| % pedidos via Full | >70% | >90% |

### Amazon
| KPI | Benchmark | Meta |
|-----|-----------|------|
| Buy Box win rate | >80% | >95% |
| Rating produto | >4,5 | >4,7 |
| % pedidos FBA | >80% | >95% |

### Site D2C / Assinatura
| KPI | Referência | Meta |
|-----|-----------|------|
| Churn mensal assinatura | <8% | <4% |
| LTV assinante | R$800 | R$1.500+ |
| Taxa de recompra (avulso) | >20% | >40% |
| Email open rate | >20% | >30% |
| AOV (average order value) | R$80 | R$150+ |
| Custo de retenção vs. aquisição | 5:1 | 8:1 |

---

## 8. Benchmark Comparativo — Baggio vs. Unique vs. Italle vs. Orfeu (alvo)

| Dimensão | Baggio | Unique | Italle | Orfeu (alvo) |
|----------|--------|--------|--------|--------------|
| ML Execution | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Amazon Execution | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Site D2C / Assinatura | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Brand storytelling digital | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Gift / B2B corporativo | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Pricing architecture | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| CRM / Email marketing | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Conclusão da tabela**: Orfeu tem o melhor ativo de marca entre todos os benchmarks. O gap é de execução digital — não de produto, não de história.

---

## 9. Roteiro de Implementação — Sequência Recomendada para Orfeu

### Fase 1 — Fundação (Ago–Set 2026)
1. Loja Oficial ML com Full habilitado
2. Otimização de listings: títulos, fotos profissionais, ficha técnica completa
3. FBA Amazon ativo para SKUs principais
4. Site com assinatura funcional e CRM configurado

### Fase 2 — Conteúdo & Prova Social (Out–Nov 2026)
5. A+ Content Amazon com storytelling de origem
6. Reviews: campanha estruturada de incentivo a avaliação (pós-entrega)
7. Email sequences automáticas configuradas
8. WhatsApp Business com atendimento ativo

### Fase 3 — Aceleração (Dez 2026+)
9. ML Product Ads com budget escalado (base de reviews sólida)
10. Amazon Sponsored Products e Brands
11. Retargeting Meta/Google para visitantes do site sem conversão
12. Kit de Natal premium: maior janela de gifting do ano — gift corporativo prioridade

---

*Alchemia.co · Framework Estratégico DTC & Marketplaces · Jun 2026*
*Desenvolvido como parte do engajamento Orfeu — Expansão Omnichannel*
*Dados marcados [~] requerem verificação antes de uso em apresentação*
