import type { ClientWorkspace } from '@/lib/client/types'

export const cadence: ClientWorkspace = {
  id: 'cadence',
  slug: 'cadence',
  aliases: ['pixelpulselab'],
  name: 'Cadence',
  sector: 'Agent-ready Delivery™',
  tagline:
    'Workspace de product management — copiloto, backlog, consultar e canal WhatsApp Pixelpulselab.dev.',
  status: 'active',
  accent: '#0f766e',
  contacts: [{ name: 'José Roberto', role: 'Principal Engineer', email: 'hello@pixelpulselab.dev' }],
  stats: [
    { label: 'Canal', value: 'WhatsApp' },
    { label: 'Sender', value: 'Pixelpulselab.dev' },
  ],
  projects: [
    {
      id: 'cadence-platform',
      name: 'Cadence',
      pillar: 'Produto',
      description: 'Workspace agent-ready: copiloto, backlog, consultar e canais.',
      status: 'active',
      owner: 'PixelPulseLab',
      priority: 'Alta',
      updatedAt: '15/09/2026',
      tags: ['Cadence', 'WhatsApp', 'Twilio'],
      boardIds: ['cadence'],
      href: 'https://github.com/jrbj001/LP-',
    },
  ],
  docs: {
    eyebrow: 'Cadence',
    title: 'Cadence',
    titleAccent: 'interno',
    categories: [],
    supportEmail: 'hello@pixelpulselab.dev',
  },
  delivery: {
    repos: [
      {
        owner: 'jrbj001',
        repo: 'LP-',
        label: 'Cadence',
        products: [{ label: 'Cadence', pattern: 'cadence|copilot' }],
      },
    ],
  },
}
