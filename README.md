# Nix Process Serving

A licensed process server, skip tracer, court-filing service, and Oklahoma
Notary Public serving Southern Oklahoma.

## What's in this repo

- **`index.html`** — a static, self-contained build of *The Oklahoma Docket*
  design (editorial legal identity: DM Serif Display + Manrope, red/brass/ink
  palette). Fonts and the logo are inlined, so this one file is all you need
  to host the site. This is what's meant to go live on GitHub Pages.
- **`client/`, `server/`, `drizzle/`, `shared/`, etc.** — the original
  full-stack app source (React + Vite + tRPC + Drizzle) the design was built
  from. It includes a working contact-form backend (email via Resend), an
  image storage proxy, and auth scaffolding, but it needs a real Node.js host
  with environment secrets configured — **GitHub Pages cannot run it**, since
  Pages only serves static files.

## Hosting `index.html` on GitHub Pages

1. In this repo, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
3. Pick the `main` branch and `/ (root)` folder, then save.
4. The site publishes at `https://<username>.github.io/nix-process-serving/`.

## Differences from the full app

`index.html` is a static port of the design, adapted so it needs no backend:

- The **service request form** submits via a pre-filled `mailto:` link
  instead of the tRPC + Resend email API (which needs a server).
- The **hero background photo, route/map photo, and notary photo** —
  originally stored through the app's private image-storage proxy — are
  replaced with graphic/gradient panels in the same palette, since those
  original images aren't available outside the app's backend. Send over the
  actual photos and they can be dropped in.
- All navigation, the mobile menu, scroll-reveal animations, and the sticky
  mobile call button are reimplemented in plain JavaScript (no React/build
  step required).

## Content notes

- Hours: **Always Open** (24/7 availability for urgent service).
- Pricing: not listed on the page — calls to action point to phone/email for
  a quote.
- Contact: 580-775-3467 &middot; rickynix3467@gmail.com &middot; Lehigh, Oklahoma
  &middot; [Facebook](https://www.facebook.com/profile.php?id=61550316252986)
