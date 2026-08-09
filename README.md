# Nix Process Serving

A licensed process server, skip tracer, court-filing service, and Oklahoma
Notary Public serving Southern Oklahoma.

**Live now:** [nixprocessserving.com](https://nixprocessserving.com) — the
static site (`index.html`), hosted on GitHub Pages.

## What's in this repo

- **`index.html`** — a static, self-contained build of *The Oklahoma Docket*
  design (editorial legal identity: DM Serif Display + Manrope, red/brass/ink
  palette, real photos, motion polish). Fonts, photos, and the logo are all
  inlined, so this one file is the entire deployable site. This is what's
  live on GitHub Pages.
- **`client/`, `server/`, `drizzle/`, `shared/`, etc.** — the original
  full-stack app source (React + Vite + tRPC + Drizzle) the design was built
  from. Not used by the live site — kept for reference. It has its own
  Resend-backed contact form, but running it means real Node hosting (see
  `render.yaml` if that's ever wanted again); the live site uses Formspree
  instead (below), so GitHub Pages alone is enough.

## Hosting on GitHub Pages

Already set up. Settings → Pages → Deploy from a branch → `main` / `root`.

## The contact form: Formspree

The static page can't run a server, so the service-request form submits via
[Formspree](https://formspree.io) instead of a custom backend — it POSTs
directly to Formspree's API by JavaScript `fetch()`, shows the same inline
"thank you" message on success, and Formspree emails the submission to
`rickynix3467@gmail.com`.

- Endpoint is set in `index.html`'s script as `FORMSPREE_ENDPOINT`
  (currently `https://formspree.io/f/xyegkoaw`).
- To change where submissions go, or to see submission history/spam
  filtering, log into the Formspree account that owns that form.
- A hidden `website` field acts as a honeypot — if it's filled in (a bot
  will do this, a human won't see it), the submit is silently dropped
  client-side before it ever reaches Formspree.

## Content notes

- Hours: **Always Open** (24/7 availability for urgent service).
- Pricing: not listed on the page — calls to action point to phone/email for
  a quote.
- Contact: 580-775-3467 &middot; rickynix3467@gmail.com &middot; Lehigh, Oklahoma
  &middot; [Facebook](https://www.facebook.com/profile.php?id=61550316252986)
