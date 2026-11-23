export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="13.5" fill="none" stroke="#F4E9D8" strokeWidth="1.6" />
      <ellipse cx="16" cy="16" rx="6" ry="13.5" fill="none" stroke="#F4E9D8" strokeOpacity="0.55" strokeWidth="1.2" />
      <path d="M2.8 12h26.4M2.8 20h26.4" stroke="#F4E9D8" strokeOpacity="0.55" strokeWidth="1.2" />
      <path d="M16 6.5l2.2 7.3L25.5 16l-7.3 2.2L16 25.5l-2.2-7.3L6.5 16l7.3-2.2z" fill="#E2704A" />
      <circle cx="16" cy="16" r="1.8" fill="#0E1A24" />
    </svg>
  )
}
