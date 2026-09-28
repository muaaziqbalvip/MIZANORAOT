# Mizanora Order Tracking

Vercel par chalne wali static site + serverless API. Koi build step nahi.

## Structure
- `public/` – website (index.html, style.css, app.js, PWA manifest, SEO files)
- `api/track.js` – Order ID / Tracking ID lookup, tracking link wapas deta hai
- `data/orders.json` – Order ID -> Tracking ID list (yahan naye orders add karein)

## Deploy (GitHub + Vercel)
1. GitHub par naya repo banayen, is folder ki files upload/push karein.
2. vercel.com > Add New > Project > apna repo chunen > **Deploy** (settings default rehne dein).
3. Deploy ke baad `public/index.html`, `robots.txt`, `sitemap.xml` mein `mizanora.vercel.app` ko apne asli domain se badal dein.

## Naya order add karna
`data/orders.json` mein line add karein, phir GitHub par commit karein. Vercel khud update kar dega.
Customer link: `https://your-domain/?trackingId=29044514302191`

## Mobile app (PWA)
Phone ke browser mein site kholen > "Add to Home Screen". App ki tarah khulegi.
Play Store/App Store app chahiye ho to PWA ko Capacitor ya PWABuilder se wrap kiya ja sakta hai.

## Note
Live status Markaz ke tracking page se iframe mein aata hai. Agar Markaz iframe block kare
to "Nayi tab mein kholen" button kaam karta hai.
