import { NextResponse } from 'next/server';

/* Live status for the publicly reachable homelab services. Pings each
   host server-side (so there are no CORS issues) and reports up/down.
   Kept lightweight: HEAD-ish GET with a short timeout, any non-5xx
   response counts as reachable. Cached briefly at the edge. */

export const dynamic = 'force-dynamic';

const HOSTS = [
  'photos.chiambucket.com',
  'share.chiambucket.com',
  'drop.chiambucket.com',
  'clips.chiambucket.com',
  'speedtest.chiambucket.com',
];

async function ping(host: string): Promise<'up' | 'down'> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4500);
  try {
    const res = await fetch(`https://${host}/`, {
      method: 'GET',
      signal: ctrl.signal,
      redirect: 'follow',
      cache: 'no-store',
      headers: { 'user-agent': 'chiambucket-status/1.0' },
    });
    // Any response below 500 means the proxy + service answered.
    return res.status < 500 ? 'up' : 'down';
  } catch {
    return 'down';
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const results = await Promise.all(
    HOSTS.map(async (h) => [h, await ping(h)] as const),
  );
  return NextResponse.json(
    { checkedAt: new Date().toISOString(), services: Object.fromEntries(results) },
    { headers: { 'Cache-Control': 'public, max-age=30, s-maxage=30' } },
  );
}
