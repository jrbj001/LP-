export type PillarId =
  | 'purpose-direction'
  | 'people-culture'
  | 'management-system'
  | 'continuous-improvement'
  | 'innovation-growth'

export type EngineId = 'management' | 'continuous-improvement'

export type JourneyStageId = 'diagnostic' | 'focus' | 'design' | 'execution' | 'sustain'

export type PracticeSystem = 'danaher' | 'abi'

export interface Pillar {
  id: PillarId
  name: string
  description: string
  provisional: true
}

export interface Engine {
  id: EngineId
  name: string
  description: string
}

export interface JourneyStage {
  id: JourneyStageId
  name: string
  description: string
  order: number
}

export interface Practice {
  id: string
  number: number
  title: string
  system: PracticeSystem
  area: string
  source: string
  summary: string
  pillarIds: PillarId[]
  engineIds: EngineId[]
}

export type EngagementStatus = 'diagnostic' | 'active' | 'paused' | 'completed'

export interface EngagementSummary {
  id: string
  name: string
  clientName: string
  status: EngagementStatus
  currentStage: JourneyStageId
  startedAt: string
  updatedAt: string
  summary: string
  progressPercent: number
  focusPillarIds: PillarId[]
}

export type MaturityLevel = 1 | 2 | 3 | 4 | 5

export interface MaturityAssessment {
  pillarId: PillarId
  level: MaturityLevel
  targetLevel: MaturityLevel
  rationale: string
  assessedAt: string
  evidenceIds: string[]
}

export type InitiativeStatus = 'planned' | 'in-progress' | 'at-risk' | 'completed'

export interface Initiative {
  id: string
  title: string
  description: string
  status: InitiativeStatus
  pillarIds: PillarId[]
  practiceIds: string[]
  owner: string
  startDate: string
  targetDate: string
  progressPercent: number
  metricIds: string[]
}

export type RitualCadence = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly'

export interface Ritual {
  id: string
  name: string
  purpose: string
  cadence: RitualCadence
  owner: string
  participantRoles: string[]
  practiceIds: string[]
  nextOccurrence?: string
  active: boolean
}

export type MetricDirection = 'increase' | 'decrease' | 'maintain'
export type MetricStatus = 'on-track' | 'attention' | 'off-track' | 'not-measured'

export interface Metric {
  id: string
  name: string
  unit: string
  currentValue: number
  baselineValue: number
  targetValue: number
  direction: MetricDirection
  status: MetricStatus
  period: string
  pillarId: PillarId
  practiceIds: string[]
}

export type EvidenceType = 'interview' | 'document' | 'observation' | 'metric' | 'workshop'

export interface Evidence {
  id: string
  title: string
  type: EvidenceType
  capturedAt: string
  summary: string
  sourceLabel: string
  pillarIds: PillarId[]
  practiceIds: string[]
  confidence: 'low' | 'medium' | 'high'
}

export interface Engagement extends EngagementSummary {
  maturity: MaturityAssessment[]
  initiatives: Initiative[]
  rituals: Ritual[]
  metrics: Metric[]
  evidence: Evidence[]
}

export interface MethodologyStats {
  totalPractices: number
  bySystem: Record<PracticeSystem, number>
  byPillar: Record<PillarId, number>
  byEngine: Record<EngineId, number>
  byArea: Record<string, number>
}

export type TemplateFamily = 'planning' | 'facilitation' | 'analysis' | 'people' | 'fieldwork'

export interface TemplateSection {
  title: string
  body?: string
  items?: string[]
}

export interface Template {
  id: string
  number: number
  title: string
  family: TemplateFamily
  source: string
  status: 'draft' | 'ready'
  summary: string
  howTo: string
  fields?: string[]
  sections?: TemplateSection[]
  journeyStageIds: JourneyStageId[]
  pillarIds: PillarId[]
}
