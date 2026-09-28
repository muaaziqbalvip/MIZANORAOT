// GET /api/track?q=<orderId or trackingId>
// Order ID -> Tracking ID lookup from data/orders.json, returns the live tracking URL.
const orders = require('../data/orders.json');
const BASE = 'https://main.d2mg956qmzasa1.amplifyapp.com/?trackingId=';

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const q = String((req.query && req.query.q) || '').trim().slice(0, 40);
  if (!q) return res.status(400).json({ ok: false, error: 'ID likhen.' });

  const key = q.toUpperCase();
  let trackingId = orders[key] || null;
  let orderId = orders[key] ? key : null;
  if (!trackingId && /^\d{8,20}$/.test(q)) {
    trackingId = q;
    orderId = Object.keys(orders).find((k) => orders[k] === q) || null;
  }
  if (!trackingId) return res.status(404).json({ ok: false, error: 'ID nahi mili. Tracking ID ya sahi Order ID likhen.' });

  // TODO (optional): call the courier API here using process.env keys for native status.
  res.status(200).json({ ok: true, orderId, trackingId, url: BASE + encodeURIComponent(trackingId) });
};
