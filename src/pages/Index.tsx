import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, Check, MessageCircle, MapPin, Phone, Mail, Star, Sparkles, Zap, Heart, Loader2, Calendar, Clock, BookOpen, Quote, Menu, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { z } from "zod";
import useEmblaCarousel from "embla-carousel-react";
import heroBanner from "@/assets/hero-banner.jpg";
import logoDark from "@/assets/logo-dark.svg";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name too long"),
  business: z.string().trim().min(2, "Business name required").max(100, "Business name too long"),
  type: z.string().min(1, "Select a business type"),
  phone: z.string().trim().regex(/^[+]?[0-9\s-]{10,15}$/, "Enter a valid phone number"),
  message: z.string().trim().min(10, "Tell us a bit more (min 10 chars)").max(1000, "Message too long"),
});
type LeadInput = z.infer<typeof leadSchema>;

// ── Scroll-triggered count-up hook ──
function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  return { ref, value };
}

const WHATSAPP = "https://wa.me/918168194134";

const businesses = [
  { name: "Sharma Family Restaurant", tag: "Hisar" },
  { name: "Verma Dental Clinic", tag: "Healthcare" },
  { name: "Glow Beauty Salon", tag: "Salon & Spa" },
  { name: "Agarwal Boutique", tag: "Retail" },
  { name: "Singh Electrical Services", tag: "Service" },
  { name: "Little Stars Play School", tag: "Education" },
  { name: "Gupta Clinic", tag: "Healthcare" },
  { name: "R.K. Family Restaurant", tag: "Hisar" },
  { name: "Bansal Properties", tag: "Real Estate" },
  { name: "Lumière Spa", tag: "Wellness" },
];

const stats: { target: number; suffix: string; label: string }[] = [
  { target: 7, suffix: "d", label: "Average delivery" },
  { target: 3, suffix: "×", label: "Revenue growth" },
  { target: 50, suffix: "+", label: "Local businesses" },
  { target: 30, suffix: "m", label: "Response on WhatsApp" },
];

const articles = [
  {
    tag: "Local SEO",
    title: "Google Business Profile for Restaurants: 2025 Ranking Guide",
    excerpt: "How the Map Pack actually ranks restaurants — categories, NAP, menus, photos, Google Posts and review velocity. The exact playbook used to land #1 for 'restaurant near me' in 30 days.",
    date: "Apr 18, 2026",
    read: "9 min read",
    href: "https://onthemap.agency/blog/google-business-profile-restaurants/",
    source: "On The Map",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=70",
  },
  {
    tag: "WhatsApp Marketing",
    title: "5 SMBs That Grew 200% with WhatsApp Automation",
    excerpt: "Real case studies — from a Pakistani solar company tripling qualified leads to a Dubai exporter automating B2B qualification. Templates, funnels and the cadence that actually converts.",
    date: "Apr 06, 2026",
    read: "6 min read",
    href: "https://www.autowa.io/blog/whatsapp-automation-case-studies",
    source: "AutoWA",
    image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1200&q=70",
  },
  {
    tag: "Web Design",
    title: "Landing Page Design for SMBs in India: A 2025 Guide",
    excerpt: "Why 70% of small-business websites fail to convert — and the layout, hierarchy, micro-copy and trust signals Indian SMBs need to turn ad clicks into calls, bookings and orders.",
    date: "Mar 24, 2026",
    read: "8 min read",
    href: "https://www.trifectmedia.in/post/from-clicks-to-customers-designing-landing-pages-that-convert-indian-leads",
    source: "Trifect Media",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=70",
  },
];

const industries = [
  { title: "Restaurant & Café", line: "Online ordering. Built for full tables.", icon: "🍽️" },
  { title: "Doctor & Clinic", line: "Google Ranking #1. Built for trust.", icon: "🩺" },
  { title: "Salon & Spa", line: "Instagram-first booking. Built for beauty.", icon: "💇" },
];

const trialFeatures = [
  "Free 1-page premium website (live in 7 days)",
  "Google Business Profile setup & optimization",
  "Logo + brand colors refresh",
  "WhatsApp click-to-chat button + lead routing",
  "1 Instagram reel mockup with captions",
  "30-min strategy call with the founder",
];

const values = [
  { icon: Zap, title: "7-Day Delivery", body: "No agency delays. Most projects ship in a week — design, build, launch." },
  { icon: MapPin, title: "Local-First Strategy", body: "Built for Hisar businesses. Google Maps, regional SEO, vernacular content." },
  { icon: Sparkles, title: "Apple-Grade Craft", body: "Premium typography, motion, and micro-interactions. Every pixel intentional." },
  { icon: Heart, title: "Founder-Led Service", body: "Talk directly to the people building your site. No account managers, no handoffs." },
];

