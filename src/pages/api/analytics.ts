import type { APIRoute } from 'astro';
import { getAdminDb, verifyAdminRequest } from '../../lib/firebase-admin';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const db = getAdminDb();
    const now = Date.now();
    // A user is considered actively viewing simultaneously if seen within the last 90 seconds
    const activeThreshold = now - 90 * 1000;

    // 1. Get simultaneous active visitors
    const presenceSnap = await db
      .collection('site_presence')
      .where('lastSeen', '>=', activeThreshold)
      .get();
    
    // There is always at least 1 person viewing (the currently logged-in admin or visitor)
    const activeUsers = Math.max(presenceSnap.docs.length, 1);

    // Clean up stale presence docs older than 30 minutes in the background
    const staleThreshold = now - 30 * 60 * 1000;
    db.collection('site_presence')
      .where('lastSeen', '<', staleThreshold)
      .limit(50)
      .get()
      .then((staleSnap) => {
        const batch = db.batch();
        staleSnap.docs.forEach((doc) => batch.delete(doc.ref));
        return batch.commit();
      })
      .catch(() => {});

    // 2. Calculate rolling 7 days date strings
    const past7Days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      past7Days.push(d.toISOString().split('T')[0]);
    }

    const visitsSnap = await db.collection('site_daily_visits').get();
    let weeklyVisits = 0;
    const dailyBreakdown: Record<string, number> = {};

    visitsSnap.docs.forEach((doc) => {
      const id = doc.id;
      if (past7Days.includes(id)) {
        const count = Number(doc.data().count) || 0;
        weeklyVisits += count;
        dailyBreakdown[id] = count;
      }
    });

    // If new database or no visits recorded yet this week, guarantee today's entry
    if (weeklyVisits === 0) {
      const today = past7Days[0];
      await db.collection('site_daily_visits').doc(today).set({
        date: today,
        count: 1,
        lastUpdated: now,
      }, { merge: true });
      weeklyVisits = 1;
      dailyBreakdown[today] = 1;
    }

    return new Response(
      JSON.stringify({
        ok: true,
        activeUsers,
        weeklyVisits,
        dailyBreakdown,
        period: '7_days',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[api/analytics GET]', err);
    return new Response(
      JSON.stringify({ ok: false, error: err.message, activeUsers: 1, weeklyVisits: 1 }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
