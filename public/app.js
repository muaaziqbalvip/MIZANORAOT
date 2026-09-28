(function () {
  var $ = function (id) { return document.getElementById(id); };
  var q = $('q'), err = $('err'), res = $('result'), current = '';
  function show(d) {
    current = location.origin + '/?trackingId=' + encodeURIComponent(d.trackingId);
    $('fr').src = d.url; $('ext').href = d.url;
    res.style.display = 'block'; res.style.animation = 'none'; void res.offsetWidth; res.style.animation = 'rise .7s ease both';
    $('wshare').href = 'https://wa.me/?text=' + encodeURIComponent('Mera Mizanora order track karein: ' + current);
    res.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function track(v) {
    v = (v || '').trim(); err.textContent = '';
    if (!v) { err.textContent = 'Pehle ID likhen.'; return; }
    $('go').disabled = true;
    fetch('/api/track?q=' + encodeURIComponent(v))
      .then(function (r) { return r.json(); })
      .then(function (d) { if (d.ok) show(d); else err.textContent = d.error || 'Kuch masla hua.'; })
      .catch(function () { err.textContent = 'Internet check karen aur dobara try karen.'; })
      .then(function () { $('go').disabled = false; });
  }
  $('go').onclick = function () { track(q.value); };
  q.addEventListener('keydown', function (e) { if (e.key === 'Enter') track(q.value); });
  $('copy').onclick = function () {
    if (navigator.share) { navigator.share({ title: 'Mizanora Tracking', url: current }).catch(function () {}); return; }
    navigator.clipboard.writeText(current).then(function () { $('copy').textContent = 'Link copy ho gaya ✓'; });
  };
  var p = new URLSearchParams(location.search).get('trackingId') || (location.pathname.match(/^\/track\/(.+)$/) || [])[1];
  if (p) { q.value = decodeURIComponent(p); track(q.value); }
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(function () {});
})();
