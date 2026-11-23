type Entry<T> = { value: T; expiresAt: number }

/** Cache em memória do processo, com expiração e limite de entradas (descarta as mais antigas). */
export class TtlCache<T> {
  private store = new Map<string, Entry<T>>()

  constructor(
    private ttlMs: number,
    private maxEntries: number
  ) {}

  get(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (entry.expiresAt < Date.now()) {
      this.store.delete(key)
      return undefined
    }
    return entry.value
  }

  set(key: string, value: T): void {
    this.store.delete(key)
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs })
    while (this.store.size > this.maxEntries) {
      const oldest = this.store.keys().next().value
      if (oldest === undefined) break
      this.store.delete(oldest)
    }
  }
}
