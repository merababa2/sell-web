"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  AtSign,
  Bike,
  ChefHat,
  Clock,
  Flame,
  Lock,
  MapPin,
  Phone,
  QrCode,
  ShoppingBag,
  Star,
  UtensilsCrossed,
} from "lucide-react";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=OTRO+Sulaiyel+Al-Jahra+Jassem+Mohammad+Al-Kharafi+Rd+Al+Jahra+Kuwait";
const MAP_EMBED =
  "https://maps.google.com/maps?q=OTRO%20Sulaiyel%20Al%20Jahra%20Kuwait&z=15&output=embed";

const SIGNATURES = [
  {
    n: "01",
    name: "Truffle Pizza",
    ar: "بيتزا الترافل",
    note: "Black truffle cream, fior di latte, rocket",
    img: "https://images.pexels.com/photos/5993865/pexels-photo-5993865.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    n: "02",
    name: "Otro Rigatoni",
    ar: "ريجاتوني أوترو",
    note: "Our namesake pasta, stracciatella",
    img: "https://images.pexels.com/photos/24289216/pexels-photo-24289216.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    n: "03",
    name: "Mushroom Arancini",
    ar: "أرانشيني المشروم",
    note: "Golden risotto, wild mushroom heart",
    img: "https://images.pexels.com/photos/31372390/pexels-photo-31372390.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    n: "04",
    name: "Chocolate Dome",
    ar: "قبة الشوكولاتة",
    note: "Molten centre, melted tableside",
    img: "https://images.pexels.com/photos/16052376/pexels-photo-16052376.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    n: "05",
    name: "Turkish Breakfast",
    ar: "فطار تركي متعدد الأصناف",
    note: "A weekend ritual, done properly",
    img: "https://images.pexels.com/photos/20230771/pexels-photo-20230771.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    n: "06",
    name: "Passion Fruit Mojito",
    ar: "موهيتو باشن فروت",
    note: "Zero-proof, full-flavour",
    img: "https://images.pexels.com/photos/11009204/pexels-photo-11009204.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
];

const MARQUEE = [
  "Truffle Pizza",
  "Sizzling Mac & Cheese",
  "Turkish Breakfast",
  "Chocolate Dome",
  "Passion Fruit Mojito",
  "Otro Rigatoni",
  "Labneh & Makdous",
  "Diavola Pizza",
  "Pumpkin Soup",
  "Saffron Cake",
];

const fadeUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
};

