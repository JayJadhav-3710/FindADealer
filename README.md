# Find a Dealer (Sahyadri)

Mobile-first Next.js page for locating Sahyadri agri-input dealers by **pincode** or **device location**. Results show distance and three tap actions: Call, WhatsApp, and Directions.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm start
```

## What you get

- Static list of 20 sample dealers from `data/dealers.json`
- Pincode search (exact pin, then 3-digit postal prefix fallback)
- “Use my location” via the browser Geolocation API
- Haversine distance sorting (dealers without coordinates, e.g. D019, sort last)
- Deep links for `tel:`, WhatsApp (`wa.me`), and Google Maps directions

## Decisions

| Choice | Why |
|--------|-----|
| Static JSON at build time | 20 rows need no API; first paint stays small on slow links |
| No embedded map SDK | Directions via URL handoff; avoids hundreds of KB and API keys |
| Pincode origin from dataset centroids | Demo works offline without a geocoding key; good enough for this Nashik-cluster sample |
| Client island only for search/geo | Shell and dealer payload are SSG; GPS and input need the browser |
| Self-hosted fonts (`next/font`) | Fraunces + Source Sans 3 without third-party CSS round-trips |
| Inline SVG icons | No icon pack in the client bundle |

## Production hardening

If this shipped for real field users, harden next:

1. **Pincode geocoding** — India Post / paid geocoder with server-side cache; do not rely only on dealer centroids.
2. **Data QA** — reject or flag missing lat/lng; sync from CMS/ERP instead of checked-in JSON.
3. **Phone hygiene** — validate E.164; WhatsApp Business links + UTM/click tracking.
4. **Privacy** — clear geolocation consent copy; never send raw GPS to a third party without need.
5. **Security** — CSP, CDN caching headers; rate-limit any geocode endpoint; never trust client coords for privileged actions.
6. **Accessibility** — audit focus order, contrast, `aria-live` result counts (already started), `prefers-reduced-motion`.
7. **i18n** — Marathi/Hindi UI strings for agri users.
8. **Observability** — funnel metrics (pincode vs GPS, call vs WhatsApp vs directions).

## Project layout

```
app/                 # layout + Find a Dealer page (SSG)
components/          # DealerFinder (client), DealerResult
data/dealers.json    # sample dealers
lib/                 # geo, phone, types
```
