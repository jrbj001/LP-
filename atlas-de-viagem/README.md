# Atlas de Viagem

Descoberta turística em um globo 3D: abra o globo, explore uma região, descubra
um lugar, aproxime a câmera, leia sobre ele e salve nos favoritos. Funciona sem
login e sem banco de dados.

Stack: Next.js 15 (App Router), TypeScript e CesiumJS. O globo carrega só no
cliente. Os favoritos ficam no `localStorage` do navegador.

## Instalação

```bash
cd atlas-de-viagem
npm install          # também copia os assets do Cesium para public/cesium
cp .env.example .env.local
```

## Token do Cesium ion

1. Crie uma conta em [ion.cesium.com](https://ion.cesium.com) e abra **Access Tokens**.
2. Crie um token só com o escopo `assets:read`, restrito aos assets
   **1 (Cesium World Terrain)** e **2 (Bing Maps Aerial)**. Em produção, limite
   também as URLs permitidas ao domínio do app.
3. Coloque o token em `.env.local`:

```bash
NEXT_PUBLIC_CESIUM_ION_TOKEN=seu-token
```

Sem token, o globo usa imagens de satélite públicas (Esri World Imagery), sem relevo
3D, e continua nítido ao aproximar da cidade. Com o token, usa o Cesium World Imagery
e o Cesium World Terrain. Se a imagem pública falhar, cai para o Natural Earth II
embutido no Cesium: um mapa simplificado, só com detalhe de continente.

## Comandos

```bash
npm run dev        # desenvolvimento em http://localhost:3200
npm run typecheck  # checagem de tipos
npm run build      # build de produção
npm run start      # serve o build em http://localhost:3200
```

`dev` e `build` copiam antes os assets estáticos do Cesium (workers, widgets e
texturas) para `public/cesium`, servidos em `/cesium`.

## Dados

- `src/data/catalog.ts`: catálogo curado com 4 destinos (São Paulo, Rio de
  Janeiro, Cusco e Deserto do Atacama) e 29 atrações reais, com coordenadas
  e IDs Wikidata conferidos.
- `GET /api/places/nearby?lat=&lon=&radius=&limit=` consulta a Wikipédia
  (MediaWiki Action API, `generator=geosearch`): primeiro em português e, se
  houver poucos resultados elegíveis, também em inglês. Só aceita páginas com
  evidência turística nas categorias ou na descrição, remove duplicatas (por
  Wikidata ou por nome e distância), prioriza os pontos curados e usa cache
  por região. Valores aceitos: raio de 200 a 10.000 m e `limit` até 30.
- `GET /api/places/media?lang=&title=` devolve a foto da página só quando a
  licença e o autor podem ser identificados.
- `WIKIPEDIA_API_ENDPOINT` (opcional) troca o endpoint da Wikipédia. Serve para
  usar um espelho ou para simular a API fora do ar.

Créditos: a camada de mapa exibe sempre os créditos do Cesium e dos provedores
de imagem. Os textos descobertos vêm da Wikipédia (CC BY-SA 4.0) e as fotos
mostram autor e licença.
