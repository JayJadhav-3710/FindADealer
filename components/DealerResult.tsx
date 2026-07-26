import {
  directionsUrl,
  formatDistanceKm,
} from "@/lib/geo";
import { displayPhone, telHref, whatsappHref } from "@/lib/phone";
import type { RankedDealer } from "@/lib/types";

type DealerResultProps = {
  dealer: RankedDealer;
  index: number;
};

export function DealerResult({ dealer, index }: DealerResultProps) {
  const callHref = telHref(dealer.phone);
  const waHref = whatsappHref(dealer.phone);
  const mapsHref = directionsUrl(dealer);

  return (
    <article
      className="dealer-result border-b border-[var(--border)] py-5 last:border-b-0"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg leading-snug text-[var(--ink)]">
            {dealer.dealer_name}
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {dealer.town}, {dealer.district} · {dealer.pincode}
          </p>
          <p className="mt-0.5 text-sm text-[var(--muted)]">
            {displayPhone(dealer.phone)}
          </p>
        </div>
        <p className="shrink-0 rounded-md bg-[var(--leaf-soft)] px-2.5 py-1 text-sm font-semibold tabular-nums text-[var(--leaf)]">
          {formatDistanceKm(dealer.distanceKm)}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <a
          href={callHref}
          className="action-btn flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-[var(--leaf)] px-2 text-sm font-semibold text-white"
        >
          <PhoneIcon />
          Call
        </a>
        {waHref ? (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-[var(--soil)] px-2 text-sm font-semibold text-white"
          >
            <WhatsAppIcon />
            WhatsApp
          </a>
        ) : (
          <span className="flex min-h-11 items-center justify-center rounded-lg bg-[var(--border)] px-2 text-sm text-[var(--muted)]">
            WhatsApp
          </span>
        )}
        {mapsHref ? (
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-[var(--leaf)] bg-white/70 px-2 text-sm font-semibold text-[var(--leaf)]"
          >
            <DirectionsIcon />
            Directions
          </a>
        ) : (
          <span
            className="flex min-h-11 items-center justify-center rounded-lg border border-[var(--border)] px-2 text-sm text-[var(--muted)]"
            title="Coordinates unavailable"
          >
            Directions
          </span>
        )}
      </div>
    </article>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.6 10.8c1.5 3 3.6 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"
        fill="currentColor"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.5A9.5 9.5 0 0 0 4.2 16.7L3 21l4.4-1.1A9.5 9.5 0 1 0 12 2.5zm0 17.3c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-2.6.7.7-2.5-.2-.3A7.4 7.4 0 1 1 12 19.8zm4.1-5.5c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1l-.7.9c-.1.1-.3.2-.5.1-1.4-.7-2.3-1.6-3-3-.1-.2 0-.4.1-.5l.7-.8c.1-.1.1-.3.1-.5l-.6-1.5c-.1-.3-.3-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.7.7-1 1.6-1 2.6 0 .2 0 .4.1.6.4 1.6 1.4 3.1 2.7 4.3 1.5 1.4 3.4 2.4 5.4 2.8.6.1 1.1.2 1.7.2.6 0 1.3-.1 1.9-.3.5-.2.9-.7 1.1-1.2.1-.3.1-.6.1-.8 0-.1-.1-.2-.3-.3z"
        fill="currentColor"
      />
    </svg>
  );
}

function DirectionsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12.7 3.3a1 1 0 0 0-1.4 0l-8 8a1 1 0 0 0 0 1.4l8 8a1 1 0 0 0 1.4 0l8-8a1 1 0 0 0 0-1.4l-8-8zM13 14v-2h-3v3H8v-4a1 1 0 0 1 1-1h4V8l3 3-3 3z"
        fill="currentColor"
      />
    </svg>
  );
}
