import Link from "next/link";
import { Flame, LockOpen } from "lucide-react";

export default function LockedOrder() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center text-cream">
      <Link href="/" className="mb-10 font-display text-3xl font-semibold">
        OTRO<span className="text-ember">.</span>
      </Link>
      <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-ember/15 text-ember">
        <LockOpen className="h-7 w-7" />
      </span>
      <h1 className="mt-8 font-display text-4xl sm:text-5xl">
        This ordering link isn&apos;t <span className="italic text-sand">active.</span>
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-fog">
        Menus unlock at the table — scan the QR code on your table card, or use
        the current online link shared by the restaurant. QR codes rotate for
        security.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-ember px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-cream transition hover:bg-ember-soft"
        >
          <Flame className="h-4 w-4" />
          Visit homepage
        </Link>
      </div>
    </div>
  );
}
