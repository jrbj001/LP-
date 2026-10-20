import { STORY, type IrisLocale, type StoryScene } from '@/lib/iris/data'

export function Storyboard({ locale, label }: { locale: IrisLocale; label: string }) {
  const frames = STORY[locale]
  return (
    <section aria-label={label} className="mt-10">
      <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--iris-wood)]">{label}</h2>
      <ol className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {frames.map((frame, index) => (
          <li key={frame.scene} className="overflow-hidden rounded-2xl border border-[var(--iris-line)] bg-[var(--iris-card)]">
            <Frame scene={frame.scene} />
            <div className="space-y-1 px-3.5 pb-4 pt-3">
              <p className="text-sm font-semibold">
                <span className="mr-1.5 font-mono text-[11px] text-[var(--iris-wood)]">0{index + 1}</span>
                {frame.title}
              </p>
              <p className="text-xs leading-relaxed text-[var(--iris-muted)]">{frame.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Frame({ scene }: { scene: StoryScene }) {
  return (
    <svg viewBox="0 0 160 112" className="h-28 w-full bg-[#efeae2]" aria-hidden>
      <path d="M46 96c0-28 14-46 34-46s34 18 34 46" fill="#f7f4ef" stroke="#1d2421" strokeWidth="1.4" />
      <path d="M58 96c0-18 9-30 22-30s22 12 22 30" fill="none" stroke="#b88c5f" strokeWidth="1.2" />
      {scene === 'arrive' && <circle cx="122" cy="42" r="4.5" fill="none" stroke="#b7b1a6" strokeWidth="1.6" />}
      {scene === 'lock' && (
        <>
          <circle cx="122" cy="42" r="4.5" fill="#b42318" />
          <path d="M74 78h12" stroke="#1d2421" strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}
      {scene === 'choose' && (
        <>
          <rect x="69" y="64" width="22" height="14" rx="2" fill="#1d2421" />
          <path d="M58 62c5 5 5 12 0 17M102 62c-5 5-5 12 0 17" fill="none" stroke="#3d6656" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
      {scene === 'leave' && (
        <>
          <circle cx="122" cy="42" r="4.5" fill="none" stroke="#b7b1a6" strokeWidth="1.6" />
          <path d="M108 70c8-10 16-10 24 0M112 80c5-6 11-6 16 0" fill="none" stroke="#3d6656" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      <path d="M38 96h84" stroke="#1d2421" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
