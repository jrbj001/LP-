import { getOnboardingProgress } from '@/lib/adaptive/progress'
import { OnboardingDashboard } from './onboarding-dashboard'

export const dynamic = 'force-dynamic'

export default async function OnboardingPage() {
  try {
    const data = await getOnboardingProgress()
    return <OnboardingDashboard rows={data.rows} counts={data.counts} />
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro ao carregar progresso'
    return (
      <OnboardingDashboard
        rows={[]}
        counts={{ total: 0, identified: 0, assessmentDone: 0, sessionBooked: 0 }}
        error={message}
      />
    )
  }
}
