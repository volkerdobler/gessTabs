type EvictReason = 'size' | 'expired' | 'deleted';

export interface LRUOptions<K, V> {
  ttlMs?: number;
  onEvict?: (key: K, value: V, reason: EvictReason) => void;
}

export class LRUCache<K, V> {
  private map = new Map<K, { value: V; ts: number }>();

  constructor(
    private maxSize: number,
    private options: LRUOptions<K, V> = {}
  ) {}

  get(key: K): V | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    const now = Date.now();
    if (this.options.ttlMs && now - entry.ts > this.options.ttlMs) {
      this.map.delete(key);
      this.options.onEvict?.(key, entry.value, 'expired');
      return undefined;
    }
    // refresh recency
    this.map.delete(key);
    this.map.set(key, { value: entry.value, ts: entry.ts });
    return entry.value;
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, { value, ts: Date.now() });
    while (this.map.size > this.maxSize) {
      const oldest = this.map.keys().next().value as K;
      const ev = this.map.get(oldest)!;
      this.map.delete(oldest);
      this.options.onEvict?.(oldest, ev.value, 'size');
    }
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: K): boolean {
    const it = this.map.get(key);
    const res = this.map.delete(key);
    if (res && it) this.options.onEvict?.(key, it.value, 'deleted');
    return res;
  }

  clear(): void {
    this.map.clear();
  }

  get size(): number {
    return this.map.size;
  }
}

// Shared cache for file lists (promise values)
export const fileListCache = new LRUCache<string, Promise<string[]>>(100, {
  ttlMs: 5 * 60 * 1000,
});
