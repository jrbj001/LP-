import { getOnboardingProgress } from '@/lib/adaptive/progress'
import { DashboardView } from '@/components/adaptive/dashboard-view'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  try {
    const data = await getOnboardingProgress()
    const assessmentDone = data.assessments.length
    const sessionBooked = data.counts.sessionBooked
    return <DashboardView counts={{ assessmentDone, sessionBooked }} />
  } catch {
    return <DashboardView />
  }
}
