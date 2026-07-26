# Find a Dealer – Sahyadri

A mobile-first dealer locator built with **Next.js** and **TypeScript**. Users can search dealers using a 6-digit pincode or their current location, view nearby dealers sorted by distance, and quickly contact them via Call, WhatsApp, or Google Maps.

## Features

- Mobile-first responsive design
- Search dealers by 6-digit pincode
- Device location using the Browser Geolocation API
- Distance calculation using the Haversine formula
- Dealers sorted by nearest distance
- Quick actions:
  - 📞 Call
  - 💬 WhatsApp
  - 📍 Google Maps Directions
- Static JSON dataset containing 20 sample dealers
- Optimized for fast loading and slow network connections

---

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- Browser Geolocation API
- next/font/google

---

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

To create a production build:

```bash
npm run build
npm start
```

---

## Project Structure

```
app/
components/
data/
lib/
public/
```

---

## Technical Decisions

- Static Site Generation for fast initial page loads.
- Static JSON data used for the provided sample dataset.
- Browser Geolocation API for nearby dealer search.
- Haversine formula for distance calculations.
- Google Maps URL handoff instead of embedding a map SDK to keep the bundle lightweight.
- Self-hosted Google Fonts using `next/font`.

---

## Future Improvements

For a production deployment, the following improvements would be recommended:

- Replace the static JSON dataset with a database-backed API.
- Integrate a proper pincode geocoding service.
- Add caching and CDN support.
- Implement analytics and monitoring.
- Add multilingual support (Marathi and Hindi).
- Improve accessibility and automated testing.

---

## License

Created as part of a technical assessment for Sahyadri.
