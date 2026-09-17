export const MODELS = ['GPT', 'Claude', 'Gemini', 'Grok', 'Open Models']

export const ENTERPRISE_SYSTEMS = [
  'GitHub',
  'CRM',
  'ERP',
  'Databases',
  'Meetings',
  'Documents',
]

export const FRAGMENTED_SYSTEMS = [
  'GitHub',
  'CRM',
  'ERP',
  'Meetings',
  'Documents',
  'Databases',
  'People',
]

export const ADAPTIVE_CAPABILITIES = [
  'Context',
  'Memory',
  'Enterprise State',
  'Identity',
  'Permissions',
  'Policies',
  'Skills',
  'Observability',
]

export const CONTEXT_NODES = [
  'People',
  'Projects',
  'Customers',
  'Meetings',
  'Tasks',
  'Decisions',
  'Policies',
  'Permissions',
  'Systems',
  'Goals',
]

export const CONTEXT_PATH = [
  'Customer',
  'Project',
  'Meeting',
  'Decision',
  'Requirement',
  'Task',
  'Agent',
  'Action',
  'Outcome',
]

export const ENTERPRISE_QUESTIONS = [
  'What is happening?',
  'What happened before?',
  'Who is involved?',
  'What am I allowed to know?',
  'What am I allowed to do?',
  'What company policies apply?',
]

export const ACTION_COMMANDS = [
  'get_customer_context("Acme")',
  'get_project_state("Atlas")',
  'search_decisions("pricing")',
  'create_task({ owner, intent })',
  'update_crm({ opportunity })',
  'request_approval({ action })',
  'deploy_code({ change })',
]

export const GOVERNANCE_STEPS = [
  'Identity',
  'Permission',
  'Policy',
  'Approval',
  'Action',
  'Audit',
]

export const CADENCE_CONTEXT = [
  'Context',
  'Requirements',
  'Code',
  'Dependencies',
  'Decisions',
]

export const CADENCE_FLOW = [
  'Human creates intent',
  'Cadence understands context',
  'Story enriched',
  'Agent executes',
  'Human reviews',
  'QA Agent validates',
  'Done',
]

export const FLYWHEEL = [
  'Enterprise',
  'Context',
  'Humans + Agents',
  'Actions',
  'Outcomes',
  'Decisions',
  'Memory',
]

export const NAV_ITEMS = [
  { label: 'Adaptive', href: '/pixel' },
  { label: 'Cadence', href: '/cadence' },
  { label: 'Alquimia', href: '/alquimia' },
  { label: 'Clients', href: '/client' },
]
