// A/B Testing Framework
// - Cookie-based variant assignment (sticky per visitor for 30 days)
// - Multiple experiments, each with weighted variants
// - Event tracking via fetch (non-blocking)
// - Auto-runs once per page

(function() {
  'use strict';

  const COOKIE_NAME = 'wa_ar_ab';
  const COOKIE_DAYS = 30;
  const ENDPOINT = '/api/wautoreply/ab';

  // ============ EXPERIMENT CONFIG ============
  // Add new experiments here. Each: { id, variants: [{name, weight, content}] }
  // weight is integer (sum not required to be 100 — uses relative ratio)

  const EXPERIMENTS = {
    'hero-headline': {
      variants: [
        { name: 'A', weight: 50, content: {
          h1: 'Balas Chat WA Otomatis 24/7 — Tanpa Koding',
          sub: 'Auto-reply pintar untuk UMKM. Setup 5 menit, langsung jalan. Coba gratis 7 hari.'
        }},
        { name: 'B', weight: 50, content: {
          h1: 'Stop Kehilangan Orderan Karena Telat Balas Chat',
          sub: 'Bot WA AutoReply bales semua pesan masuk dalam 5 detik. Kamu tinggal fokus produksi.'
        }}
      ]
    },
    'cta-text': {
      variants: [
        { name: 'A', weight: 50, content: {
          primary: '🎁 Coba Gratis 7 Hari',
          secondary: '💬 Tanya via WhatsApp'
        }},
        { name: 'B', weight: 50, content: {
          primary: '🚀 Setup Bot Saya Sekarang',
          secondary: '📞 Konsultasi Gratis Dulu'
        }}
      ]
    },
    'pricing-anchor': {
      variants: [
        { name: 'A', weight: 50, content: {
          price_old: 'Rp 500.000',
          price_now: 'Rp 299.000',
          period: '/bulan'
        }},
        { name: 'B', weight: 50, content: {
          price_old: 'Rp 350.000',
          price_now: 'Rp 199.000',
          period: '/bulan (early bird)'
        }}
      ]
    }
  };

  // ============ COOKIE HELPERS ============
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) {
        try { return decodeURIComponent(c.substring(nameEQ.length)); } catch(e) { return null; }
      }
    }
    return null;
  }

  // ============ VARIANT ASSIGNMENT ============
  function weightedPick(variants) {
    const totalWeight = variants.reduce((s, v) => s + v.weight, 0);
    let r = Math.random() * totalWeight;
    for (let i = 0; i < variants.length; i++) {
      r -= variants[i].weight;
      if (r <= 0) return variants[i];
    }
    return variants[variants.length - 1];
  }

  function getAssignments() {
    let cookie = getCookie(COOKIE_NAME);
    if (cookie) {
      try {
        return JSON.parse(cookie);
      } catch(e) {}
    }
    // Assign new
    const assignments = {};
    Object.keys(EXPERIMENTS).forEach(expId => {
      const exp = EXPERIMENTS[expId];
      const variant = weightedPick(exp.variants);
      assignments[expId] = variant.name;
    });
    setCookie(COOKIE_NAME, JSON.stringify(assignments), COOKIE_DAYS);
    return assignments;
  }

  // ============ APPLY VARIANTS ============
  function applyContent(content, prefix) {
    Object.keys(content).forEach(key => {
      const selector = prefix ? `[data-ab="${prefix}-${key}"]` : `[data-ab="${key}"]`;
      const els = document.querySelectorAll(selector);
      els.forEach(el => {
        // Only replace text content, preserve inner structure if data-ab-html
        if (el.hasAttribute('data-ab-html')) {
          el.innerHTML = content[key];
        } else {
          el.textContent = content[key];
        }
      });
    });
  }

  function applyVariant(expId, variantName) {
    const exp = EXPERIMENTS[expId];
    if (!exp) return;
    const variant = exp.variants.find(v => v.name === variantName);
    if (!variant) return;
    applyContent(variant.content, expId);
  }

  // ============ TRACK EVENT ============
  function trackEvent(eventType, expId, variantName, meta) {
    // Non-blocking fetch
    try {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventType,
          experiment: expId || null,
          variant: variantName || null,
          meta: meta || {},
          ts: Date.now(),
          url: location.pathname,
          referrer: document.referrer || null
        }),
        keepalive: true
      }).catch(() => {}); // Silent fail
    } catch(e) {}
  }

  // ============ PUBLIC API ============
  window.ABTest = {
    getAssignments: getAssignments,
    applyVariant: applyVariant,
    track: trackEvent,
    trackConversion: function(expId, value) {
      const assignments = getAssignments();
      const variant = assignments[expId];
      trackEvent('conversion', expId, variant, { value: value || 1 });
    },
    trackPageview: function() {
      const assignments = getAssignments();
      Object.keys(EXPERIMENTS).forEach(expId => {
        trackEvent('pageview', expId, assignments[expId]);
      });
    }
  };

  // ============ AUTO-RUN ============
  function run() {
    const assignments = getAssignments();
    Object.keys(EXPERIMENTS).forEach(expId => {
      applyVariant(expId, assignments[expId]);
    });
    // Track pageview
    trackEvent('pageview', null, null, { path: location.pathname });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  // ============ SCROLL DEPTH TRACKING ============
  let scrollMarks = new Set();
  let scrollTimer = null;
  function onScroll() {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() {
      const scrolled = window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const pct = Math.min(100, Math.round(scrolled * 100));
      [25, 50, 75, 100].forEach(mark => {
        if (pct >= mark && !scrollMarks.has(mark)) {
          scrollMarks.add(mark);
          trackEvent('scroll_depth', null, null, { percent: mark });
        }
      });
    }, 200);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ============ CTA CLICK TRACKING ============
  document.addEventListener('click', function(e) {
    const target = e.target.closest('[data-ab-cta]');
    if (target) {
      const ctaName = target.getAttribute('data-ab-cta');
      trackEvent('cta_click', null, null, { cta: ctaName, href: target.href || null });
    }
  }, true);

})();
