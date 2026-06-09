export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-black">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <p className="text-lg font-semibold text-text-primary mb-3">
              PixelPulseLab.dev
            </p>
            <p className="text-sm text-text-muted font-mono tracking-wide uppercase mb-6">
              Adaptive cognition, delivered as code.
            </p>
            <p className="text-sm text-text-muted leading-relaxed max-w-md">
              PixelPulseLab is an AI Product &amp; Infrastructure Company
              building adaptive intelligence systems and intelligence platforms
              for real-world operations. We combine software engineering,
              artificial intelligence and operational expertise to create
              systems that learn, adapt and scale.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-2">
              Links
            </p>
            <a
              href="https://www.linkedin.com/company/pixelpulselab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/pixelpulselab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              GitHub
            </a>
            <a
              href="mailto:ze@pixelpulselab.dev"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} PixelPulseLab.dev
          </p>
        </div>
      </div>
    </footer>
  )
}
