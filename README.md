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
  live on GitHub Pages right now.
- **`client/`, `server/`, `drizzle/`, `shared/`, etc.** — the original
  full-stack app source (React + Vite + tRPC + Drizzle) the design was built
  from. It includes a **working** contact-form backend (real email via
  Resend), an image storage proxy, and auth scaffolding. GitHub Pages can't
  run it — it needs a real Node.js host. See "Deploying the real app" below.
- **`render.yaml`** — a Render Blueprint that deploys the full app as a
  single Node web service.

## Option A — what's live: `index.html` on GitHub Pages

Already set up. Settings → Pages → Deploy from a branch → `main` / `root`.
The contact form on this version submits via a `mailto:` link (opens the
visitor's email app pre-filled) since there's no server behind Pages.

## Option B — deploy the real app (working Resend-backed form)

The full app boots fine with **no database** — the contact form's Resend
email route doesn't touch it, and the DB connection is lazy/optional. All
you actually need is Node hosting + a Resend API key.

1. **Get a Resend API key** at [resend.com](https://resend.com). For a quick
   test before verifying your own domain, you can send from
   `onboarding@resend.dev` — no domain setup required. For production, verify
   `nixprocessserving.com` (or a subdomain) in Resend and send from an
   address on it.
2. **Deploy to [Render](https://render.com):**
   - New → Blueprint → connect this repo. Render reads `render.yaml`
     automatically and creates the web service.
   - When prompted, set the two secret env vars:
     - `RESEND_API_KEY` — from step 1
     - `RESEND_FROM_EMAIL` — e.g. `onboarding@resend.dev` to start, or your
       verified address later
   - Deploy. Render builds with `pnpm` and runs `pnpm start`.
3. **Point the domain at Render** (replaces the GitHub Pages DNS — you can't
   run both on the same domain at once):
   - In Render, add `nixprocessserving.com` as a custom domain on the
     service; Render will show you the exact DNS records to use (usually a
     CNAME, or an A record + `www` CNAME).
   - Update those records at your registrar, replacing the GitHub Pages `A`
     records currently there.
4. The service now serves the same design *and* a contact form that emails
   you for real — no visitor email client required.

To go back to the static/GitHub Pages version later, just restore the DNS
records listed in "Option A."

## Content notes

- Hours: **Always Open** (24/7 availability for urgent service).
- Pricing: not listed on the page — calls to action point to phone/email for
  a quote.
- Contact: 580-775-3467 &middot; rickynix3467@gmail.com &middot; Lehigh, Oklahoma
  &middot; [Facebook](https://www.facebook.com/profile.php?id=61550316252986)
