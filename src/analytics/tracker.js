// ============================================================
// ECG Analytics — lightweight, consent-aware event tracking.
// Records real visitor behavior (sessions, views, cart, checkout,
// purchases) into localStorage for the admin analytics dashboard.
// Designed to later mirror events to GA4 / Meta Pixel / Stripe.
// ============================================================

const EVENTS_KEY = 'ecg-analytics-events';
const SESSION_KEY = 'ecg-session';
const SESSION_TTL = 30 * 60 * 1000; // 30 minutes of inactivity = new session
const MAX_EVENTS = 5000; // ring buffer — drop oldest beyond this

const isBot = () =>
  /bot|crawler|spider|crawling|headless|lighthouse|pagespeed/i.test(navigator.userAgent);

// Never record analytics for admin/dashboard traffic — visitor metrics only.
const isAdminRoute = () => location.pathname.startsWith('/admin');

export const hasConsent = () => localStorage.getItem('ecg-cookie-consent') === 'accepted';

const readEvents = () => {
  try { return JSON.parse(localStorage.getItem(EVENTS_KEY)) || []; } catch { return []; }
};

// One-time hygiene: drop any admin-route events recorded before the guard existed.
try {
  const stored = JSON.parse(localStorage.getItem(EVENTS_KEY));
  if (Array.isArray(stored) && stored.some(e => typeof e.page === 'string' && e.page.startsWith('/admin'))) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(stored.filter(e => !(typeof e.page === 'string' && e.page.startsWith('/admin')))));
  }
} catch { /* ignore */ }

const writeEvents = (events) => {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch {
    // Storage full — trim to the most recent 1000 and retry once
    try {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(-1000)));
    } catch { /* give up silently */ }
  }
};

// ---------- Session management ----------

const detectReferrer = () => {
  const ref = document.referrer;
  if (!ref) return 'direct';
  try {
    const host = new URL(ref).hostname;
    const here = location.hostname;
    if (host === here) return 'direct'; // internal navigation
    if (/google\./.test(host)) return 'google';
    if (/bing\./.test(host)) return 'bing';
    if (/facebook\.|instagram\.|fb\./.test(host)) return 'facebook/instagram';
    if (/twitter\.|x\.com|t\.co/.test(host)) return 'twitter/x';
    if (/tiktok\./.test(host)) return 'tiktok';
    if (/pinterest\./.test(host)) return 'pinterest';
    if (/youtube\./.test(host)) return 'youtube';
    if (/whatsapp\.|wa\.me/.test(host)) return 'whatsapp';
    return host.replace(/^www\./, '');
  } catch {
    return 'direct';
  }
};

export const detectDevice = () => {
  const ua = navigator.userAgent;
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return 'tablet';
  if (/Mobi|iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua)) return 'mobile';
  return 'desktop';
};

export const getSession = () => {
  try {
    const raw = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    if (raw && Date.now() - raw.lastSeen < SESSION_TTL) return raw;
  } catch { /* new session */ }
  const session = {
    id: `S-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    startedAt: new Date().toISOString(),
    lastSeen: Date.now(),
    device: detectDevice(),
    referrer: detectReferrer(),
    landingPage: location.pathname,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

const touchSession = () => {
  const s = getSession();
  s.lastSeen = Date.now();
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
  return s;
};

// ---------- Event recording ----------

/**
 * Record an analytics event.
 * @param {string} type   page_view | product_view | add_to_cart | view_cart |
 *                        begin_checkout | checkout_shipping | checkout_payment |
 *                        purchase | search
 * @param {object} data   optional payload (productId, value, items, etc.)
 */
export const track = (type, data = {}) => {
  if (isBot()) return;
  if (isAdminRoute()) return; // admin browsing is not visitor data
  // Track purchases regardless of consent (the order itself is the record);
  // everything else respects the cookie choice.
  if (type !== 'purchase' && !hasConsent()) return;

  const session = touchSession();
  const event = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    sessionId: session.id,
    page: location.pathname,
    device: session.device,
    referrer: session.referrer,
    at: new Date().toISOString(),
    ...data,
  };
  const events = readEvents();
  events.push(event);
  writeEvents(events);
};

// ---------- Query helpers (used by the admin dashboard) ----------

export const getEvents = () => readEvents();

export const clearEvents = () => writeEvents([]);

// ---------- Stripe readiness ----------
// Mirrors events to an analytics provider when keys are configured.
// Currently a no-op placeholder — wire GA4 gtag or Meta Pixel here:
//
// export const mirrorToProviders = (event) => {
//   if (window.gtag) window.gtag('event', event.type, { value: event.value });
//   if (window.fbq) window.fbq('trackCustom', event.type, { value: event.value });
// };
