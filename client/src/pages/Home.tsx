/**
 * Nix Process Serving — The Oklahoma Docket design system.
 * Contemporary legal editorial: Nix red and brass details, case-file hierarchy,
 * asymmetric composition, and direct action-first language.
 */
import { useEffect, useState, type FormEvent } from "react";
import { trpc } from "@/lib/trpc";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  ClipboardList,
  Check,
  ChevronRight,
  ExternalLink,
  FileCheck2,
  LoaderCircle,
  LocateFixed,
  Mail,
  MapPin,
  Menu,
  Phone,
  Scale,
  ShieldCheck,
  Stamp,
  X,
} from "lucide-react";

const logoUrl = "/manus-storage/nix-process-serving-logo-transparent_263adc44.png";
const heroUrl = "/manus-storage/nix-hero-courthouse_2a715487.jpg";
const routeUrl = "/manus-storage/nix-route-map_190c2b0e.jpg";
const notaryUrl = "/manus-storage/nix-notary-detail_bf5b6132.jpg";
const facebookUrl = "https://www.facebook.com/profile.php?id=61550316252986";

type DesignOption = "docket" | "dispatch" | "ledger";

const designOptions: Record<
  DesignOption,
  { number: string; name: string; description: string; eyebrow: string; label: string }
> = {
  docket: {
    number: "01",
    name: "The Oklahoma Docket",
    description: "Editorial and assured — the selected direction.",
    eyebrow: "Southern Oklahoma legal services",
    label: "The Oklahoma Docket",
  },
  dispatch: {
    number: "02",
    name: "The Redline Dispatch",
    description: "Bolder, faster, and built around decisive movement.",
    eyebrow: "Fast document movement, locally handled",
    label: "The Redline Dispatch",
  },
  ledger: {
    number: "03",
    name: "The Notary Ledger",
    description: "Refined, formal, and document-forward.",
    eyebrow: "Professional service with a personal standard",
    label: "The Notary Ledger",
  },
};

const services = [
  {
    number: "01",
    title: "Service of Process",
    text: "Summons, complaints, subpoenas, writs, and more served with careful attention to the details.",
    Icon: FileCheck2,
  },
  {
    number: "02",
    title: "Skip Tracing",
    text: "Help locating hard-to-find individuals when a current address is difficult to pin down.",
    Icon: LocateFixed,
  },
  {
    number: "03",
    title: "Court Filings",
    text: "Timely, accurate filing support to keep your legal documents moving forward.",
    Icon: Building2,
  },
  {
    number: "04",
    title: "Notary Services",
    text: "Professional notary services are also available for your document needs.",
    Icon: Stamp,
  },
];

function ContactLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "flex flex-wrap items-center gap-4" : "flex flex-col gap-3 sm:flex-row"}>
      <a className="button-primary" href="tel:+15807753467">
        <Phone size={17} strokeWidth={2.25} />
        Call 580-775-3467
      </a>
      <a className="button-secondary" href="mailto:rickynix3467@gmail.com">
        <Mail size={17} strokeWidth={2.1} />
        Send an Email
      </a>
    </div>
  );
}

