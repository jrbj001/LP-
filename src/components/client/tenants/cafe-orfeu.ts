import type { ClientWorkspace } from '@/lib/client/types'

/**
 * Café Orfeu no Portal do Cliente.
 * Por enquanto o space aponta para o Technology Assessment legado (`/adaptive`).
 */
export const cafeOrfeu: ClientWorkspace = {
  id: 'orfeu',
  slug: 'orfeu',
  name: 'Café Orfeu',
  sector: 'Café especial · Adaptive Layer™',
  tagline:
    'Technology Assessment — discovery por área, Adaptive Layer™ e executive review do engajamento com a PixelPulseLab.',
  status: 'active',
  accent: '#6b3f2a',
  entryPath: '/adaptive',
  contacts: [
    { name: 'José Roberto', role: 'Principal Engineer · PixelPulseLab', email: 'hello@pixelpulselab.dev' },
    { name: 'Ricardo Madureira', role: 'Sponsor Executivo · Grupo Orfeu' },
  ],
  stats: [
    { label: 'Assessment', value: 'Ativo' },
    { label: 'Stakeholders', value: '15' },
    { label: 'Projetos', value: '31' },
  ],
  docs: {
    eyebrow: 'Adaptive',
    title: 'Café Orfeu',
    titleAccent: 'assessment',
    categories: [],
    supportEmail: 'hello@pixelpulselab.dev',
  },
}
