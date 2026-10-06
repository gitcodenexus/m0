# MO Landing

Next.js (App Router, TypeScript, Tailwind CSS) landing page: animated logo loading screen, then a "CLICK HERE" link to https://www.m0.org/.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Configure

Copy `.env.example` to `.env.local`. No secrets are needed.

- `NEXT_PUBLIC_CTA_URL` – destination of the link (default `https://www.m0.org/`)
- `NEXT_PUBLIC_LOAD_MS` – simulated loading time in ms (default `3800`)

## Structure

- `app/` – layout (loads the Unbounded font via `next/font`), page, global styles, icon
- `components/landing.tsx` – loading sequence, logo fill, tilt, link
- `components/particle-field.tsx` – animated canvas background
- `lib/constants.ts` – link URL, timing, status messages
- `public/logo.jpg` – logo asset
