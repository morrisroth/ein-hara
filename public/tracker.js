(function () {
  const KEY = 'ein_hara_sid';
  let sid = sessionStorage.getItem(KEY);
  if (!sid) {
    sid = Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
    sessionStorage.setItem(KEY, sid);
  }
  window._sid = sid;
  window._currentScreen = 'loading';

  function post(url, body) {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(function () {});
  }

  window.track = function (type, data) {
    post('/api/track', Object.assign({ type: type, sessionId: sid }, data || {}));
  };

  window.heartbeat = function (screen) {
    window._currentScreen = screen || 'unknown';
    post('/api/heartbeat', { sessionId: sid, screen: window._currentScreen });
  };

  window.submitBooking = function (form) {
    var pkg = (window.PACKAGES || []).find(function (p) { return p.id === form.pkgId; }) || {};
    post('/api/submit', {
      sessionId: sid,
      pkgId: form.pkgId,
      pkgName: pkg.tier || form.pkgId,
      price: pkg.price || 0,
      names: form.names,
      phone: form.phone,
      email: form.email,
      concerns: form.concerns,
      asGift: form.asGift,
      payment: form.payment,
    });
  };

  // Initial pageload event
  track('pageload', { referrer: document.referrer, url: location.href });

  // Heartbeat every 30s
  setInterval(function () { heartbeat(window._currentScreen); }, 30000);
})();
