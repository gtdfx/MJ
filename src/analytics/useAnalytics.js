import { useMemo } from 'react';
import { getEvents } from '../analytics/tracker';

/**
 * Shopify-style analytics computed from real tracked events.
 * Funnel: sessions → product views → add to cart → checkout initiated → purchased
 */
export default function useAnalytics(days = 30) {
  return useMemo(() => {
    const events = getEvents();
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const recent = events.filter(e => new Date(e.at).getTime() >= cutoff);

    // ---- Sessions ----
    const sessionMap = new Map();
    recent.forEach(e => {
      if (!sessionMap.has(e.sessionId)) {
        sessionMap.set(e.sessionId, { id: e.sessionId, device: e.device, referrer: e.referrer, startedAt: e.at, events: [] });
      }
      sessionMap.get(e.sessionId).events.push(e);
    });
    const sessions = [...sessionMap.values()];
    sessions.sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt));

    // ---- Funnel ----
    const productViews = recent.filter(e => e.type === 'product_view');
    const addToCarts = recent.filter(e => e.type === 'add_to_cart');
    const viewCarts = recent.filter(e => e.type === 'view_cart');
    const checkoutsInitiated = recent.filter(e => e.type === 'begin_checkout');
    const purchases = recent.filter(e => e.type === 'purchase');

    // Unique sessions per funnel step
    const uniqSessions = list => new Set(list.map(e => e.sessionId)).size;

    const funnel = {
      sessions: sessions.length,
      productViews: productViews.length,
      addToCarts: addToCarts.length,
      viewCarts: viewCarts.length,
      checkoutsInitiated: uniqSessions(checkoutsInitiated),
      purchases: uniqSessions(purchases),
      // Rates
      viewToCartRate: productViews.length ? (uniqSessions(addToCarts) / uniqSessions(productViews)) * 100 : 0,
      cartToCheckoutRate: uniqSessions(addToCarts) ? (uniqSessions(checkoutsInitiated) / uniqSessions(addToCarts)) * 100 : 0,
      checkoutToPurchaseRate: uniqSessions(checkoutsInitiated) ? (uniqSessions(purchases) / uniqSessions(checkoutsInitiated)) * 100 : 0,
    };

    // ---- Revenue & AOV (from purchase events) ----
    const revenue = purchases.reduce((s, e) => s + (e.value || 0), 0);
    const purchaseCount = purchases.length;
    const aov = purchaseCount ? revenue / purchaseCount : 0;

    // ---- Cart abandonment (Shopify metric: checkouts initiated but not purchased) ----
    const checkoutSessions = new Set(checkoutsInitiated.map(e => e.sessionId));
    const purchasedSessions = new Set(purchases.map(e => e.sessionId));
    const abandonedSessions = [...checkoutSessions].filter(s => !purchasedSessions.has(s));
    const abandonmentRate = checkoutSessions.size ? (abandonedSessions.length / checkoutSessions.size) * 100 : 0;

    // Abandoned cart value (items noted at begin_checkout for non-converting sessions)
    const abandonedValue = checkoutsInitiated
      .filter(e => checkoutSessions.has(e.sessionId) && !purchasedSessions.has(e.sessionId))
      .reduce((s, e) => s + (e.value || 0), 0);

    // ---- Traffic sources ----
    const sourceMap = new Map();
    sessions.forEach(s => {
      if (!sourceMap.has(s.referrer)) {
        sourceMap.set(s.referrer, { source: s.referrer, sessions: 0, purchases: 0, revenue: 0 });
      }
      const entry = sourceMap.get(s.referrer);
      entry.sessions += 1;
      const sessionPurchase = purchases.find(p => p.sessionId === s.id);
      if (sessionPurchase) {
        entry.purchases += 1;
        entry.revenue += sessionPurchase.value || 0;
      }
    });
    const sources = [...sourceMap.values()].sort((a, b) => b.sessions - a.sessions);

    // ---- Devices ----
    const deviceMap = new Map();
    sessions.forEach(s => {
      deviceMap.set(s.device, (deviceMap.get(s.device) || 0) + 1);
    });
    const devices = [...deviceMap.entries()]
      .map(([device, sessions]) => ({ device, sessions }))
      .sort((a, b) => b.sessions - a.sessions);

    // ---- Top viewed products ----
    const productViewCounts = new Map();
    productViews.forEach(e => {
      const key = e.productId;
      if (!productViewCounts.has(key)) {
        productViewCounts.set(key, { productId: key, name: e.productName, views: 0, addToCarts: 0, purchases: 0 });
      }
      productViewCounts.get(key).views += 1;
    });
    addToCarts.forEach(e => {
      if (productViewCounts.has(e.productId)) productViewCounts.get(e.productId).addToCarts += 1;
      else productViewCounts.set(e.productId, { productId: e.productId, name: e.productName, views: 0, addToCarts: 1, purchases: 0 });
    });
    purchases.forEach(e => {
      // itemsDetail is the array of { productId, qty } recorded at purchase time
      (Array.isArray(e.itemsDetail) ? e.itemsDetail : []).forEach(item => {
        if (productViewCounts.has(item.productId)) productViewCounts.get(item.productId).purchases += item.qty || 1;
      });
    });
    const topProducts = [...productViewCounts.values()]
      .sort((a, b) => b.views - a.views)
      .slice(0, 6);

    // ---- Daily series (for charts) ----
    const daily = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayEvents = recent.filter(e => e.at.startsWith(key));
      daily.push({
        date: key,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sessions: new Set(dayEvents.map(e => e.sessionId)).size,
        productViews: dayEvents.filter(e => e.type === 'product_view').length,
        addToCarts: dayEvents.filter(e => e.type === 'add_to_cart').length,
        checkouts: dayEvents.filter(e => e.type === 'begin_checkout').length,
        orders: dayEvents.filter(e => e.type === 'purchase').length,
        revenue: dayEvents.filter(e => e.type === 'purchase').reduce((s, e) => s + (e.value || 0), 0),
      });
    }

    // ---- Live activity (recent events, newest first) ----
    const recentActivity = [...recent].reverse().slice(0, 50);

    return {
      funnel, revenue, aov, purchaseCount,
      abandonmentRate, abandonedValue, abandonedCount: abandonedSessions.length,
      sources, devices, topProducts, daily, recentActivity,
      totalEvents: recent.length,
    };
  }, [days]);
}