function OpenChip({ openNow }: { openNow: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs tracking-wide backdrop-blur">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          openNow ? "bg-emerald-400 animate-pulse-dot" : "bg-red-400"
        }`}
      />
      {openNow ? "Open now · closes 11 PM" : "Closed · opens 9 AM"}
    </span>
  );
}

export default function Landing({ openNow }: { openNow: boolean }) {
  return (
    <div className="relative overflow-x-clip bg-ink text-cream">
      {/* ── Nav ─────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#" className="font-display text-2xl font-semibold tracking-tight">
            OTRO<span className="text-ember">.</span>
          </a>
          <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.22em] text-fog sm:flex">
            <a href="#story" className="transition hover:text-cream">
              Story
            </a>
            <a href="#signatures" className="transition hover:text-cream">
              Signatures
            </a>
            <a href="#visit" className="transition hover:text-cream">
              Visit
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <OpenChip openNow={openNow} />
            <Link
              href="/admin"
              aria-label="Owner login"
              className="hidden h-8 w-8 items-center justify-center rounded-full border border-white/10 text-fog transition hover:border-ember/50 hover:text-ember sm:flex"
            >
              <Lock className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/18126715/pexels-photo-18126715.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920"
            alt="Wood-fired truffle pizza at OTRO"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-ink/40" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-14 pt-40 sm:px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-sand"
          >
            <Flame className="h-3.5 w-3.5 text-ember" />
            Sulaiyel · Al Jahra · Kuwait
          </motion.p>

          <h1 className="font-display leading-[0.9]">
            <motion.span
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="block text-lg italic text-sand sm:text-2xl"
            >
              cucina
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="block text-[26vw] font-semibold tracking-tight sm:text-[19vw] lg:text-[13rem]"
            >
              OTRO<span className="text-ember">.</span>
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55 }}
            className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-sand"
          >
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-gold text-gold" />
              3.8 · 163 reviews
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UtensilsCrossed className="h-4 w-4 text-ember" />
              KWD 5–10 per person
            </span>
            <span dir="auto" className="font-arabic text-base text-cream/80">
              مطبخ حديث وقهوة مختصة
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#order"
              className="group inline-flex items-center gap-3 rounded-full bg-ember px-7 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-cream transition-colors hover:bg-ember-soft"
            >
              <QrCode className="h-4.5 w-4.5 transition-transform group-hover:rotate-6" />
              Scan to order
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 text-sm uppercase tracking-[0.15em] text-cream/90 backdrop-blur transition hover:border-cream/60"
            >
              Get directions
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>

        <motion.a
          href="#story"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-6 right-6 z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-white/15 text-fog sm:flex"
          aria-label="Scroll down"
        >
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </motion.a>
      </section>

      {/* ── Marquee ─────────────────────────────────────────── */}
      <div className="relative z-20 -rotate-1 border-y border-ember/40 bg-ember py-3.5 text-ink">
        <div className="flex w-max animate-marquee items-center gap-8 pr-8">
          {[...MARQUEE, ...MARQUEE].map((dish, i) => (
            <span
              key={i}
              className="flex items-center gap-8 whitespace-nowrap font-display text-lg italic text-cream"
            >
              {dish}
              <Flame className="h-3.5 w-3.5 text-cream/70" />
            </span>
          ))}
        </div>
      </div>

      {/* ── Story ───────────────────────────────────────────── */}
      <section id="story" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div {...fadeUp}>
            <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-ember">
              The other table
            </p>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">
              Where truffle meets
              <span className="italic text-sand"> tanoor.</span>
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-fog">
              OTRO — Spanish for “the other” — is Al Jahra&apos;s modern kitchen and
              specialty coffee house inside Sulaiyel. A wood oven, a slow-simmered
              sugo, Levantine breakfasts and desserts with a reputation. Come
              hungry, leave converted.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: UtensilsCrossed, label: "Dine-in" },
                { icon: ShoppingBag, label: "Takeaway" },
                { icon: Bike, label: "Delivery" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-coal px-4 py-2.5 text-xs uppercase tracking-[0.2em] text-sand"
                >
                  <Icon className="h-3.5 w-3.5 text-ember" />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl border border-line">
              <img
                src="https://images.pexels.com/photos/33672311/pexels-photo-33672311.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                alt="Turkish breakfast at OTRO"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 rounded-2xl border border-line bg-coal/95 px-6 py-5 backdrop-blur sm:-left-8">
              <p className="font-display text-3xl text-ember">9 AM – 11 PM</p>
              <p className="mt-1 text-xs uppercase tracking-[0.25em] text-fog">
                Every day
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Signatures ──────────────────────────────────────── */}
      <section id="signatures" className="border-t border-line bg-coal/50 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div {...fadeUp} className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-ember">
                House signatures
              </p>
              <h2 className="font-display text-4xl sm:text-5xl">
                The plates people
                <span className="italic text-sand"> talk about.</span>
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-fog">
              A teaser of what&apos;s cooking. Full menu with prices unlocks at your
              table.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SIGNATURES.map((dish, i) => (
              <motion.article
                key={dish.n}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: (i % 3) * 0.1 }}
                className="dish-card group relative overflow-hidden rounded-3xl border border-line bg-ink"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={dish.img}
                    alt={dish.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 font-display text-sm italic text-cream/70">
                    {dish.n}
                  </span>
                  <Flame className="absolute right-4 top-4 h-4 w-4 text-ember opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <div className="flex items-start justify-between gap-3 p-5">
                  <div>
                    <h3 className="font-display text-xl">{dish.name}</h3>
                    <p className="mt-1 text-xs text-fog">{dish.note}</p>
                  </div>
                  <p dir="rtl" className="font-arabic text-sm text-sand">
                    {dish.ar}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Order access explainer ──────────────────────────── */}
      <section id="order" className="relative overflow-hidden py-24 sm:py-32">
        <div
          className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-ember/10 blur-[120px]"
          aria-hidden
        />
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-ember">
              QR-only ordering
            </p>
            <h2 className="font-display text-4xl sm:text-5xl">
              The menu lives
              <span className="italic text-sand"> at your table.</span>
            </h2>
            <p className="mt-5 leading-relaxed text-fog">
              For freshness and fair pricing, browse the full menu and order
              straight from your phone — only through the QR code on your table,
              or the online link shared by the restaurant for pickup &amp;
              delivery.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: QrCode,
                step: "01",
                title: "Scan the table QR",
                text: "Point your camera at the code on your table — the menu opens instantly, no app needed.",
              },
              {
                icon: UtensilsCrossed,
                step: "02",
                title: "Browse & build your order",
                text: "Full menu with live prices in KWD, photos, and dish details — add to your tray as you please.",
              },
              {
                icon: ChefHat,
                step: "03",
                title: "Straight to the kitchen",
                text: "Your order lands on the pass with your table number. We bring it out — you just enjoy.",
              },
            ].map(({ icon: Icon, step, title, text }, i) => (
              <motion.div
                key={step}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.12 }}
                className="relative rounded-3xl border border-line bg-coal p-8"
              >
                <span className="absolute right-6 top-5 font-display text-5xl italic text-cream/10">
                  {step}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ember/15 text-ember">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-display text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fog">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visit ───────────────────────────────────────────── */}
      <section id="visit" className="border-t border-line bg-coal/50 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div {...fadeUp}>
              <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-ember">
                Find us
              </p>
              <h2 className="mb-8 font-display text-4xl sm:text-5xl">
                Sulaiyel,
                <span className="italic text-sand"> Al Jahra.</span>
              </h2>

              <ul className="space-y-5 text-sm">
                <li className="flex items-start gap-4">
                  <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-ember" />
                  <div>
                    <p className="text-cream">
                      Sulaiyel, Jassem Mohammad Al-Kharafi Rd, Al Jahra, Kuwait
                    </p>
                    <p dir="rtl" className="mt-0.5 font-arabic text-fog">
                      سليل الجهراء، شارع جاسم محمد الخرافي
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Clock className="h-4.5 w-4.5 shrink-0 text-ember" />
                  <span className="text-cream">
                    Daily 9:00 AM – 11:00 PM{" "}
                    <span className="text-fog">
                      · {openNow ? "open now" : "closed now"}
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="h-4.5 w-4.5 shrink-0 text-ember" />
                  <a href="tel:+96560001778" className="text-cream hover:text-ember">
                    +965 6000 1778
                  </a>
                </li>
                <li className="flex items-center gap-4">
                  <AtSign className="h-4.5 w-4.5 shrink-0 text-ember" />
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cream hover:text-ember"
                  >
                    instagram.com
                  </a>
                </li>
                <li className="flex items-center gap-4">
                  <QrCode className="h-4.5 w-4.5 shrink-0 text-ember" />
                  <span className="text-fog">Plus code: 9J7X+MH Al Jahra, Kuwait</span>
                </li>
              </ul>

              <div className="mt-9">
                <OpenChip openNow={openNow} />
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
              className="overflow-hidden rounded-3xl border border-line"
            >
              <iframe
                title="OTRO location map"
                src={MAP_EMBED}
                className="h-full min-h-[380px] w-full grayscale invert-[0.92] hue-rotate-180 saturate-[0.4]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="relative overflow-hidden border-t border-line">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:px-8">
          <p className="text-outline select-none text-center font-display text-[24vw] font-semibold leading-none sm:text-[13rem]">
            OTRO
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.2em] text-fog">
            <p>© {new Date().getFullYear()} OTRO · Al Jahra, Kuwait</p>
            <div className="flex items-center gap-6">
              <a href="#story" className="hover:text-cream">
                Story
              </a>
              <a href="#visit" className="hover:text-cream">
                Visit
              </a>
              <Link href="/admin" className="inline-flex items-center gap-1.5 hover:text-ember">
                <Lock className="h-3 w-3" />
                Owner login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
