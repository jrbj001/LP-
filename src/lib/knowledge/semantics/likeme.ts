import type { SemanticPack } from './types'

export const likemeSemanticPack: SemanticPack = {
  id: 'likeme',
  matchSource: name => /like:?me|supabase/i.test(name),
  timeZone: 'America/Sao_Paulo',
  metrics: [
    {
      id: 'usuarios-produto',
      label: 'Usuários do produto',
      match: /\b(usu[aá]rios?|pessoas?|base)\b/i,
      canonical: [{ schema: 'public', table: /^user$/i, required: true }],
      forbid: [{ schema: 'auth', table: /^users$/i }],
      defaultFilters: [
        'Não filtre deleted_at, status ou “ativo” se a pergunta pedir só o total da base.',
        'Se a pessoa pediu “ativo no produto”, use o status de public.user — nunca auth.users.',
      ],
      timeColumnHint: 'created_at ou inserted_at de public.user',
      joins: [],
      notes: [
        'Contagem canônica de usuários do Like:Me é public.user.',
        'auth.users são identidades do Supabase Auth, não o cadastro do produto.',
      ],
    },
    {
      id: 'usuarios-auth',
      label: 'Identidades de login',
      match: /\b(auth\.users|identidades? de login|supabase auth)\b/i,
      canonical: [{ schema: 'auth', table: /^users$/i, required: true }],
      forbid: [],
      defaultFilters: ['Use auth.users somente para pergunta explícita de login/identidade.'],
      timeColumnHint: 'created_at de auth.users',
      joins: [],
      notes: ['Não use este total como “usuários do produto”.'],
    },
    {
      id: 'comunidade',
      label: 'Comunidade',
      match: /\bcomunidades?\b/i,
      canonical: [
        { schema: 'public', table: /community/i, required: true },
        { schema: 'public', table: /member/i },
      ],
      forbid: [{ schema: 'auth', table: /^users$/i }],
      defaultFilters: [],
      joins: ['community_member.community_id → community.id, quando as duas existirem'],
      notes: ['Comunidade não é um proxy de usuários do produto.'],
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      match: /\b(marketplace|compra|pedido|assinatur)/i,
      canonical: [
        { schema: 'public', table: /(market|order|pedido|product|listing|assinatur|subscri)/i, required: true },
      ],
      forbid: [{ schema: 'auth', table: /^users$/i }],
      defaultFilters: [],
      joins: [],
      notes: ['Perguntas de compra/assinatura ficam no domínio de marketplace, não em auth.users.'],
    },
  ],
}