const stories = [
  { tag: "Restaurant", quote: "CoreSoft ne hamare restaurant ki online presence completely transform kar di. Google par pehle hum page 4 par the, ab top 3 mein hain. Monthly orders 3x ho gaye sirf 45 din mein.", name: "Rajesh Sharma", company: "Sharma Family Restaurant", initials: "RS" },
  { tag: "Salon & Spa", quote: "WhatsApp automation aur Instagram management ne humari booking 80% badha di. Ab hume manually follow-up nahi karna padta — sab automatic ho gaya hai. Best investment ever!", name: "Priya Mehta", company: "Glow Beauty Salon", initials: "PM" },
  { tag: "Healthcare", quote: "Meri clinic ke liye website aur Google My Business setup kiya CoreSoft ne. Ab roz 8–10 new patient inquiries aati hain online se. Pehle sirf walk-ins the. Kaam bahut professional hai.", name: "Dr. Amit Verma", company: "Verma Dental Clinic", initials: "AV" },
  { tag: "Retail", quote: "Social media content aur paid ads se hamare boutique ki reach Haryana bhar mein ho gayi. Online orders shuru ho gaye aur festival season mein revenue 2.5x tha last year se.", name: "Sunita Agarwal", company: "Agarwal Boutique", initials: "SA" },
  { tag: "Service Business", quote: "Pehle sirf referrals se kaam milta tha. CoreSoft ki team ne Google Ads aur local SEO se itne leads dilaye ki ab hume 2 aur electricians hire karne pade. Bahut acha ROI mila.", name: "Vikram Singh", company: "Singh Electrical Services", initials: "VS" },
  { tag: "Education", quote: "Admission season mein CoreSoft ki digital campaign se 40+ new admissions mile. Website, Facebook ads, aur WhatsApp follow-up — sab kuch ek jagah se manage hua. Superb team!", name: "Neha Gupta", company: "Little Stars Play School", initials: "NG" },
];

function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <a href="#top" className="inline-flex items-center" aria-label="CoreSoft Solutions home">
      <img src={logoDark} alt="CoreSoft Solutions" className={`${className} w-auto`} width={560} height={160} />
    </a>
  );
}

type ImgWithSkeletonProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** Tailwind classes for the wrapping figure (sizing, rounding, position). */
  wrapperClassName?: string;
  /** Optional skeleton override class. */
  skeletonClassName?: string;
};

