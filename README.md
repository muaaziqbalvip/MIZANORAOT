# Mizanora Order Tracking — Pro

Vercel par chalne wali static site + serverless API. Koi build step nahi.

## Naya kya hai (Pro upgrade)
- **Har tracking ID format allowed**: sirf-numbers (local couriers) aur letters+numbers (China/international, jaise `LP00123456CN`) dono chalte hain.
- **Animated parcel journey**: route bar, moving truck/plane icon, stage dots (Booked → Warehouse → Customs → In Transit → Out for Delivery → Delivered) — international ID par Customs stage khud shamil ho jata hai.
- **Detailed timeline**: har stage ki tareekh aur short description, staggered slide-in animation.
- **Status card**: current stage, estimated delivery date, local/international badge.
- **WhatsApp**: floating button + "WhatsApp par bhejein" (03062015326), pre-filled message.
- **Share**: native share sheet ya link copy.
- **PWA**: Add to Home Screen se mobile app jaisa chalta hai.
- **SEO**: meta tags, Open Graph, structured data, sitemap, robots.

## Zaroori baat (honest note)
Journey/timeline ka data hamare apne andaze (deterministic hash) se banaya gaya hai — asal courier
status **Live Tracking** wale iframe mein neeche dikhta hai (Markaz ke system se). Agar aapko journey
bhi 100% asal courier data se chahiye, to us courier ki API chahiye hogi (server-side call `api/track.js`
mein add ki ja sakti hai) — filhal Markaz ka page cross-origin hone ki wajah se JS us se status "parh"
nahi sakta, sirf iframe mein dikha sakta hai.

## Structure
- `public/` – website (index.html, style.css, app.js, PWA manifest, SEO files)
- `api/track.js` – Order ID / Tracking ID lookup (har format allow), tracking link deta hai
- `data/orders.json` – Order ID -> Tracking ID list

## Deploy (GitHub + Vercel)
1. GitHub par naya repo banayen, is folder ki files push karein.
2. vercel.com > Add New > Project > apna repo chunen > **Deploy** (settings default).
3. Deploy ke baad `index.html`, `robots.txt`, `sitemap.xml` mein `mizanora.vercel.app` ko apne asli domain se badal dein.

## Naya order add karna
`data/orders.json` mein `"ORDER-ID": "TRACKING-ID"` add karein, GitHub par commit karein.

## Mobile app (PWA)
Phone browser mein site kholen → "Add to Home Screen".