export default function Home() {
  const [design, setDesign] = useState<DesignOption>(() => {
    const requestedDirection = new URLSearchParams(window.location.search).get("direction");
    return requestedDirection === "dispatch" || requestedDirection === "ledger" ? requestedDirection : "docket";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [showStickyCall, setShowStickyCall] = useState(false);
  const chosenDesign = designOptions[design];
  const submitRequest = trpc.contact.submit.useMutation({
    onSuccess: () => setFormStatus("Thank you — your request has been sent to Nix Process Serving. We’ll be in touch soon."),
    onError: () => setFormStatus("We could not send your request. Please call Nix Process Serving at 580-775-3467."),
  });
  const isSubmitting = submitRequest.isPending;

  useEffect(() => {
    const updateStickyCall = () => setShowStickyCall(window.scrollY > 520);
    updateStickyCall();
    window.addEventListener("scroll", updateStickyCall, { passive: true });
    return () => window.removeEventListener("scroll", updateStickyCall);
  }, []);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => target.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -32px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  function handleRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const service = String(formData.get("service") ?? "Service request");
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const location = String(formData.get("location") ?? "");
    const details = String(formData.get("details") ?? "");
    setFormStatus("Sending your request securely…");
    submitRequest.mutate(
      { name, email, phone, service: service as "Service of Process" | "Skip Tracing" | "Court Filings" | "Notary Services" | "Other / Not sure", location, details, website: String(formData.get("website") ?? "") },
      { onSuccess: () => form.reset() },
    );
  }

  return (
    <div className={`site-shell theme-${design}`}>
      <header className="topbar">
        <div className="topbar-inner">
          <a href="#top" className="brand" aria-label="Nix Process Serving home">
            <img src={logoUrl} alt="Nix Process Serving" className="brand-logo" />
            <span className="brand-route">SO-OK / FIELD DESK</span>
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#coverage">Coverage</a>
            <a href="#contact">Contact</a>
          </nav>
          <a className="topbar-call" href="tel:+15807753467">
            <Phone size={15} fill="currentColor" /> <span>580-775-3467</span>
          </a>
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#coverage" onClick={() => setMenuOpen(false)}>Coverage</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
        )}
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-image" style={{ backgroundImage: `url(${heroUrl})` }} aria-hidden="true" />
          <div className="hero-wash" aria-hidden="true" />
          <div className="hero-content">
            <div className="docket-label hero-label">
              <span className="label-rule" />
              {chosenDesign.eyebrow}
            </div>
            <h1 id="hero-heading">
              Documents in motion.<br />
              <em>Confidence intact.</em>
            </h1>
            <p className="hero-summary">
              Fast, reliable, and professional process serving for Southern Oklahoma — so you can keep moving forward with confidence.
            </p>
            <ContactLinks />
            <div className="hero-assurance" aria-label="Company qualifications">
              <span><ShieldCheck size={16} /> Bonded</span>
              <span><BadgeCheck size={16} /> Insured</span>
              <span><MapPin size={16} /> Locally owned</span>
            </div>
          </div>
          <div className="hero-docket" aria-label="Nix Process Serving case reference">
            <span>Case route</span>
            <strong>NPS / 001</strong>
            <div className="docket-line" />
            <span>Southern Oklahoma</span>
          </div>
        </section>

        <section className="proof-strip" data-reveal aria-label="Nix Process Serving commitments">
          <div><span className="proof-count">01</span><strong>Fast</strong><span>On time, every time.</span></div>
          <div><span className="proof-count">02</span><strong>Reliable</strong><span>You can count on us.</span></div>
          <div><span className="proof-count">03</span><strong>Professional</strong><span>Courteous, dependable, discreet.</span></div>
        </section>

        <section className="intro-section" id="services" aria-labelledby="services-heading">
          <div className="section-rail">
            <div className="docket-label"><span className="label-rule" /> Route / 001</div>
            <p className="rail-number">001</p>
          </div>
          <div className="intro-copy" data-reveal>
            <h2 id="services-heading">Every document deserves a clear route forward.</h2>
            <p>
              From a first service attempt to a court filing or notary appointment, Nix Process Serving offers practical support built around precision and care.
            </p>
          </div>
          <div className="service-list" data-reveal>
            {services.map(({ number, title, text, Icon }) => (
              <article className="service-row" key={title}>
                <span className="service-number">{number}</span>
                <div className="service-icon"><Icon size={24} strokeWidth={1.65} /></div>
                <div className="service-copy"><h3>{title}</h3><p>{text}</p></div>
                <a href="#contact" className="service-arrow" aria-label={`Contact Nix Process Serving about ${title}`}><ArrowUpRight size={20} /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="route-section" id="coverage" aria-labelledby="coverage-heading">
          <div className="route-visual" data-reveal>
            <img src={routeUrl} alt="Legal documents, map, and location marker representing Southern Oklahoma coverage" />
            <div className="visual-tab"><MapPin size={17} /> Service territory</div>
          </div>
          <div className="route-copy" data-reveal>
            <div className="docket-label"><span className="label-rule" /> Route / 002 — Local coverage</div>
            <h2 id="coverage-heading">Proudly serving all of Southern Oklahoma.</h2>
            <p>
              Based in Lehigh, Oklahoma, Nix Process Serving brings local familiarity and professional follow-through to each request.
            </p>
            <div className="territory-card" aria-label="Southern Oklahoma service territory">
              <svg className="territory-outline" viewBox="0 0 230 120" aria-hidden="true">
                <path d="M7 43h39V31h178v50h-15v19H56V81H7z" />
                <circle cx="137" cy="63" r="3.5" />
                <path className="territory-pin" d="M137 42c-9 0-16 6-16 15 0 11 16 25 16 25s16-14 16-25c0-9-7-15-16-15zm0 21a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" />
              </svg>
              <div className="territory-copy"><span className="territory-code">Territory / SO-OK</span><strong>Southern Oklahoma</strong><span>Local service. Clear communication.</span></div>
            </div>
            <span className="route-reference"><Scale size={14} /> Route reference / NPS-SOK</span>
            <a className="text-link" href="tel:+15807753467">Discuss a service request <ChevronRight size={18} /></a>
          </div>
        </section>

        <section className="service-area-section" aria-labelledby="service-area-heading">
          <div className="area-intro" data-reveal>
            <div className="docket-label"><span className="label-rule" /> Route / 003 — Coverage docket</div>
            <h2 id="service-area-heading">One dependable point of contact for Southern Oklahoma.</h2>
            <p>
              Nix Process Serving is based in Lehigh and serves legal-document needs throughout Southern Oklahoma. Share the service location when you call, email, or submit a request so availability can be confirmed promptly.
            </p>
            <a href="#contact" className="text-link">Request coverage confirmation <ChevronRight size={18} /></a>
            <div className="area-progress" aria-label="Service request progression">
              <span>Request</span><i /><span>Route</span><i /><span>Confirm</span>
            </div>
          </div>
          <div className="area-docket" data-reveal aria-label="Southern Oklahoma service-area details">
            <div className="area-card">
              <span className="area-number">A1</span>
              <MapPin size={25} strokeWidth={1.55} />
              <strong>Southern Oklahoma</strong>
              <p>Primary service territory for process service, skip tracing, court filings, and notary requests.</p>
            </div>
            <div className="area-card">
              <span className="area-number">A2</span>
              <Building2 size={25} strokeWidth={1.55} />
              <strong>Lehigh base</strong>
              <p>A locally owned provider based in Lehigh, Oklahoma, with practical familiarity across the region.</p>
            </div>
            <div className="area-card area-card-highlight">
              <span className="area-number">A3</span>
              <Phone size={25} strokeWidth={1.55} />
              <strong>Location confirmation</strong>
              <p>Need service in a particular town or at a specific courthouse? Call or email with the location to confirm your request.</p>
            </div>
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-heading">
          <div className="about-rail">
            <div className="docket-label"><span className="label-rule" /> Owner profile</div>
            <span className="about-index">RICKY<br />NIX</span>
            <span className="about-license">Oklahoma process server<br />Licensed since 2013</span>
          </div>
          <div className="about-main" data-reveal>
            <div className="docket-label"><span className="label-rule" /> Route / 004 — About Nix</div>
            <h2 id="about-heading">A trusted extension of your legal team.</h2>
            <p className="about-lead">
              Ricky Nix is the owner of Nix Process Serving. Since becoming a licensed Process Server in the State of Oklahoma in 2013, he has served attorneys, law firms, businesses, and individuals throughout Southern Oklahoma with reliable, efficient, and professional support.
            </p>
            <div className="about-facts" aria-label="Ricky Nix professional experience">
              <div><strong>2013</strong><span>Licensed in Oklahoma</span></div>
              <div><strong>10+ years</strong><span>Process-serving experience</span></div>
              <div><strong>Thousands</strong><span>Legal documents served</span></div>
            </div>
            <p>
              Every case matters. Ricky works to complete each assignment promptly while keeping service aligned with Oklahoma laws and court requirements. From the first assignment through proof of service, clients can expect prompt communication, detailed status updates, and accurate documentation.
            </p>
            <p>
              Whether a file requires routine service or multiple attempts, it is handled with diligence, integrity, and respect for the legal process. His goal is to provide the dependable service and responsive communication legal professionals expect when trusting someone with their cases.
            </p>
          </div>
          <aside className="about-casefile" data-reveal aria-label="Ricky Nix service experience">
            <div className="casefile-heading"><FileCheck2 size={20} /><span>Casefile / Experience</span></div>
            <h3>Civil process handled with urgency and care.</h3>
            <p>
              Experience includes summonses, subpoenas, citations, small claims, divorce petitions, child custody matters, protective orders, evictions, and other civil process.
            </p>
            <div className="casefile-rule" />
            <span className="casefile-note">Also offering Oklahoma Notary Public services for affidavits and documents requiring a notarial act.</span>
          </aside>
        </section>

        <section className="notary-section" aria-labelledby="notary-heading">
          <div className="notary-copy" data-reveal>
            <div className="docket-label"><span className="label-rule" /> Route / 004 — Also available</div>
            <h2 id="notary-heading">Professional notary services, when the paperwork needs a proper finish.</h2>
            <p>Keep document support in one trusted place. Ask about notary availability when you call or email.</p>
            <span className="route-reference notary-reference"><Stamp size={14} /> Docket note / NPS-NOTARY</span>
            <a href="mailto:rickynix3467@gmail.com" className="text-link">Ask about notary services <ChevronRight size={18} /></a>
          </div>
          <div className="notary-visual" data-reveal><img src={notaryUrl} alt="Notary stamp and pen on a desk" /></div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-heading">
          <div className="contact-panel" data-reveal>
            <div className="contact-heading">
              <div className="docket-label light-label"><span className="label-rule" /> Route / 005 — Get in touch</div>
              <h2 id="contact-heading">Let’s get your documents where they need to go.</h2>
              <p>Call, email, or send the details below to start a service request.</p>
            </div>
            <ContactLinks />
            <span className="contact-reference"><FileCheck2 size={14} /> Intake desk / {chosenDesign.number} / NPS-OK</span>
            <div className="contact-details">
              <a href="mailto:rickynix3467@gmail.com"><Mail size={16} /> rickynix3467@gmail.com</a>
              <span><MapPin size={16} /> Lehigh, Oklahoma</span>
              <a href={facebookUrl} target="_blank" rel="noreferrer" aria-label="Visit Nix Process Serving on Facebook"><ExternalLink size={16} /> Follow on Facebook</a>
            </div>
          </div>
          <form className="service-request-form" data-reveal onSubmit={handleRequestSubmit}>
            <div className="form-heading">
              <span className="form-case-number">Form / 01</span>
              <ClipboardList size={20} strokeWidth={1.7} />
              <div><strong>Service request</strong><span>Send details directly to Nix Process Serving.</span></div>
            </div>
            <div className="form-grid">
              <label>
                <span>Your name</span>
                <input name="name" type="text" autoComplete="name" required placeholder="Name" />
              </label>
              <label>
                <span>Phone number</span>
                <input name="phone" type="tel" autoComplete="tel" required placeholder="(000) 000-0000" />
              </label>
              <label>
                <span>Email address</span>
                <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
              </label>
              <label>
                <span>Service needed</span>
                <select name="service" required defaultValue="">
                  <option value="" disabled>Select a service</option>
                  <option>Service of Process</option>
                  <option>Skip Tracing</option>
                  <option>Court Filings</option>
                  <option>Notary Services</option>
                  <option>Other / Not sure</option>
                </select>
              </label>
              <label className="form-span-two">
                <span>Service location</span>
                <input name="location" type="text" placeholder="City, courthouse, or service address" />
              </label>
              <label className="form-span-two">
                <span>Request details</span>
                <textarea name="details" rows={4} placeholder="Briefly describe the documents or service you need. Please do not include confidential information." />
              </label>
              <label className="form-honeypot" aria-hidden="true">
                <span>Website</span>
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <button className="form-submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? <><LoaderCircle className="submit-spinner" size={17} /> Sending Request…</> : <><Mail size={17} /> Send Service Request</>}
            </button>
            <p className="form-note">Completed requests are sent securely to Nix Process Serving. Please do not include confidential information.</p>
            {formStatus && <p className="form-status" role="status"><Check size={15} /> {formStatus}</p>}
          </form>
          <div className="contact-mark" aria-hidden="true">
            <span>NIX</span><span>PROCESS SERVING</span>
          </div>
        </section>
      </main>

      <a className={`mobile-sticky-call ${showStickyCall ? "is-visible" : ""}`} href="tel:+15807753467" aria-label="Call Nix Process Serving at 580-775-3467">
        <Phone size={18} fill="currentColor" />
        <span>Call Now</span>
        <strong>580-775-3467</strong>
      </a>

      <footer className="site-footer">
        <div className="footer-brand"><img src={logoUrl} alt="Nix Process Serving" /><span>Southern Oklahoma<br />Field service</span></div>
        <p>Serving legal documents with precision &amp; care.</p>
        <a className="footer-facebook" href={facebookUrl} target="_blank" rel="noreferrer">Facebook <ExternalLink size={13} /></a>
        <span>© {new Date().getFullYear()} Nix Process Serving</span>
      </footer>
    </div>
  );
}
