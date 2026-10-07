import { stat, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

interface CachedImage {
  buffer: Buffer;
  etag: string;
  mtimeMs: number;
  contentType: string;
  size: number;
}

// In-memory cache for hot images (capped at 80MB)
const imageMemoryCache = new Map<string, CachedImage>();
const MAX_CACHE_BYTES = 80 * 1024 * 1024;
let currentCacheBytes = 0;

export async function serveLocalImage(
  request: Request,
  filePaths: string[],
  defaultContentType: string = 'image/webp'
): Promise<Response> {
  let existingPath: string | null = null;
  for (const p of filePaths) {
    if (existsSync(p)) {
      existingPath = p;
      break;
    }
  }

  if (!existingPath) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const fileStat = await stat(existingPath);
    const etag = `W/"${fileStat.mtimeMs.toString(36)}-${fileStat.size.toString(36)}"`;

    // 1. Conditional 304 Not Modified check
    const clientEtag = request.headers.get('if-none-match');
    if (clientEtag && clientEtag === etag) {
      return new Response(null, {
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 2. Check in-memory cache
    const cached = imageMemoryCache.get(existingPath);
    if (cached && cached.mtimeMs === fileStat.mtimeMs) {
      return new Response(cached.buffer, {
        status: 200,
        headers: {
          'Content-Type': cached.contentType,
          'Content-Length': cached.size.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
          'ETag': etag,
          'Accept-Ranges': 'bytes',
          'X-Cache': 'HIT',
        },
      });
    }

    // 3. Read from disk
    const buffer = await readFile(existingPath);
    const contentType = existingPath.endsWith('.png')
      ? 'image/png'
      : existingPath.endsWith('.jpg') || existingPath.endsWith('.jpeg')
      ? 'image/jpeg'
      : defaultContentType;

    // Prune cache if exceeded
    if (currentCacheBytes + buffer.length > MAX_CACHE_BYTES) {
      const keys = Array.from(imageMemoryCache.keys());
      for (let i = 0; i < Math.min(keys.length, 10); i++) {
        const k = keys[i];
        const item = imageMemoryCache.get(k);
        if (item) {
          currentCacheBytes -= item.size;
          imageMemoryCache.delete(k);
        }
      }
    }

    imageMemoryCache.set(existingPath, {
      buffer,
      etag,
      mtimeMs: fileStat.mtimeMs,
      contentType,
      size: buffer.length,
    });
    currentCacheBytes += buffer.length;

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'ETag': etag,
        'Accept-Ranges': 'bytes',
        'X-Cache': 'MISS',
      },
    });
  } catch (err: any) {
    console.error('[serveLocalImage error]', err);
    return new Response('Error loading image', { status: 500 });
  }
}

export function invalidateImageCache(filePath: string): void {
  const item = imageMemoryCache.get(filePath);
  if (item) {
    currentCacheBytes -= item.size;
    imageMemoryCache.delete(filePath);
  }
}
