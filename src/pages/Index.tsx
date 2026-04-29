import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, MessageCircle, MapPin, Phone, Mail, Star, Sparkles, Zap, Heart, Loader2, Calendar, Clock, BookOpen, Quote } from "lucide-react";
import { z } from "zod";
import heroBanner from "@/assets/hero-banner.jpg";
import logoDark from "@/assets/logo-dark.svg";
import { useToast } from "@/hooks/use-toast";

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

const stats = [
  { n: "7", suffix: "Days", label: "Average delivery" },
  { n: "3", suffix: "×", label: "Revenue growth" },
  { n: "50", suffix: "+", label: "Local businesses" },
  { n: "30", suffix: "min", label: "Response on WhatsApp" },
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

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "glass" : "bg-transparent"}`}>
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 md:px-8">
        <Logo />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
          <a href="#industries" className="hover:text-foreground transition">Services</a>
          <a href="#industries" className="hover:text-foreground transition">Industries</a>
          <a href="#about" className="hover:text-foreground transition">About</a>
          <a href="#stories" className="hover:text-foreground transition">Stories</a>
          <a href="#contact" className="hover:text-foreground transition">Contact</a>
        </div>
        <a href="#trial" className="inline-flex items-center gap-2 rounded-full bg-gradient-red px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow hover:scale-[1.03] transition">
          Get Audit <ArrowRight className="h-4 w-4" />
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="absolute inset-0 -z-10 opacity-60" style={{ background: "radial-gradient(60% 50% at 50% 0%, hsl(var(--primary) / 0.35), transparent 70%)" }} />
      <div className="mx-auto max-w-6xl px-5 md:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-8">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-secondary">Hisar · Digital Media · Business Audits</span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight">
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
          <a href="#stories" className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-bold text-foreground hover:bg-surface-elevated transition">
            See what we build
          </a>
        </div>

        <div className="relative mt-16 md:mt-20">
          <div className="absolute inset-x-10 top-10 h-72 bg-gradient-red opacity-30 blur-3xl rounded-full -z-10" />
          <img
            src={heroLaptop}
            alt="CoreSoft premium website displayed on a MacBook"
            width={1920}
            height={1080}
            fetchPriority="high"
            className="mx-auto w-full max-w-4xl rounded-2xl shadow-elegant animate-float"
          />
          <div className="absolute -left-2 top-1/3 hidden md:flex glass rounded-2xl p-3 pr-4 gap-3 items-center shadow-card">
            <div className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-red text-primary-foreground">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold">+18 leads today</div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Live · Hisar</div>
            </div>
          </div>
          <div className="absolute -right-2 bottom-1/4 hidden md:flex glass rounded-2xl p-3 pr-4 gap-3 items-center shadow-card">
            <div className="grid place-items-center h-10 w-10 rounded-xl bg-secondary text-secondary-foreground font-black">4.9</div>
            <div className="text-left">
              <div className="flex gap-0.5 text-primary">{Array.from({length:5}).map((_,i)=><Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Avg client rating</div>
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
            <div key={s.label} className="bg-gradient-card p-8 md:p-10 text-center">
              <div className="text-5xl md:text-6xl font-black tracking-tight">
                {s.n}<span className="text-gradient-red">{s.suffix}</span>
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
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

function Stories() {
  return (
    <section id="stories" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="eyebrow">Client Results</p>
        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            Real businesses. <span className="text-gradient-red">Real growth.</span>
          </h2>
          <p className="text-foreground/70 max-w-md">
            Haryana ke local businesses jo CoreSoft ke saath scale kar rahe hain — unke words mein.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stories.map((s) => (
            <article key={s.name} className="rounded-3xl bg-gradient-card border border-border/40 p-7 shadow-card flex flex-col">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/15 text-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest">{s.tag}</span>
                <div className="flex gap-0.5 text-primary">{Array.from({length:5}).map((_,i)=><Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
              </div>
              <p className="mt-5 text-foreground/85 leading-relaxed">"{s.quote}"</p>
              <div className="mt-6 pt-5 border-t border-border/40 flex items-center gap-3">
                <div className="grid place-items-center h-11 w-11 rounded-full bg-gradient-red text-primary-foreground font-black text-sm">{s.initials}</div>
                <div>
                  <div className="font-bold text-sm">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.company}</div>
                </div>
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    try {
      const d = parsed.data;
      const msg =
        `Hi CoreSoft! 👋\n\n` +
        `Name: ${d.name}\n` +
        `Business: ${d.business} (${d.type})\n` +
        `Phone: ${d.phone}\n\n` +
        `What I need:\n${d.message}`;
      await new Promise((r) => setTimeout(r, 600));
      window.open(`${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
      toast({ title: "Opening WhatsApp…", description: "We'll reply within 30 minutes." });
      setValues({ name: "", business: "", type: "Restaurant / Café", phone: "", message: "" });
    } catch {
      toast({ title: "Something went wrong", description: "Please WhatsApp us directly.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fieldCls = (k: keyof LeadInput) =>
    `w-full rounded-lg bg-input/60 border px-4 py-3 text-sm focus:outline-none transition ${
      errors[k] ? "border-destructive focus:border-destructive" : "border-border/40 focus:border-primary"
    }`;

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="rounded-3xl bg-gradient-card border border-border/40 shadow-elegant overflow-hidden grid lg:grid-cols-2">
          <div className="p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-border/40">
            <p className="eyebrow">Let's Talk</p>
            <h2 className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
              Your audit is <span className="text-gradient-red">free.</span><br />Your growth isn't.
            </h2>
            <p className="mt-5 text-foreground/70">
              Send us a message — we'll review your business online and respond on WhatsApp within 30 minutes.
            </p>
            <div className="mt-8 space-y-4">
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="flex items-center gap-3 group">
                <div className="grid place-items-center h-11 w-11 rounded-xl bg-primary/15 text-primary"><Phone className="h-5 w-5" /></div>
                <div>
                  <div className="font-bold group-hover:text-primary transition">+91 81681 94134</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">WhatsApp · 30 min response</div>
                </div>
              </a>
              <div className="flex items-center gap-3">
                <div className="grid place-items-center h-11 w-11 rounded-xl bg-primary/15 text-primary"><MapPin className="h-5 w-5" /></div>
                <div>
                  <div className="font-bold">Hisar, Haryana · India</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Studio</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="grid place-items-center h-11 w-11 rounded-xl bg-primary/15 text-primary"><Mail className="h-5 w-5" /></div>
                <div>
                  <div className="font-bold">hello@coresoftsolutions.in</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email</div>
                </div>
              </div>
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
              <li><a href="mailto:hello@coresoftsolutions.in" className="hover:text-primary transition">hello@coresoftsolutions.in</a></li>
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

const Index = () => {
  return (
    <main>
      <Header />
      <Hero />
      <Marquee />
      <Stats />
      <Industries />
      <FreeTrial />
      <About />
      <Stories />
      <Contact />
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
