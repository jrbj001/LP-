export function FooterLight() {
  return (
    <footer className="border-t border-neutral-100 bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <p className="text-[15px] font-semibold text-neutral-900 mb-1">PixelPulseLab</p>
            <p className="text-[13px] text-neutral-400">Estúdio de produto digital · São Paulo, BR</p>
          </div>
          <div className="flex gap-8 text-[13px] text-neutral-400">
            <a href="https://www.linkedin.com/company/pixelpulselab" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 transition-colors">LinkedIn</a>
            <a href="https://github.com/pixelpulselab" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 transition-colors">GitHub</a>
            <a href="mailto:ze@pixelpulselab.dev" className="hover:text-neutral-900 transition-colors">E-mail</a>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-neutral-100">
          <p className="text-[12px] text-neutral-300">&copy; {new Date().getFullYear()} PixelPulseLab.dev</p>
        </div>
      </div>
    </footer>
  )
}
