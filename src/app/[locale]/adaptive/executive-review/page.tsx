import { getOnboardingProgress } from '@/lib/adaptive/progress'
import { ExecutiveReviewView } from '@/components/adaptive/executive-review-view'

export const dynamic = 'force-dynamic'

export default async function ExecutiveReviewPage() {
  try {
    const data = await getOnboardingProgress()
    const assessmentCount = data.assessments.length
    return (
      <ExecutiveReviewView
        progressRows={data.rows}
        assessmentCount={assessmentCount}
      />
    )
  } catch {
    return <ExecutiveReviewView />
  }
}
