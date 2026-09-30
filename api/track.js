// GET /api/track?q=<orderId or trackingId>
// Order ID -> Tracking ID lookup from data/orders.json.
// Accepts ANY tracking ID format (numeric, alphanumeric, with dashes/dots) —
// e.g. local couriers (digits only) as well as international/China parcels
// (e.g. "LP00123456CN", "RA123456789PK", "CN-2024-88213").
const orders = require('../data/orders.json');
const BASE = 'https://main.d2mg956qmzasa1.amplifyapp.com/?trackingId=';

// No length limit — letters/numbers/dashes/dots/underscore/slash, any length.
const ID_RE = /^[A-Za-z0-9._/-]+$/;

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const raw = String((req.query && req.query.q) || '').trim();
  const q = raw;
  if (!q) return res.status(400).json({ ok: false, error: 'ID likhen.' });

  const key = q.toUpperCase();
  let trackingId = orders[key] || null;
  let orderId = orders[key] ? key : null;

  if (!trackingId) {
    if (ID_RE.test(q)) {
      trackingId = q; // any courier format allowed: local, China, international
      orderId = Object.keys(orders).find((k) => orders[k] === q) || null;
    } else {
      return res.status(404).json({ ok: false, error: 'ID format sahi nahi. Order ID ya Tracking ID dobara check karen.' });
    }
  }

  res.status(200).json({ ok: true, orderId, trackingId, url: BASE + encodeURIComponent(trackingId) });
};
