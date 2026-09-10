import type { ClientWorkspace } from '@/lib/client/types'

export const pixelPulseLab: ClientWorkspace = {
  id: 'pixelpulselab',
  slug: 'pixelpulselab',
  name: 'PixelPulseLab',
  sector: 'Adaptive Layer™ · Cadence',
  tagline:
    'Canal interno Cadence — WhatsApp Business Pixelpulselab.dev e copiloto da operação PixelPulseLab.',
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
      updatedAt: '09/09/2026',
      tags: ['Cadence', 'WhatsApp', 'Twilio'],
      boardIds: ['cadence'],
      href: 'https://github.com/jrbj001/LP-',
    },
  ],
  docs: {
    eyebrow: 'Cadence',
    title: 'PixelPulseLab',
    titleAccent: 'interno',
    categories: [],
    supportEmail: 'hello@pixelpulselab.dev',
  },
  delivery: {
    repos: [
      {
        owner: 'jrbj001',
        repo: 'LP-',
        label: 'Cadence · Adaptive Layer™',
        products: [{ label: 'Cadence', pattern: 'cadence|adaptive.?layer|copilot' }],
      },
    ],
  },
}
