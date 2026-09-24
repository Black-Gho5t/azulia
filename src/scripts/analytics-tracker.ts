// src/scripts/analytics-tracker.ts
/**
 * Lightweight real-time visitor presence & weekly visit tracker
 * Privacy-friendly: uses anonymous session ID in sessionStorage, no personal data.
 */
(() => {
  if (typeof window === 'undefined') return;

  // Don't track admin pages as external customer visits
  if (window.location.pathname.startsWith('/admin')) return;

  let sid = sessionStorage.getItem('azulia_sid');
  if (!sid) {
    sid = 'v_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now().toString(36);
    sessionStorage.setItem('azulia_sid', sid);
  }

  const today = new Date().toISOString().split('T')[0];
  const lastVisitDate = localStorage.getItem('azulia_last_visit_date');
  const isNewDailyVisit = lastVisitDate !== today;

  const sendHeartbeat = () => {
    try {
      const isFirstOfSession = !sessionStorage.getItem('azulia_visit_logged');
      const payload = JSON.stringify({
        sessionId: sid,
        path: window.location.pathname,
        isNewVisit: isNewDailyVisit && isFirstOfSession,
      });

      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon('/api/analytics/heartbeat', blob);
      } else {
        fetch('/api/analytics/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }

      if (isFirstOfSession) {
        sessionStorage.setItem('azulia_visit_logged', '1');
        localStorage.setItem('azulia_last_visit_date', today);
      }
    } catch {}
  };

  // Immediate ping on load
  sendHeartbeat();

  // Heartbeat every 45s while page is visible
  setInterval(() => {
    if (document.visibilityState === 'visible') {
      sendHeartbeat();
    }
  }, 45000);

  // Resume ping when tab becomes active again
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      sendHeartbeat();
    }
  });
})();
