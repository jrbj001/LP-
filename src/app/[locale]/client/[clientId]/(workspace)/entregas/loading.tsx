const SHIMMER = 'animate-pulse bg-neutral-100 rounded'

function Block({ className }: { className: string }) {
  return <div className={`${SHIMMER} ${className}`} />
}

export default function Loading() {
  return (
    <div className="w-full pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-20" aria-busy>
      <header className="border-b-2 border-neutral-900 pb-5 mb-8 sm:mb-10 flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
        <div className="min-w-0 space-y-2">
          <Block className="h-3 w-24" />
          <Block className="h-7 w-64" />
        </div>
        <Block className="h-10 w-56" />
      </header>

      <div className="mb-8 sm:mb-10">
        <div className="flex flex-wrap items-center gap-1.5">
          {[30, 60, 90].map(d => (
            <Block key={d} className="h-8 w-20 rounded-full" />
          ))}
        </div>
        <p className="text-[12px] text-neutral-400 mt-3 flex items-center gap-2">
          <span className="inline-block w-3 h-3 border-[1.5px] border-current border-t-transparent rounded-full animate-spin" />
          Consultando GitHub e recalculando o período…
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-px bg-black/[0.08] border border-black/[0.08] rounded-lg overflow-hidden mb-8">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-white px-3 py-5 flex flex-col items-center gap-2">
            <Block className="h-5 w-12" />
            <Block className="h-2 w-14" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-10">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-black/[0.06] bg-white px-4 py-4 space-y-2">
            <Block className="h-6 w-16" />
            <Block className="h-3 w-20" />
            <Block className="h-2 w-24" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Block className="h-56 rounded-xl" />
        <Block className="h-56 rounded-xl" />
        <Block className="h-40 rounded-xl lg:col-span-2" />
      </div>
    </div>
  )
}
