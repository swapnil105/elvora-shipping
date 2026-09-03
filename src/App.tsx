import { useEffect, useState } from "react";
import { useReveal } from "./hooks/useReveal";
import NetworkMap from "./components/NetworkMap";
import LogoBadge from "./components/LogoBadge";
import logo from "./imports/LOGO_BLUE.png";

function palette(i: number) {
  const colors = ["var(--primary)", "var(--teal)", "var(--sand)", "var(--sky)", "var(--coral)", "var(--accent)"];
  return colors[i % colors.length];
}

const EMAIL = "sales@elvorashipping.com";

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
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent"
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
        <a href="#top" className="flex items-center">
          <img src={logo} alt="ELVORA Shipping L.L.C." className="h-20 w-auto" />
        </a>
        <nav className="hidden items-center gap-9 md:flex">
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
          <span className="transition-transform group-hover:translate-x-1">→</span>
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
          alt="Container port at dusk"
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
            <span className="transition-transform group-hover:translate-x-1">→</span>
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
            <span className="text-accent">✳</span>
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
    },
    {
      t: "Air Freight",
      ar: "الشحن الجوي",
      d: "Time-critical and general air cargo with reliable capacity to and from Dubai.",
      img: "photo-1436491865332-7a61a109cc05",
    },
    {
      t: "Land Transport",
      ar: "النقل البري",
      d: "Road haulage and cross-border trucking across the GCC and regional corridors.",
      img: "photo-1601584115197-04ecc0da31d7",
    },
    {
      t: "Freight Forwarding",
      ar: "التخليص والشحن",
      d: "End-to-end coordination of multimodal shipments under one accountable partner.",
      img: "photo-1578575437130-527eed3abbec",
    },
    {
      t: "Customs & Documentation",
      ar: "الجمارك والمستندات",
      d: "Clearance, duties and compliance handled at both origin and destination.",
      img: "photo-1568430462989-44163eb1752f",
    },
    {
      t: "Warehousing & Distribution",
      ar: "التخزين والتوزيع",
      d: "Storage, consolidation and distribution solutions built around your supply chain.",
      img: "photo-1553413077-190dd305871c",
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
            Confirm your active service lines with ELVORA — only offer what the company genuinely provides.
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
                  alt={s.t}
                  loading="lazy"
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
          <NetworkMap />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Company --- */
function Company() {
  // Verifiable facts from the site itself — no invented volumes.
  const stats = [
    ["6", "Continents reached", "Ocean · Air · Land"],
    ["10+", "Active trade lanes", "East ⇄ West"],
    ["3", "Transport modes", "Sea · Air · Road"],
    ["24/7", "Operations desk", "For active shipments"],
  ];
  return (
    <section id="company" className="border-t border-border bg-[var(--tint-sky)] py-28">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div className="reveal">
          <p className="label mb-5">The Company · <span className="ar">عن الشركة</span></p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">
            Serious about the business of moving business.
          </h2>
          <p className="ar mt-3 text-xl text-accent">جادّون في عمل نقل الأعمال</p>
          <p className="mt-6 text-lg leading-relaxed text-secondary-foreground">
            ELVORA Shipping L.L.C. is a Dubai-based freight and logistics company built for international trade. We
            combine local knowledge of one of the world&apos;s busiest trade hubs with a global carrier and partner
            network.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Our promise is simple: clear communication, accountable handovers, and cargo that arrives as planned.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["Importers", "Exporters", "Manufacturers", "Distributors", "Traders"].map((c) => (
              <span key={c} className="border border-border px-4 py-2 text-xs tracking-wide text-secondary-foreground">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="reveal grid grid-cols-2 gap-px self-start overflow-hidden border border-border bg-border">
          {stats.map(([v, l, note], i) => (
            <div key={l} className="relative bg-card p-8">
              <span className="absolute inset-x-0 top-0 h-1" style={{ background: palette(i) }} />
              <div className="font-display text-4xl" style={{ color: palette(i) }}>{v}</div>
              <div className="mt-2 text-sm text-secondary-foreground">{l}</div>
              <div className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">
                {note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- CTA ----- */
function Quote() {
  const [form, setForm] = useState({ name: "", company: "", email: "", details: "" });
  const [trap, setTrap] = useState(""); // honeypot — must stay empty
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // spam trap: silently accept and stop if a bot filled the hidden field
    if (trap) {
      setSent(true);
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!form.name.trim() || !emailOk || !form.details.trim()) {
      setError("Please add your name, a valid email and your shipment details.");
      return;
    }
    // functional fallback with no backend: hand off to the mail client
    const subject = encodeURIComponent(`Quote request — ${form.company || form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nCompany: ${form.company}\nEmail: ${form.email}\n\nShipment details:\n${form.details}`,
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const field =
    "w-full border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

  return (
    <section id="quote" className="relative overflow-hidden py-28">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=2000&h=1000&fit=crop&auto=format"
          alt="Cargo vessel at sea"
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
              <div>Dubai, United Arab Emirates</div>
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

        {sent ? (
          <div className="reveal flex flex-col justify-center border border-primary/40 bg-card/80 p-10 backdrop-blur">
            <div className="font-display text-3xl text-primary">Enquiry ready to send.</div>
            <p className="mt-4 text-secondary-foreground">
              Your email client should now be open with the details filled in. If it didn&apos;t open, email us
              directly at{" "}
              <a href={`mailto:${EMAIL}`} className="text-accent hover:text-primary">
                {EMAIL}
              </a>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="reveal space-y-5 border border-border bg-card/80 p-8 backdrop-blur">
            {/* honeypot — hidden from real users, catches bots */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={trap}
              onChange={(e) => setTrap(e.target.value)}
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />
            <label className="block">
              <span className="label mb-2 block">Full name</span>
              <input type="text" required maxLength={80} value={form.name} onChange={set("name")} placeholder="Your name" className={field} />
            </label>
            <label className="block">
              <span className="label mb-2 block">Company</span>
              <input type="text" maxLength={100} value={form.company} onChange={set("company")} placeholder="Company name" className={field} />
            </label>
            <label className="block">
              <span className="label mb-2 block">Email</span>
              <input type="email" required maxLength={120} value={form.email} onChange={set("email")} placeholder="you@company.com" className={field} />
            </label>
            <label className="block">
              <span className="label mb-2 block">Shipment details</span>
              <textarea
                rows={3}
                required
                maxLength={1000}
                value={form.details}
                onChange={set("details")}
                placeholder="Origin, destination, mode, cargo type…"
                className={`${field} resize-none`}
              />
            </label>
            {error && <p className="text-sm text-[var(--coral)]">{error}</p>}
            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-3 bg-primary px-7 py-4 text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Send enquiry <span className="ar">/ إرسال</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
            <p className="text-xs text-muted-foreground">
              🔒 Your details are used only to answer your enquiry and are never shared. Connect a backend or CRM to
              store submissions on the server.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Footer ---- */
function Footer() {
  return (
    <footer className="border-t border-border bg-background py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div className="flex items-center gap-4">
          <LogoBadge size={72} />
          <div>
            <img src={logo} alt="ELVORA Shipping L.L.C." className="h-10 w-auto" />
            <p className="ar text-sm text-secondary-foreground">إلفورا للشحن والخدمات اللوجستية</p>
            <p className="mt-1 text-sm text-muted-foreground">Shipping &amp; Logistics · Dubai, U.A.E.</p>
            <a href={`mailto:${EMAIL}`} className="mt-1 inline-block text-sm text-accent transition-colors hover:text-primary">
              {EMAIL}
            </a>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm text-secondary-foreground">
          {["Journey", "Services", "Network", "Request a Quote"].map((l) => (
            <a key={l} href={`#${l.split(" ")[0].toLowerCase()}`} className="hover:text-foreground">
              {l}
            </a>
          ))}
        </div>
        <p className="font-mono text-xs text-muted-foreground">© {new Date().getFullYear()} Elvora Shipping L.L.C.</p>
      </div>
    </footer>
  );
}

/* ----------------------------------------------------------------- App ----- */
export default function App() {
  useReveal();
  useEffect(() => {
    document.title = "ELVORA SHIPING";
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
