interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class ServerMemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlSeconds: number = 60): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  invalidate(keyPrefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(keyPrefix)) {
        this.cache.delete(key);
      }
    }
    for (const key of this.pendingPromises.keys()) {
      if (key.startsWith(keyPrefix)) {
        this.pendingPromises.delete(key);
      }
    }
  }

  private pendingPromises = new Map<string, Promise<any>>();

  async getOrSet<T>(key: string, fetchFn: () => Promise<T>, ttlSeconds: number = 60): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const pending = this.pendingPromises.get(key);
    if (pending) {
      return pending as Promise<T>;
    }

    const promise = (async () => {
      try {
        const data = await fetchFn();
        if (data !== undefined && data !== null) {
          this.set(key, data, ttlSeconds);
        }
        return data;
      } finally {
        this.pendingPromises.delete(key);
      }
    })();

    this.pendingPromises.set(key, promise);
    return promise;
  }

  clear(): void {
    this.cache.clear();
    this.pendingPromises.clear();
  }
}

export const serverCache = new ServerMemoryCache();
