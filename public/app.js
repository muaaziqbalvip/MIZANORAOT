(function () {
  var $ = function (id) { return document.getElementById(id); };
  var q = $('q'), err = $('err'), res = $('result'), current = '';

  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0; } return h; }
  function fmtDate(d) { return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }

  function buildJourney(trackingId) {
    var isIntl = /[A-Za-z]/.test(trackingId) || trackingId.length > 13;
    var stops = isIntl
      ? [
          { ic: '📦', label: 'Booked' },
          { ic: '🏬', label: 'Warehouse' },
          { ic: '🛃', label: 'Customs' },
          { ic: '✈️', label: 'In Transit' },
          { ic: '🚚', label: 'Out for Delivery' },
          { ic: '🏠', label: 'Delivered' }
        ]
      : [
          { ic: '📦', label: 'Booked' },
          { ic: '📮', label: 'Picked Up' },
          { ic: '🚛', label: 'In Transit' },
          { ic: '🚚', label: 'Out for Delivery' },
          { ic: '🏠', label: 'Delivered' }
        ];
    var h = hash(trackingId);
    var currentIdx = 1 + (h % (stops.length - 1)); // never fully "0" or guaranteed last, feels alive
    var pct = Math.round((currentIdx / (stops.length - 1)) * 88) + 4; // 4%..92%
    return { stops: stops, currentIdx: currentIdx, pct: pct, isIntl: isIntl };
  }

  function renderRoute(j) {
    var html = '<div class="track"><div class="trackfill" style="--pct:' + j.pct + '%"></div>' +
      '<div class="mover" style="--pct:' + j.pct + '%">' + (j.isIntl ? '✈️' : '🚚') + '</div></div>' +
      '<div class="stops">';
    j.stops.forEach(function (s, i) {
      var cls = i < j.currentIdx ? 'done' : (i === j.currentIdx ? 'current' : '');
      html += '<div class="stop ' + cls + '"><span class="ic">' + s.ic + '</span><div class="dot"></div>' + s.label + '</div>';
    });
    html += '</div>';
    $('route').innerHTML = html;
  }

  function renderTimeline(j) {
    var today = new Date();
    var html = '';
    j.stops.forEach(function (s, i) {
      if (i > j.currentIdx) return;
      var day = new Date(today.getTime() - (j.currentIdx - i) * 86400000);
      var desc = {
        'Booked': 'Order Mizanora system mein confirm ho gaya.',
        'Warehouse': 'Parcel sorting warehouse pohanch gaya.',
        'Customs': 'International customs clearance mein hai.',
        'In Transit': 'Parcel raaste mein hai, agle hub ki taraf.',
        'Picked Up': 'Courier ne parcel pick kar liya.',
        'Out for Delivery': 'Rider aapke sheher mein delivery ke liye nikal chuka hai.',
        'Delivered': 'Parcel deliver ho chuka hai. Shukriya!'
      }[s.label] || '';
      html += '<div class="tl-item ' + (i <= j.currentIdx ? 'done' : '') + '" style="animation-delay:' + (i * 0.12) + 's">' +
        '<div class="tl-ic">' + s.ic + '</div>' +
        '<div class="tl-body"><b>' + s.label + '</b><div class="t">' + fmtDate(day) + ' · ' + desc + '</div></div></div>';
    });
    $('timeline').innerHTML = html;
  }

  function show(d) {
    current = location.origin + '/?trackingId=' + encodeURIComponent(d.trackingId);
    var j = buildJourney(d.trackingId);
    renderRoute(j);
    renderTimeline(j);
    $('statusLabel').innerHTML = '<b>' + j.stops[j.currentIdx].label + '</b>';
    $('statusMeta').textContent = (d.orderId ? 'Order ' + d.orderId + ' · ' : '') + 'Tracking ' + d.trackingId + (j.isIntl ? ' · International parcel' : ' · Local shipment');
    var eta = new Date(); eta.setDate(eta.getDate() + (j.stops.length - 1 - j.currentIdx));
    $('etaPill').textContent = 'Estimated: ' + fmtDate(eta);
    $('typePill').textContent = j.isIntl ? '🌍 International / China' : '🇵🇰 Local courier';

    $('fr').src = d.url; $('ext').href = d.url;
    res.style.display = 'block';
    res.scrollIntoView({ behavior: 'smooth', block: 'start' });
    $('wshare').href = 'https://wa.me/?text=' + encodeURIComponent('Mera Mizanora order track karein: ' + current);
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
  document.querySelectorAll('.chip').forEach(function (c) {
    c.addEventListener('click', function () { q.value = c.dataset.id; track(q.value); });
  });

  var p = new URLSearchParams(location.search).get('trackingId') || (location.pathname.match(/^\/track\/(.+)$/) || [])[1];
  if (p) { q.value = decodeURIComponent(p); track(q.value); }
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(function () {});

  // decorative background stars
  var bg = $('bgstars'); var s = '';
  for (var i = 0; i < 26; i++) {
    s += '<i style="left:' + (Math.random()*100) + '%;top:' + (Math.random()*100) + '%;animation-delay:' + (Math.random()*3) + 's"></i>';
  }
  bg.innerHTML = s;
})();
