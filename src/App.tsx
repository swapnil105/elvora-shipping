import { useEffect, useState, lazy, Suspense } from "react";
import { useReveal } from "./hooks/useReveal";
const NetworkMap = lazy(() => import("./components/NetworkMap"));
import LogoBadge from "./components/LogoBadge";
import logo from "./imports/LOGO_BLUE.png";

function palette(i: number) {
  const colors = ["var(--primary)", "var(--teal)", "var(--sand)", "var(--sky)", "var(--coral)", "var(--accent)"];
  return colors[i % colors.length];
}

const EMAIL = "sales@elvorashipping.com";
const PHONE = "+971504221950";
const PHONE_DISPLAY = "+971 50 422 1950";
const ADDRESS = "Bur Dubai, Dubai, United Arab Emirates";
const DEFAULT_GOOGLE_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbzkel15iDJkcWFtg3eHWWcFqjgplx8ziFxS3AhAR9ROzzwXAMCt_VRe3KnGHF3tGsrB/exec";
const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL || DEFAULT_GOOGLE_SHEETS_URL;

/* ----------------------------------------------------------------- Nav ---- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["Journey", "#journey"],
    ["Services", "#services"],
    ["Network", "#network"],
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      {/* announcement banner */}
      <div className="overflow-hidden bg-[#f2c53d] py-2 text-[#0a2230]">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            [
              "Now booking ocean space · Dubai ⇄ Far East · Europe · Americas",
              "احجز مساحتك البحرية الآن · دبي ⇄ الشرق الأقصى · أوروبا",
              "Freight forwarding & logistics · Dubai, U.A.E.",
              "الشحن والخدمات اللوجستية · دبي، الإمارات العربية المتحدة",
            ].map((t, i) => (
              <span key={`${k}-${i}`} className="flex items-center gap-10 font-mono text-xs tracking-[0.18em]">
                <span className={/[؀-ۿ]/.test(t) ? "ar" : ""}>{t}</span>
                <span className="text-[#0a2230]/50">◆</span>
              </span>
            )),
          )}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <a href="#top" className="flex items-center" aria-label="ELVORA Shipping Home">
          <img
            src={logo}
            alt="ELVORA Shipping L.L.C. - Freight Forwarding & Logistics Dubai"
            className="h-20 w-auto"
            width={220}
            height={80}
          />
        </a>
        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary Navigation">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm text-secondary-foreground transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#quote"
          className="group inline-flex items-center gap-2 border border-primary/60 px-5 py-2.5 text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Request a Quote
          <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  );
}

