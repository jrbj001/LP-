/**
 * Guia das fontes que toda pesquisa de conhecimento percorre (Copilot e agente de reunião).
 * Reuniões e documentos entram sempre; o planejador só escolhe bancos e o guia explica ao modelo
 * o que cada fonte responde, para que a escolha dos bancos use o mesmo critério.
 */
export const WORKSPACE_SOURCE_GUIDE = [
  '- Reuniões do cliente (incluindo as gravadas pelo Cadence, com decisões, riscos e itens de ação): o que foi decidido, combinado ou discutido, e quando.',
  '- Documentos do workspace (portal e uploads): especificações, manuais, arquitetura e planos.',
  '- Código e PRs dos repositórios GitHub: como algo funciona, mudanças mescladas e commits recentes.',
  '- Workspace Cadence (base própria): cards do backlog, entregas e status de execução. Não representa usuários nem registros de produtos de cliente.',
].join('\n')