/** <img> that shows a shimmer skeleton until the bitmap is decoded. */
function ImgWithSkeleton({
  wrapperClassName,
  skeletonClassName,
  className,
  onLoad,
  onError,
  src,
  ...rest
}: ImgWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  // If the image is already cached, mark it loaded synchronously to avoid flash.
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, [src]);
  return (
    <span className={`relative block ${wrapperClassName ?? ""}`}>
      {!loaded && !errored && (
        <span
          aria-hidden
          className={`absolute inset-0 skeleton-shimmer ${skeletonClassName ?? ""}`}
        />
      )}
      <img
        ref={imgRef}
        src={src}
        className={`${className ?? ""} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
        onLoad={(e) => { setLoaded(true); onLoad?.(e); }}
        onError={(e) => { setErrored(true); setLoaded(true); onError?.(e); }}
        {...rest}
      />
    </span>
  );
}

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "#industries", label: "Services" },
  { href: "#industries", label: "Industries" },
  { href: "#about", label: "About" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

// Dispatched by header / CTA anchors so the mobile carousel can sync.
function emitNavTo(hash: string) {
  if (!hash || !hash.startsWith("#")) return;
  window.dispatchEvent(new CustomEvent("coresoft:nav", { detail: { hash } }));
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleNavClick = (href: string) => () => {
    setOpen(false);
    emitNavTo(href);
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open ? "glass" : "bg-transparent"}`}>
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 md:px-8">
        <Logo />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={handleNavClick(l.href)} className="hover:text-foreground transition">{l.label}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a href="#trial" onClick={handleNavClick("#trial")} className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-red px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow hover:scale-[1.03] transition">
            Get Audit <ArrowRight className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="md:hidden inline-flex items-center gap-1.5 rounded-full glass px-3.5 py-2.5 text-foreground hover:bg-surface-elevated transition"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      </nav>
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden glass border-t border-border/40 animate-menu-down"
        >
          <div className="mx-auto max-w-6xl px-5 py-4 flex flex-col">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={handleNavClick(l.href)}
                className="py-3 border-b border-border/30 last:border-b-0 text-base font-semibold text-foreground/90 hover:text-primary transition flex items-center justify-between"
              >
                {l.label}
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </a>
            ))}
            <a
              href="#trial"
              onClick={handleNavClick("#trial")}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-red px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow"
            >
              Get Audit <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
    el.style.setProperty("--tx", `${(x * 12).toFixed(2)}px`);
    el.style.setProperty("--ty", `${(y * 12).toFixed(2)}px`);
  };
  const onLeave = () => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--tx", `0px`);
    el.style.setProperty("--ty", `0px`);
  };

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="absolute inset-0 -z-10 opacity-70" style={{ background: "radial-gradient(60% 50% at 50% 0%, hsl(var(--primary) / 0.4), transparent 70%)" }} />
      <div className="mx-auto max-w-6xl px-5 md:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-8 animate-fade-in">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-secondary">Hisar · Digital Media · Business Audits</span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight animate-fade-in">
          Innovation for<br />
          <span className="text-gradient-red">every business.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg md:text-xl text-foreground/70 leading-relaxed">
          Apne business ko digital banaiye — premium websites, Google ranking, aur lead-machines.
          Delivered in <span className="text-foreground font-semibold">7 days</span>. Average <span className="text-foreground font-semibold">3× growth</span>.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#trial" className="inline-flex items-center gap-2 rounded-full bg-gradient-red px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-glow hover:scale-[1.03] transition">
            Get a free audit <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#testimonials" className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-bold text-foreground hover:bg-surface-elevated transition">
            See what we build
          </a>
        </div>

        <div
          ref={wrapRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="group relative mt-16 md:mt-20 [perspective:1400px]"
          style={{ ["--rx" as any]: "0deg", ["--ry" as any]: "0deg", ["--tx" as any]: "0px", ["--ty" as any]: "0px" }}
        >
          <div className="absolute inset-x-10 top-10 h-72 bg-gradient-red opacity-40 blur-3xl rounded-full -z-10" />
          <div
            className="relative mx-auto w-full max-w-5xl transition-transform duration-200 ease-out will-change-transform"
            style={{ transform: "rotateX(var(--rx)) rotateY(var(--ry)) translate3d(var(--tx),var(--ty),0)" }}
          >
            <ImgWithSkeleton
              src={heroBanner}
              alt="CoreSoft Solutions — premium websites, WhatsApp leads, Google ranking and analytics for local businesses"
              width={1100}
              height={733}
              fetchPriority="high"
              decoding="async"
              wrapperClassName="block w-full rounded-3xl overflow-hidden shadow-elegant animate-float"
              skeletonClassName="rounded-3xl"
              className="block w-full h-auto"
              style={{ aspectRatio: "1100 / 733" }}
            />
            <div className="absolute -left-3 md:-left-6 top-1/4 hidden md:flex glass rounded-2xl p-3 pr-4 gap-3 items-center shadow-card hover:scale-105 transition" style={{ transform: "translateZ(60px)" }}>
              <div className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-red text-primary-foreground">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">+18 leads today</div>
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Live · Hisar</div>
              </div>
            </div>
            <div className="absolute -right-3 md:-right-6 bottom-1/4 hidden md:flex glass rounded-2xl p-3 pr-4 gap-3 items-center shadow-card hover:scale-105 transition" style={{ transform: "translateZ(60px)" }}>
              <div className="grid place-items-center h-10 w-10 rounded-xl bg-secondary text-secondary-foreground font-black">4.9</div>
              <div className="text-left">
                <div className="flex gap-0.5 text-primary">{Array.from({length:5}).map((_,i)=><Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Avg client rating</div>
              </div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 hidden md:flex glass rounded-2xl px-5 py-3 gap-4 items-center shadow-card" style={{ transform: "translate(-50%, 0) translateZ(80px)" }}>
              <div className="text-center">
                <div className="text-lg font-black text-gradient-red">#1</div>
                <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Google rank</div>
              </div>
              <span className="h-8 w-px bg-border/60" />
              <div className="text-center">
                <div className="text-lg font-black">7d</div>
                <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Delivery</div>
              </div>
              <span className="h-8 w-px bg-border/60" />
              <div className="text-center">
                <div className="text-lg font-black">3×</div>
                <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Growth</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [...businesses, ...businesses];
  return (
    <section aria-label="Businesses scaling with CoreSoft" className="border-y border-border/40 py-8 overflow-hidden bg-surface/40">
      <div className="mx-auto max-w-6xl px-5 md:px-8 mb-6 text-center">
        <p className="eyebrow">Businesses scaling with CoreSoft</p>
      </div>
      <div className="relative flex overflow-hidden">
        <div className="marquee flex shrink-0 gap-10 pr-10">
          {items.map((b, i) => (
            <div key={i} className="flex items-center gap-3 whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="font-semibold text-foreground/90">{b.name}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{b.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="eyebrow text-center">By the numbers</p>
        <h2 className="mt-4 text-center text-4xl md:text-6xl font-black tracking-tight">
          Built for results. <span className="text-gradient-red">Measured in growth.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-foreground/70">
          Real outcomes from real local businesses — fast delivery, steady growth, and support that actually shows up.
        </p>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-border/40 rounded-2xl overflow-hidden shadow-card">
          {stats.map((s) => (
            <StatCard key={s.label} target={s.target} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { ref, value } = useCountUp(target);
  return (
    <div ref={ref} className="bg-gradient-card p-8 md:p-10 text-center">
      <div className="text-5xl md:text-6xl font-black tracking-tight tabular-nums">
        {value}<span className="text-gradient-red">{suffix}</span>
      </div>
      <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
    </div>
  );
}

function Industries() {
  return (
    <section id="industries" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="eyebrow">The Hook</p>
        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight max-w-2xl">
            Apne Business ko <span className="text-gradient-red">Digital Banaiye.</span>
          </h2>
          <p className="text-foreground/70 max-w-md">
            Restaurant, clinic ya salon — har business ke liye custom packages. Premium sites, Google ranking, Instagram growth. Transparent pricing.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {industries.map((i) => (
            <article key={i.title} className="group relative overflow-hidden rounded-3xl bg-gradient-card p-8 shadow-card border border-border/40 hover:border-primary/40 transition">
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition" />
              <div className="text-5xl">{i.icon}</div>
              <h3 className="mt-6 text-2xl font-black">{i.title}</h3>
              <p className="mt-2 text-foreground/70">{i.line}</p>
              <div className="mt-8 flex items-center gap-4 text-sm">
                <a href="#contact" className="font-semibold text-foreground hover:text-primary transition inline-flex items-center gap-1.5">Learn more <ArrowRight className="h-3.5 w-3.5" /></a>
                <span className="text-muted-foreground">·</span>
                <a href={WHATSAPP} target="_blank" rel="noreferrer" className="font-semibold text-secondary hover:text-foreground transition">Get a quote</a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-gradient-red p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-glow">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-primary-foreground">Every Other Business</h3>
            <p className="mt-2 text-primary-foreground/90 max-w-xl">
              Built for you. Whatever you do. Retail, services, contractors — agar aap local hain aur grow karna chahte ho, hum aapke liye banayenge.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-sm font-bold hover:scale-[1.03] transition">Talk to us</a>
            <a href="#trial" className="inline-flex items-center gap-2 rounded-full glass text-primary-foreground px-6 py-3 text-sm font-bold border border-primary-foreground/30 hover:bg-primary-foreground/10 transition">Try free</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FreeTrial() {
  return (
    <section id="trial" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="eyebrow !text-secondary">Limited · 5 spots / month</span>
            </div>
            <h2 className="mt-6 text-4xl md:text-6xl font-black tracking-tight">
              1-Week <span className="text-gradient-red">Free Trial.</span><br />Zero risk. All proof.
            </h2>
            <p className="mt-5 text-foreground/70 max-w-lg">
              Pehle dekho, phir decide karo. Hum aapke business ke liye complete starter pack 7 din mein build karke denge — bilkul free.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-red px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-glow hover:scale-[1.03] transition">
                Claim my free week <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-bold text-foreground hover:bg-surface-elevated transition">Talk first</a>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-card p-8 md:p-10 shadow-elegant border border-border/40">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="eyebrow">Starter Pack Value</div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-muted-foreground line-through">₹24,999</span>
                  <span className="text-5xl font-black text-gradient-red">₹0</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">First week, on us</div>
              </div>
            </div>
            <ul className="mt-8 space-y-4">
              {trialFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <div className="grid place-items-center h-5 w-5 rounded-full bg-primary/20 text-primary mt-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-sm text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-border/40">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Delivery</div>
                <div className="mt-1 text-sm font-bold">7 days</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Strategy call</div>
                <div className="mt-1 text-sm font-bold">30 min</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Cancellation</div>
                <div className="mt-1 text-sm font-bold">Anytime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <p className="eyebrow">About CoreSoft</p>
            <h2 className="mt-4 text-4xl md:text-6xl font-black tracking-tight">
              A Hisar studio building <span className="text-gradient-red">India's local heroes.</span>
            </h2>
            <p className="mt-6 text-foreground/70 text-lg leading-relaxed">
              Every kirana, clinic and café in Haryana deserves the same craft as a Bengaluru startup. We design, code and launch — fast, transparent, built to convert.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[["50+","Launched"],["98%","Retained"],["2024","Founded"]].map(([n,l])=>(
                <div key={l}>
                  <div className="text-3xl md:text-4xl font-black text-gradient-red">{n}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">What we stand for</p>
            <h3 className="mt-4 text-2xl md:text-3xl font-black">Four values. Zero shortcuts.</h3>
            <div className="mt-8 space-y-4">
              {values.map((v) => (
                <div key={v.title} className="flex gap-4 rounded-2xl bg-gradient-card border border-border/40 p-5 shadow-card">
                  <div className="grid place-items-center h-11 w-11 shrink-0 rounded-xl bg-primary/15 text-primary">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold">{v.title}</div>
                    <div className="text-sm text-foreground/70 mt-0.5">{v.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);
  const featured = stories[active];
  return (
    <section id="testimonials" className="py-24 md:py-32" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="eyebrow">Customer Testimonials</p>
        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2 id="testimonials-heading" className="text-4xl md:text-6xl font-black tracking-tight">
            Real businesses. <span className="text-gradient-red">Real growth.</span>
          </h2>
          <p className="text-foreground/70 max-w-md">
            Haryana ke local businesses jo CoreSoft ke saath scale kar rahe hain — unke words mein.
          </p>
        </div>

        {/* Featured testimonial */}
        <div className="mt-12 relative overflow-hidden rounded-3xl glass shadow-elegant p-8 md:p-14">
          <div className="absolute -top-10 -left-10 h-60 w-60 bg-primary/30 blur-3xl rounded-full" aria-hidden />
          <div className="absolute -bottom-10 -right-10 h-60 w-60 bg-accent/20 blur-3xl rounded-full" aria-hidden />
          <Quote className="h-10 w-10 text-primary opacity-60" aria-hidden />
          <blockquote className="relative mt-6 text-xl md:text-3xl font-medium leading-snug tracking-tight text-foreground">
            "{featured.quote}"
          </blockquote>
          <div className="relative mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="grid place-items-center h-14 w-14 rounded-full bg-gradient-red text-primary-foreground font-black">{featured.initials}</div>
              <div>
                <div className="font-bold">{featured.name}</div>
                <div className="text-sm text-muted-foreground">{featured.company} · {featured.tag}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {stories.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${i === active ? "w-8 bg-primary" : "w-2 bg-foreground/20 hover:bg-foreground/40"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stories.map((s, i) => (
            <button
              type="button"
              onClick={() => setActive(i)}
              key={s.name}
              className={`text-left rounded-3xl glass border p-7 shadow-card flex flex-col transition hover:-translate-y-1 hover:border-primary/40 ${i === active ? "border-primary/50 ring-1 ring-primary/30" : "border-border/40"}`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/15 text-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest">{s.tag}</span>
                <div className="flex gap-0.5 text-primary" aria-label="5 star rating">{Array.from({length:5}).map((_,i)=><Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
              </div>
              <p className="mt-5 text-foreground/85 leading-relaxed line-clamp-4">"{s.quote}"</p>
              <div className="mt-6 pt-5 border-t border-border/40 flex items-center gap-3">
                <div className="grid place-items-center h-11 w-11 rounded-full bg-gradient-red text-primary-foreground font-black text-sm">{s.initials}</div>
                <div>
                  <div className="font-bold text-sm">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.company}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Blog() {
  return (
    <section id="blog" className="py-24 md:py-32" aria-labelledby="blog-heading">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <p className="eyebrow">From the Studio</p>
            <h2 id="blog-heading" className="mt-4 text-4xl md:text-6xl font-black tracking-tight">
              Articles & <span className="text-gradient-red">field notes.</span>
            </h2>
            <p className="mt-4 text-foreground/70 max-w-xl">
              Playbooks, breakdowns and stories from the front lines of digital growth — written for India's local heroes.
            </p>
          </div>
          <a href="#blog" className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition">
            All articles <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {articles.map((a) => (
            <article key={a.title} className="group relative overflow-hidden rounded-3xl glass border border-border/40 shadow-card flex flex-col hover:-translate-y-1 hover:border-primary/40 transition">
              <a href={a.href} target="_blank" rel="noopener noreferrer" className="relative block h-48 overflow-hidden" aria-label={a.title}>
                <ImgWithSkeleton
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  width={1200}
                  height={800}
                  wrapperClassName="absolute inset-0"
                  skeletonClassName=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" aria-hidden />
                <div className="absolute inset-0 ring-1 ring-inset ring-primary-foreground/10" aria-hidden />
                <span className="absolute left-5 bottom-5 rounded-full bg-background/60 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground border border-border/40">{a.tag}</span>
                <span className="absolute right-5 top-5 grid place-items-center h-9 w-9 rounded-full bg-background/60 backdrop-blur border border-border/40 text-primary">
                  <BookOpen className="h-4 w-4" aria-hidden />
                </span>
              </a>
              <div className="p-7 flex flex-col flex-1">
                <h3 className="text-lg font-black leading-snug group-hover:text-primary transition">
                  <a href={a.href} target="_blank" rel="noopener noreferrer">{a.title}</a>
                </h3>
                <p className="mt-3 text-sm text-foreground/70 line-clamp-3">{a.excerpt}</p>
                <div className="mt-auto pt-6 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground font-mono uppercase tracking-widest">
                  <span className="inline-flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {a.date}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3" /> {a.read}</span>
                </div>
                <a href={a.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-foreground group-hover:text-primary transition">
                  Read on {a.source} <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


function Contact() {
  const { toast } = useToast();
  const [values, setValues] = useState<LeadInput>({
    name: "",
    business: "",
    type: "Restaurant / Café",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadInput, string>>>({});
  const [loading, setLoading] = useState(false);

  const update = (k: keyof LeadInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof LeadInput, string>> = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as keyof LeadInput;
        if (!fieldErrors[k]) fieldErrors[k] = i.message;
      });
      setErrors(fieldErrors);
      toast({ title: "Please fix the highlighted fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    const d = parsed.data;
    const msg =
      `Hi CoreSoft! 👋\n\n` +
      `Name: ${d.name}\n` +
      `Business: ${d.business} (${d.type})\n` +
      `Phone: ${d.phone}\n\n` +
      `What I need:\n${d.message}`;
    const url = `${WHATSAPP}?text=${encodeURIComponent(msg)}`;

    // Open synchronously inside the user gesture to avoid popup blockers.
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win || win.closed || typeof win.closed === "undefined") {
      // Popup blocked — navigate current tab as fallback.
      window.location.href = url;
    }

    toast({ title: "Opening WhatsApp…", description: "We'll reply within 30 minutes." });
    setValues({ name: "", business: "", type: "Restaurant / Café", phone: "", message: "" });
    // Brief loading state for visual feedback
    setTimeout(() => setLoading(false), 400);
  };

  const fieldCls = (k: keyof LeadInput) =>
    `w-full rounded-xl bg-background/40 backdrop-blur border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition ${
      errors[k] ? "border-destructive focus:border-destructive" : "border-border/30 focus:border-primary/60 hover:border-border/60"
    }`;

  return (
    <section id="contact" className="py-24 md:py-32 relative" aria-labelledby="contact-heading" itemScope itemType="https://schema.org/Organization">
      <div className="absolute inset-x-0 top-1/3 -z-10 h-96 bg-gradient-red opacity-20 blur-[140px] rounded-full mx-auto max-w-3xl" aria-hidden />
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="rounded-3xl glass shadow-elegant overflow-hidden grid lg:grid-cols-2 relative">
          <div className="absolute inset-0 -z-10 opacity-50" style={{ background: "radial-gradient(60% 80% at 0% 0%, hsl(var(--primary) / 0.18), transparent 60%), radial-gradient(60% 80% at 100% 100%, hsl(var(--accent) / 0.12), transparent 60%)" }} aria-hidden />
          <div className="p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-border/30 relative">
            <p className="eyebrow">Contact CoreSoft Solutions</p>
            <h2 id="contact-heading" className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
              Your audit is <span className="text-gradient-red">free.</span><br />Your growth isn't.
            </h2>
            <p className="mt-5 text-foreground/70" itemProp="description">
              Get in touch with CoreSoft Solutions in Hisar, Haryana. We'll review your business online and respond on WhatsApp within 30 minutes.
            </p>
            <meta itemProp="name" content="CoreSoft Solutions" />
            <meta itemProp="email" content="admin@coresoftsolutions.net" />
            <meta itemProp="telephone" content="+91-81681-94134" />
            <div className="mt-8 space-y-4">
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="flex items-center gap-3 group" aria-label="Chat on WhatsApp +91 81681 94134">
                <div className="grid place-items-center h-11 w-11 rounded-xl bg-primary/15 text-primary border border-primary/20"><Phone className="h-5 w-5" /></div>
                <div>
                  <div className="font-bold group-hover:text-primary transition">+91 81681 94134</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">WhatsApp · 30 min response</div>
                </div>
              </a>
              <div className="flex items-center gap-3" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <div className="grid place-items-center h-11 w-11 rounded-xl bg-primary/15 text-primary border border-primary/20"><MapPin className="h-5 w-5" /></div>
                <div>
                  <div className="font-bold">
                    <span itemProp="addressLocality">Hisar</span>, <span itemProp="addressRegion">Haryana</span> · <span itemProp="addressCountry">India</span>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Studio</div>
                </div>
              </div>
              <a href="mailto:admin@coresoftsolutions.net" className="flex items-center gap-3 group">
                <div className="grid place-items-center h-11 w-11 rounded-xl bg-primary/15 text-primary border border-primary/20"><Mail className="h-5 w-5" /></div>
                <div>
                  <div className="font-bold group-hover:text-primary transition">admin@coresoftsolutions.net</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email · 24h response</div>
                </div>
              </a>
            </div>
          </div>

          <form className="p-10 md:p-14 space-y-5" onSubmit={onSubmit} noValidate>
            <div>
              <p className="eyebrow">WhatsApp Lead Form</p>
              <h3 className="mt-3 text-2xl font-black">Apka Business, Hamaari <span className="text-gradient-red">Digital Expertise.</span></h3>
              <p className="mt-2 text-sm text-foreground/70">Fill this in and we'll reach you on WhatsApp.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lf-name" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold block mb-2">Your Name</label>
                <input id="lf-name" name="name" value={values.name} onChange={update("name")} className={fieldCls("name")} placeholder="Rajesh Kumar" disabled={loading} maxLength={80} aria-invalid={!!errors.name} />
                {errors.name && <p className="mt-1.5 text-xs text-destructive">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="lf-biz" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold block mb-2">Business Name</label>
                <input id="lf-biz" name="business" value={values.business} onChange={update("business")} className={fieldCls("business")} placeholder="Sharma Restaurant" disabled={loading} maxLength={100} aria-invalid={!!errors.business} />
                {errors.business && <p className="mt-1.5 text-xs text-destructive">{errors.business}</p>}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lf-type" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold block mb-2">Business Type</label>
                <select id="lf-type" name="type" value={values.type} onChange={update("type")} className={fieldCls("type")} disabled={loading}>
                  <option>Restaurant / Café</option>
                  <option>Doctor / Clinic</option>
                  <option>Salon / Spa</option>
                  <option>Retail / Boutique</option>
                  <option>Services / Contractor</option>
                  <option>Education</option>
                  <option>Other</option>
                </select>
                {errors.type && <p className="mt-1.5 text-xs text-destructive">{errors.type}</p>}
              </div>
              <div>
                <label htmlFor="lf-phone" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold block mb-2">WhatsApp Number</label>
                <input id="lf-phone" name="phone" type="tel" value={values.phone} onChange={update("phone")} className={fieldCls("phone")} placeholder="+91 98XXXXXXXX" disabled={loading} maxLength={15} aria-invalid={!!errors.phone} />
                {errors.phone && <p className="mt-1.5 text-xs text-destructive">{errors.phone}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="lf-msg" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold block mb-2">What do you need?</label>
              <textarea id="lf-msg" name="message" rows={4} value={values.message} onChange={update("message")} className={`${fieldCls("message")} resize-none`} placeholder="Website, Google ranking, Instagram growth..." disabled={loading} maxLength={1000} aria-invalid={!!errors.message} />
              {errors.message && <p className="mt-1.5 text-xs text-destructive">{errors.message}</p>}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {["7 Din Delivery","30 Min Response","100% Transparent"].map((t)=>(
                <span key={t} className="rounded-full bg-secondary/15 text-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-widest">{t}</span>
              ))}
            </div>
            <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-red px-7 py-4 text-sm font-bold text-primary-foreground shadow-glow hover:scale-[1.01] transition disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100">
              {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>) : (<>Send on WhatsApp <ArrowRight className="h-4 w-4" /></>)}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 py-14 bg-surface/40">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <Logo />
            <p className="mt-5 text-sm text-foreground/70 max-w-xs">
              Premium digital media and business audits for India's local heroes. Built in Hisar, Haryana.
            </p>
          </div>
          <div>
            <p className="eyebrow">Contact</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href={WHATSAPP} target="_blank" rel="noreferrer" className="hover:text-primary transition">+91 81681 94134</a></li>
              <li><a href="mailto:admin@coresoftsolutions.net" className="hover:text-primary transition">admin@coresoftsolutions.net</a></li>
              <li className="text-muted-foreground">Hisar, Haryana</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Follow</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition">Instagram</a></li>
              <li><a href="#" className="hover:text-primary transition">LinkedIn</a></li>
              <li><a href={WHATSAPP} target="_blank" rel="noreferrer" className="hover:text-primary transition">WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col md:flex-row gap-3 justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>© 2026 CoreSoft Solutions. All rights reserved.</span>
          <span>Designed in Hisar · Crafted with care.</span>
        </div>
      </div>
    </footer>
  );
}

function SectionReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="reveal-slide">
      {children}
    </div>
  );
}

/** The set of major sections the user can swipe through on mobile. */
const MOBILE_SLIDES: { id: string; label: string; render: () => JSX.Element }[] = [
  { id: "stats", label: "Stats", render: () => <Stats /> },
  { id: "industries", label: "Services", render: () => <Industries /> },
  { id: "trial", label: "Free Trial", render: () => <FreeTrial /> },
  { id: "about", label: "About", render: () => <About /> },
  { id: "testimonials", label: "Testimonials", render: () => <Testimonials /> },
  { id: "blog", label: "Blog", render: () => <Blog /> },
  { id: "contact", label: "Contact", render: () => <Contact /> },
];

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function MobileSectionCarousel() {
  const reduceMotion = prefersReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    skipSnaps: false,
    duration: reduceMotion ? 0 : 25,
    containScroll: "trimSnaps",
  });
  const [selected, setSelected] = useState(0);
  const [ready, setReady] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Track selected snap
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    // Mark ready on next tick so skeleton can fade out cleanly
    const t = window.setTimeout(() => setReady(true), 250);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      window.clearTimeout(t);
    };
  }, [emblaApi]);

  // Listen for in-page nav and scroll the carousel to the matching slide.
  useEffect(() => {
    if (!emblaApi) return;
    const onNav = (e: Event) => {
      const hash = (e as CustomEvent<{ hash: string }>).detail?.hash;
      if (!hash) return;
      const id = hash.replace(/^#/, "");
      const idx = MOBILE_SLIDES.findIndex((s) => s.id === id);
      if (idx >= 0) {
        emblaApi.scrollTo(idx, reduceMotion);
        // Bring the carousel itself into view
        wrapperRef.current?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    };
    window.addEventListener("coresoft:nav", onNav as EventListener);
    return () => window.removeEventListener("coresoft:nav", onNav as EventListener);
  }, [emblaApi, reduceMotion]);

  // Honor existing #hash on first paint (e.g. /#blog)
  useEffect(() => {
    if (!emblaApi) return;
    const hash = window.location.hash;
    if (!hash) return;
    const idx = MOBILE_SLIDES.findIndex((s) => s.id === hash.replace(/^#/, ""));
    if (idx > 0) emblaApi.scrollTo(idx, true);
  }, [emblaApi]);

  // Delegated: any in-page anchor click (e.g. inline CTAs) should route to the
  // matching carousel slide instead of triggering a vertical jump.
  useEffect(() => {
    if (!emblaApi) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = (e.target as HTMLElement | null)?.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!target) return;
      const hash = target.getAttribute("href") || "";
      if (hash.length < 2) return;
      const id = hash.slice(1);
      const idx = MOBILE_SLIDES.findIndex((s) => s.id === id);
      if (idx < 0) return;
      e.preventDefault();
      emblaApi.scrollTo(idx, reduceMotion);
      wrapperRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [emblaApi, reduceMotion]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div ref={wrapperRef} aria-roledescription="carousel" aria-label="Page sections">
      <div className="relative">
        {/* Skeleton overlay shown briefly until embla initializes */}
        {!ready && (
          <div aria-hidden className="px-5 pt-10 pb-6 space-y-4">
            <Skeleton className="h-6 w-32 skeleton-shimmer" />
            <Skeleton className="h-12 w-3/4 skeleton-shimmer" />
            <Skeleton className="h-40 w-full rounded-2xl skeleton-shimmer" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-24 rounded-2xl skeleton-shimmer" />
              <Skeleton className="h-24 rounded-2xl skeleton-shimmer" />
            </div>
          </div>
        )}

        <div className={`section-carousel-viewport transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`} ref={emblaRef}>
          <div className="section-carousel-track">
            {MOBILE_SLIDES.map((s, i) => (
              <div
                key={s.id}
                className="section-carousel-slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${s.label} (${i + 1} of ${MOBILE_SLIDES.length})`}
                aria-hidden={i !== selected}
              >
                {s.render()}
              </div>
            ))}
          </div>
        </div>

        {/* Pagination + arrows */}
        <div className="sticky bottom-4 z-30 mx-auto mt-4 flex w-fit items-center gap-3 rounded-full glass px-3 py-2 shadow-card">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={selected === 0}
            aria-label="Previous section"
            className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated text-foreground/80 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Section">
            {MOBILE_SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === selected}
                aria-label={`Go to ${s.label}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === selected ? "w-6 bg-primary" : "w-2 bg-foreground/25 hover:bg-foreground/50"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={scrollNext}
            disabled={selected === MOBILE_SLIDES.length - 1}
            aria-label="Next section"
            className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated text-foreground/80 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

const Index = () => {
  const isMobile = useIsMobile();
  return (
    <main>
      <Header />
      <Hero />
      <Marquee />
      {isMobile ? (
        <MobileSectionCarousel />
      ) : (
        <>
          <SectionReveal><Stats /></SectionReveal>
          <SectionReveal><Industries /></SectionReveal>
          <SectionReveal><FreeTrial /></SectionReveal>
          <SectionReveal><About /></SectionReveal>
          <SectionReveal><Testimonials /></SectionReveal>
          <SectionReveal><Blog /></SectionReveal>
          <SectionReveal><Contact /></SectionReveal>
        </>
      )}
      <Footer />
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 grid place-items-center h-14 w-14 rounded-full bg-gradient-red shadow-glow hover:scale-110 transition"
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </a>
    </main>
  );
};

export default Index;
