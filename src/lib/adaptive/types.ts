export type ProgressStatus =
  | 'Not started'
  | 'Identified'
  | 'Assessment done'
  | 'Session booked'
  | 'Done'

export type SessionStatus = 'Available' | 'Booked' | 'Completed' | 'Cancelled'

export interface OnboardIdentity {
  clientId: string
  stakeholder: string
  whatsapp: string
  areas?: string
  role?: string
}

export interface AssessmentPayload extends OnboardIdentity {
  answers: Record<number, string>
  questions: { id: number; question: string }[]
}

export interface BookPayload extends OnboardIdentity {
  sessionId: string
}

export interface SessionSlot {
  id: string
  start: string // ISO
  end: string   // ISO
  status: SessionStatus
  stakeholder?: string
  host: string
  location: string
}

export interface AssessmentRow {
  id: string
  url: string
  name: string
  client: string
  stakeholder: string
  whatsapp: string
  status: string
  completedAt: string
  answers: Record<number, string>
}

export interface ProgressRow {
  id: string
  name: string
  client: string
  stakeholder: string
  areas: string
  role: string
  whatsapp: string
  status: ProgressStatus
  facilitator: string
  meetingHost: string
  slot: string
}
