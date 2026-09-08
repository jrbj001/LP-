# AGENTS.md

## Servidor de desenvolvimento

Use sempre `vercel dev`. Não use `next dev`, `npm run dev` ou qualquer outro comando
para subir o servidor local.

Nunca rode `npm run build` (ou `next build`) enquanto o `vercel dev` estiver ativo:
o build de produção sobrescreve o `.next` que o dev server mantém em memória e
derruba a aplicação com erros de `MODULE_NOT_FOUND` e chunks ausentes.

Para validar tipos e lint sem quebrar o servidor, use `npx tsc --noEmit` e `npx next lint`.

Se o `.next` for corrompido: encerre o `vercel dev`, rode `rm -rf .next` e suba o
`vercel dev` novamente — reiniciar sem limpar o cache não resolve.