/* --------------------------------------------------------------- Hero ------ */
function HeroRoutes() {
  // decorative corridor arcs sweeping across the hero
  const arcs = [
    "M -40 340 Q 500 60 1080 260",
    "M -40 200 Q 480 420 1080 120",
    "M -40 420 Q 620 180 1080 400",
  ];
  return (
    <svg
      viewBox="0 0 1040 520"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {arcs.map((d, i) => {
        const col = i === 1 ? "var(--accent)" : "var(--primary)";
        return (
          <g key={i}>
            <path
              d={d}
              fill="none"
              stroke={col}
              strokeOpacity={0.28}
              strokeWidth={1}
              strokeDasharray="4 10"
              style={{ animation: `dash-flow ${26 + i * 4}s linear infinite` }}
            />
            <circle r={2.4} fill={col} style={{ offsetPath: `path("${d}")`, animation: `cargo-move ${12 + i * 3}s linear infinite` }} />
          </g>
        );
      })}
      <circle cx={520} cy={250} r={60} fill="none" stroke="var(--primary)" strokeOpacity={0.15} />
      <circle cx={520} cy={250} r={3} fill="var(--primary)">
        <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-end overflow-hidden">
      {/* imagery layer */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=2000&h=1200&fit=crop&auto=format"
          alt="Commercial container ship navigating deep ocean trade waters at dusk"
          fetchPriority="high"
          width={2000}
          height={1200}
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
        <div className="absolute inset-0 bg-accent/10 mix-blend-multiply" />
      </div>
      <HeroRoutes />

      {/* rotating seal */}
      <div className="animate-drift absolute right-8 top-32 z-10 hidden lg:block">
        <LogoBadge size={150} />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-44 lg:px-10">
        <p className="label mb-6">Elvora Shipping L.L.C. · Dubai, United Arab Emirates</p>
        <h1 className="font-display text-[13vw] leading-[0.92] tracking-tight sm:text-[9vw] lg:text-[7.5rem]">
          The gateway <br />
          <span className="text-accent">between worlds.</span>
        </h1>
        <p className="ar mt-4 text-2xl text-secondary-foreground sm:text-3xl">البوابة بين العالمين</p>
        <div className="mt-10 flex max-w-3xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-lg leading-relaxed text-secondary-foreground">
            From the heart of Dubai, we move freight across ocean, air and land — connecting East and West
            through one of the world&apos;s great trade crossroads.
          </p>
          <a
            href="#quote"
            className="group inline-flex shrink-0 items-center gap-3 bg-primary px-7 py-4 text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Move your cargo <span className="ar">/ اشحن الآن</span>
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Corridors ---- */
function Ticker() {
  const items = [
    "Ocean Freight — FCL / LCL",
    "Air Freight",
    "Land Transport",
    "Freight Forwarding",
    "Customs & Documentation",
    "Project Cargo",
    "Warehousing",
  ];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-border bg-muted py-5">
      <div className="marquee-track flex w-max gap-12 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12 font-mono text-sm tracking-[0.2em] text-muted-foreground">
            {t}
            <span className="text-accent" aria-hidden="true">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Journey ---- */
function Journey() {
  const stages = [
    ["01", "Origin & Booking", "Your shipment is planned, priced and booked with a single point of contact in Dubai."],
    ["02", "Port & Loading", "Cargo is consolidated, documented and loaded — FCL, LCL, air ULD or road trailer."],
    ["03", "Ocean & Transit", "Movement across trade lanes with visibility at every handover and milestone."],
    ["04", "Customs & Clearance", "Documentation, duties and compliance handled at origin and destination."],
    ["05", "Destination & Delivery", "Final-mile delivery to the door, warehouse or distribution centre."],
  ];
  return (
    <section id="journey" className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="reveal max-w-2xl">
        <p className="label mb-5">The Cargo Journey · <span className="ar">رحلة الشحنة</span></p>
        <h2 className="font-display text-4xl leading-tight sm:text-5xl">
          Every shipment is a route we have already travelled.
        </h2>
        <p className="ar mt-3 text-xl text-accent">كل شحنة هي طريق سبق أن قطعناه</p>
        <p className="mt-5 text-lg text-secondary-foreground">
          Logistics is not a set of services — it is a single continuous journey. We stay accountable from the first
          booking to the final delivery.
        </p>
      </div>

      <ol className="mt-16 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-5">
        {stages.map(([n, title, body], i) => {
          const c = palette(i);
          return (
            <li
              key={n}
              className="reveal group relative bg-card p-7 transition-colors hover:bg-secondary"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="absolute inset-x-0 top-0 h-1" style={{ background: c }} />
              <div className="mb-8 flex items-center gap-3">
                <span className="font-mono text-sm" style={{ color: c }}>
                  {n}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <h3 className="font-display text-xl">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------- Services ---- */
function Services() {
  const services = [
    {
      t: "Ocean Freight",
      ar: "الشحن البحري",
      d: "Full-container (FCL) and consolidated (LCL) sea freight across major global trade lanes.",
      img: "photo-1605745341112-85968b19335b",
      alt: "Full-container vessel carrying ocean cargo across international maritime trade routes",
    },
    {
      t: "Air Freight",
      ar: "الشحن الجوي",
      d: "Time-critical and general air cargo with reliable capacity to and from Dubai.",
      img: "photo-1436491865332-7a61a109cc05",
      alt: "Commercial cargo aircraft scheduled for international air freight transit",
    },
    {
      t: "Land Transport",
      ar: "النقل البري",
      d: "Road haulage and cross-border trucking across the GCC and regional corridors.",
      img: "photo-1601584115197-04ecc0da31d7",
      alt: "Heavy freight transport truck on regional road logistics corridor",
    },
    {
      t: "Freight Forwarding",
      ar: "التخليص والشحن",
      d: "End-to-end coordination of multimodal shipments under one accountable partner.",
      img: "photo-1578575437130-527eed3abbec",
      alt: "Intermodal shipping terminal with stacked cargo containers and gantry cranes",
    },
    {
      t: "Customs & Documentation",
      ar: "الجمارك والمستندات",
      d: "Clearance, duties and compliance handled at both origin and destination.",
      img: "photo-1568430462989-44163eb1752f",
      alt: "Maritime customs clearance documents and port compliance inspection",
    },
    {
      t: "Warehousing & Distribution",
      ar: "التخزين والتوزيع",
      d: "Storage, consolidation and distribution solutions built around your supply chain.",
      img: "photo-1553413077-190dd305871c",
      alt: "Industrial logistics warehouse facility with organized pallet storage",
    },
  ];
  return (
    <section id="services" className="border-t border-border bg-[var(--tint-teal)] py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="reveal mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="label mb-5">Capabilities · <span className="ar">خدماتنا</span></p>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">
              One partner across <br className="hidden sm:block" /> every mode of transport.
            </h2>
            <p className="ar mt-3 text-xl text-accent">شريك واحد لكل وسائل النقل</p>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Connecting Dubai to major international maritime trade lanes and cargo airports worldwide.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <article
              key={s.t}
              className="reveal group relative overflow-hidden bg-card"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="aspect-[16/10] overflow-hidden bg-secondary">
                <img
                  src={`https://images.unsplash.com/${s.img}?w=900&h=560&fit=crop&auto=format`}
                  alt={s.alt}
                  loading="lazy"
                  decoding="async"
                  width={900}
                  height={560}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: palette(i) }}
                />
              </div>
              <div className="p-7">
                <div className="mb-3 flex items-baseline justify-between">
                  <h3 className="font-display text-2xl">{s.t}</h3>
                  <span
                    className="ar text-base font-medium"
                    style={{ color: palette(i) }}
                  >
                    {s.ar}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Network ---- */
function Network() {
  return (
    <section id="network" className="bg-[var(--navy)] py-28 text-[var(--primary-foreground)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="reveal mb-14 max-w-2xl">
          <p className="label mb-5 !text-[var(--sand)]">
            Global Network · <span className="ar">شبكتنا العالمية</span>
          </p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">
            Dubai at the centre of world trade.
          </h2>
          <p className="ar mt-3 text-xl text-[var(--sky)]">دبي في قلب التجارة العالمية</p>
          <p className="mt-5 text-lg text-white/70">
            Positioned between the manufacturing East and the consuming West, Dubai lets ELVORA reach six continents
            within a single, well-connected network.
          </p>
        </div>
        <div className="reveal rounded-sm border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-8">
          <Suspense fallback={<div className="flex h-[380px] w-full items-center justify-center font-mono text-xs text-white/40"><span className="h-2 w-2 mr-2 rounded-full bg-[var(--accent)] animate-ping" />Connecting trade corridors...</div>}><NetworkMap /></Suspense>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- CTA ----- */
function parseEnquiryDetails(rawDetails: string) {
  let phone = "";
  let service = "";
  let origin = "";
  let destination = "";
  let cleanDetails = rawDetails;

  const phoneMatch = rawDetails.match(/(?:^|\n)\s*(?:Phone|Tel|Mobile|WhatsApp)\s*:\s*([^\n]+)/i);
  if (phoneMatch) phone = phoneMatch[1].trim();

  const serviceMatch = rawDetails.match(/(?:^|\n)\s*(?:Service|Mode|Freight Type)\s*:\s*([^\n]+)/i);
  if (serviceMatch) service = serviceMatch[1].trim();

  const originMatch = rawDetails.match(/(?:^|\n)\s*(?:Origin|From|POL)\s*:\s*([^\n]+)/i);
  if (originMatch) origin = originMatch[1].trim();

  const destMatch = rawDetails.match(/(?:^|\n)\s*(?:Destination|Dest|To|POD)\s*:\s*([^\n]+)/i);
  if (destMatch) destination = destMatch[1].trim();

  const detailsMatch = rawDetails.match(/(?:^|\n)\s*(?:Details|Cargo|Cargo Details|Notes)\s*:\s*([\s\S]+)$/i);
  if (detailsMatch && (phoneMatch || serviceMatch || originMatch || destMatch)) {
    cleanDetails = detailsMatch[1].trim();
  }

  return { phone, service, origin, destination, cleanDetails };
}

function Quote() {
  const [form, setForm] = useState({ name: "", company: "", email: "", details: "" });
  const [trap, setTrap] = useState(""); // honeypot — maps to website parameter
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "delivered" | "error">("idle");
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (fieldErrors[k]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[k];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) {
      errors.name = "Please enter your full name.";
    } else if (form.name.trim().length > 80) {
      errors.name = "Name must be 80 characters or less.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      errors.email = "Please enter your email address.";
    } else if (!emailRegex.test(form.email.trim())) {
      errors.email = "Please enter a valid email address (e.g. name@company.com).";
    } else if (form.email.trim().length > 120) {
      errors.email = "Email must be 120 characters or less.";
    }

    if (!form.details.trim()) {
      errors.details = "Please enter your shipment requirements (origin, destination, cargo type).";
    } else if (form.details.trim().length < 5) {
      errors.details = "Please provide more details regarding your shipment.";
    } else if (form.details.trim().length > 2000) {
      errors.details = "Details must be 2000 characters or less.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setServerError(null);

    // Honeypot spam check: simulate instant silent success for bots
    if (trap) {
      setStatus("delivered");
      setReferenceId("ELV-SPM-OK");
      return;
    }

    if (!validate()) {
      return;
    }

    setStatus("submitting");

    const { phone, service, origin, destination, cleanDetails } = parseEnquiryDetails(form.details);

    const formData = new URLSearchParams();
    formData.append("name", form.name.trim());
    formData.append("company", form.company.trim());
    formData.append("email", form.email.trim());
    formData.append("phone", phone);
    formData.append("service", service);
    formData.append("origin", origin);
    formData.append("destination", destination);
    formData.append("details", cleanDetails.trim() || form.details.trim());
    formData.append("website", trap); // Google Apps Script honeypot field

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      if (data && typeof data === "object" && data.success === true && data.referenceId) {
        setStatus("delivered");
        setReferenceId(String(data.referenceId));
      } else {
        setStatus("error");
        setServerError(
          "Unable to submit your enquiry right now. Please try again or contact sales@elvorashipping.com."
        );
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("[ELVORA Quote] Google Sheets submission error:", err);
      setStatus("error");
      setServerError(
        "Unable to submit your enquiry right now. Please try again or contact sales@elvorashipping.com."
      );
    }
  };

  const onReset = () => {
    setForm({ name: "", company: "", email: "", details: "" });
    setTrap("");
    setFieldErrors({});
    setServerError(null);
    setStatus("idle");
    setReferenceId(null);
  };

  const mailtoFallbackUrl = () => {
    const subject = encodeURIComponent(`Quote request [${referenceId || "New"}] — ${form.company || form.name || "Commercial Enquiry"}`);
    const body = encodeURIComponent(
      `ELVORA SHIPPING QUOTE ENQUIRY\nReference: ${referenceId || "Pending"}\n\nName: ${form.name}\nCompany: ${form.company || "N/A"}\nEmail: ${form.email}\n\nShipment details:\n${form.details}\n\n---\nSent via elvorashipping.com`,
    );
    return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  const field =
    "w-full border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-60";

  return (
    <section id="quote" className="relative overflow-hidden py-28">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=2000&h=1000&fit=crop&auto=format"
          alt="International maritime container ship sailing across ocean trade corridor"
          loading="lazy"
          decoding="async"
          width={2000}
          height={1000}
          className="h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:px-10">
        <div className="reveal">
          <p className="label mb-5">Talk to ELVORA · <span className="ar">تواصل معنا</span></p>
          <h2 className="font-display text-5xl leading-[0.95] sm:text-6xl">
            Request a quote.
            <br />
            We&apos;ll route the rest.
          </h2>
          <p className="ar mt-3 text-2xl text-accent">اطلب عرض سعر · وسنتكفّل بالباقي</p>
          <div className="mt-10 space-y-5 text-secondary-foreground">
            <div>
              <div className="label mb-1">Office</div>
              <div>{ADDRESS}</div>
            </div>
            <div>
              <div className="label mb-1">Phone</div>
              <a href={`tel:${PHONE}`} className="text-accent transition-colors hover:text-primary">
                {PHONE_DISPLAY}
              </a>
            </div>
            <div>
              <div className="label mb-1">Email</div>
              <a href={`mailto:${EMAIL}`} className="text-accent transition-colors hover:text-primary">
                {EMAIL}
              </a>
            </div>
            <div>
              <div className="label mb-1">Operating hours</div>
              <div>Sun–Thu · 09:00–18:00 GST <span className="text-muted-foreground">· 24/7 for active shipments</span></div>
            </div>
          </div>
        </div>

        {status === "delivered" ? (
          <div
            className="reveal flex flex-col justify-center border border-primary/50 bg-card/95 p-8 sm:p-10 backdrop-blur shadow-sm"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <div className="font-display text-2xl sm:text-3xl text-primary">Enquiry received successfully.</div>
            </div>
            <p className="ar mt-2 text-lg text-accent">تم استلام طلبك وتسجيله بنجاح</p>

            <div className="mt-6 rounded border border-border bg-muted/40 p-4 font-mono text-xs">
              <div className="text-muted-foreground uppercase tracking-wider text-[0.65rem] mb-1">Reference ID</div>
              <div className="font-bold text-foreground text-sm">Reference ID: {referenceId}</div>
            </div>

            <p className="mt-5 text-secondary-foreground leading-relaxed">
              Thank you, <span className="font-medium text-foreground">{form.name || "Valued Client"}</span>. Your enquiry
              has been received and logged directly into our operations desk in Dubai.
            </p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              A freight coordinator will review your shipment parameters and reply to{" "}
              <span className="font-medium text-foreground">{form.email || "your email"}</span> within 2–4 business hours.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center justify-center border border-primary bg-primary px-6 py-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Submit Another Enquiry
              </button>
              <a
                href={`mailto:${EMAIL}?subject=Follow-up%20on%20Quote%20Request%20${referenceId}`}
                className="inline-flex items-center justify-center border border-border px-6 py-3 text-sm text-secondary-foreground transition-colors hover:bg-muted"
              >
                Direct email follow-up
              </a>
            </div>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="reveal space-y-5 border border-border bg-card/80 p-8 backdrop-blur"
            aria-label="Request a Freight Quote Form"
          >
            {/* honeypot — hidden from real users, catches automated bots */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="quote-website">Do not fill this field</label>
              <input
                id="quote-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
              />
            </div>

            {serverError && (
              <div
                className="border border-[var(--coral)]/50 bg-[var(--coral)]/10 p-4 text-sm text-[var(--coral)]"
                role="alert"
              >
                <div className="font-semibold mb-1">Submission Notice:</div>
                <p>{serverError}</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="inline-flex items-center text-xs font-mono uppercase tracking-wider underline hover:opacity-80 disabled:opacity-50"
                  >
                    Retry Submission
                  </button>
                  <a
                    href={mailtoFallbackUrl()}
                    className="inline-flex items-center text-xs font-mono uppercase tracking-wider underline hover:opacity-80"
                  >
                    Send Direct via Email Client →
                  </a>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="quote-name" className="label mb-2 block">
                Full name <span className="text-[var(--coral)]" aria-hidden="true">*</span>
              </label>
              <input
                id="quote-name"
                name="name"
                type="text"
                required
                maxLength={80}
                autoComplete="name"
                disabled={status === "submitting"}
                value={form.name}
                onChange={set("name")}
                placeholder="Your name"
                className={`${field} ${fieldErrors.name ? "border-[var(--coral)] focus:border-[var(--coral)]" : ""}`}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "quote-name-error" : undefined}
              />
              {fieldErrors.name && (
                <p id="quote-name-error" role="alert" className="mt-1 text-xs text-[var(--coral)]">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="quote-company" className="label mb-2 block">
                Company <span className="text-xs text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                id="quote-company"
                name="company"
                type="text"
                maxLength={100}
                autoComplete="organization"
                disabled={status === "submitting"}
                value={form.company}
                onChange={set("company")}
                placeholder="Company name"
                className={field}
              />
            </div>

            <div>
              <label htmlFor="quote-email" className="label mb-2 block">
                Email <span className="text-[var(--coral)]" aria-hidden="true">*</span>
              </label>
              <input
                id="quote-email"
                name="email"
                type="email"
                required
                maxLength={120}
                autoComplete="email"
                disabled={status === "submitting"}
                value={form.email}
                onChange={set("email")}
                placeholder="you@company.com"
                className={`${field} ${fieldErrors.email ? "border-[var(--coral)] focus:border-[var(--coral)]" : ""}`}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "quote-email-error" : undefined}
              />
              {fieldErrors.email && (
                <p id="quote-email-error" role="alert" className="mt-1 text-xs text-[var(--coral)]">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="quote-details" className="label mb-2 block">
                Shipment details <span className="text-[var(--coral)]" aria-hidden="true">*</span>
              </label>
              <textarea
                id="quote-details"
                name="details"
                rows={3}
                required
                maxLength={2000}
                disabled={status === "submitting"}
                value={form.details}
                onChange={set("details")}
                placeholder="Origin, destination, transport mode (Ocean FCL/LCL, Air, Land), cargo volume…"
                className={`${field} resize-none ${fieldErrors.details ? "border-[var(--coral)] focus:border-[var(--coral)]" : ""}`}
                aria-invalid={!!fieldErrors.details}
                aria-describedby={fieldErrors.details ? "quote-details-error" : undefined}
              />
              {fieldErrors.details && (
                <p id="quote-details-error" role="alert" className="mt-1 text-xs text-[var(--coral)]">
                  {fieldErrors.details}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              aria-busy={status === "submitting"}
              className="group inline-flex w-full items-center justify-center gap-3 bg-primary px-7 py-4 text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
            >
              {status === "submitting" ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Request</span>
                  <span className="ar">/ إرسال الطلب</span>
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </>
              )}
            </button>
            <p className="text-xs text-muted-foreground leading-relaxed">
              🔒 Your details are handled confidentially and used solely to route your quotation. All submissions receive priority review by our operations desk in Dubai.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Footer ---- */
function Footer() {
  const footerLinks = [
    { label: "Journey", href: "#journey" },
    { label: "Services", href: "#services" },
    { label: "Network", href: "#network" },
    { label: "Request a Quote", href: "#quote" },
  ];

  return (
    <footer className="border-t border-border bg-background py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex items-center gap-4">
          <LogoBadge size={72} />
          <div>
            <img
              src={logo}
              alt="ELVORA Shipping L.L.C."
              className="h-10 w-auto"
              width={110}
              height={40}
              loading="lazy"
              decoding="async"
            />
            <p className="ar text-sm text-secondary-foreground">إلفورا للشحن والخدمات اللوجستية</p>
            <p className="mt-1 text-sm text-muted-foreground">{ADDRESS}</p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <a href={`tel:${PHONE}`} className="text-secondary-foreground transition-colors hover:text-primary">
                {PHONE_DISPLAY}
              </a>
              <span className="text-border" aria-hidden="true">·</span>
              <a href={`mailto:${EMAIL}`} className="text-accent transition-colors hover:text-primary">
                {EMAIL}
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm text-secondary-foreground">
          {footerLinks.map((item) => (
            <a key={item.label} href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </a>
          ))}
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} ELVORA Shipping L.L.C. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ----------------------------------------------------------------- App ----- */
export default function App() {
  useReveal();
  useEffect(() => {
    document.title = "ELVORA Shipping | Global Freight Forwarding & Maritime Logistics Dubai";
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Journey />
        <Services />
        <Network />
        {/* <Company /> */}
        <Quote />
      </main>
      <Footer />
    </div>
  );
}
