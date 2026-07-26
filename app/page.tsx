import { DealerFinder } from "@/components/DealerFinder";
import dealers from "@/data/dealers.json";
import type { Dealer } from "@/lib/types";

export const dynamic = "force-static";

export default function Home() {
  const dealerList = dealers as Dealer[];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pb-10 pt-8 sm:px-6">
      <header className="mb-8">
        <div className="mb-4 flex items-center gap-2.5">
          <LeafMark />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--leaf)]">
            Agri inputs
          </p>
        </div>
        <h1 className="font-display text-[2.75rem] leading-[1.05] tracking-tight text-[var(--ink)] sm:text-5xl">
          Sahyadri
        </h1>
        <p className="mt-3 max-w-sm text-base leading-relaxed text-[var(--muted)]">
          Find a dealer near you.
        </p>
      </header>

      <main className="flex-1">
        <DealerFinder dealers={dealerList} />
      </main>

      <footer className="mt-10 border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">
        Sample dealer data for demo use. Location is used only on your device to
        sort results.
      </footer>
    </div>
  );
}

function LeafMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M26 6C18 7 10 12 7 20c5 5 12 6 17 4 2-7-1-14-4-18z"
        fill="var(--leaf)"
      />
      <path
        d="M8 21c4-1 9-5 12-11"
        stroke="#e4f0e7"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
