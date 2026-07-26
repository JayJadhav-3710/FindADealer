"use client";

import { useId, useState, useTransition, type FormEvent } from "react";
import { DealerResult } from "@/components/DealerResult";
import {
  rankDealersByDistance,
  resolvePincodeOrigin,
} from "@/lib/geo";
import type { Dealer, RankedDealer } from "@/lib/types";

type SearchMode = "idle" | "pincode" | "location";

type DealerFinderProps = {
  dealers: Dealer[];
};

export function DealerFinder({ dealers }: DealerFinderProps) {
  const inputId = useId();
  const statusId = useId();
  const [pincode, setPincode] = useState("");
  const [results, setResults] = useState<RankedDealer[] | null>(null);
  const [mode, setMode] = useState<SearchMode>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [isPending, startTransition] = useTransition();

  function applyOrigin(
    origin: { latitude: number; longitude: number },
    nextMode: SearchMode,
    status: string,
  ) {
    startTransition(() => {
      setMode(nextMode);
      setMessage(status);
      setError(null);
      setResults(rankDealersByDistance(dealers, origin));
    });
  }

  function onPincodeSearch(event: FormEvent) {
    event.preventDefault();
    const pin = pincode.trim();
    const resolved = resolvePincodeOrigin(pin, dealers);

    if (!resolved.ok) {
      setResults(null);
      setMode("idle");
      setMessage(null);
      setError(
        resolved.reason === "invalid"
          ? "Enter a valid 6-digit pincode."
          : "No dealers found near this pincode. Try another pin or use your location.",
      );
      return;
    }

    const status =
      resolved.match === "exact"
        ? `Showing dealers nearest to ${pin}`
        : `No exact match for ${pin}. Showing dealers near pin codes starting with ${pin.slice(0, 3)}.`;

    applyOrigin(resolved.origin, "pincode", status);
  }

  function onUseLocation() {
    if (!navigator.geolocation) {
      setError("Location is not supported on this device. Search by pincode instead.");
      return;
    }

    setLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        applyOrigin(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          "location",
          "Showing dealers nearest to your location",
        );
      },
      (geoError) => {
        setLocating(false);
        setMode("idle");
        setResults(null);
        setMessage(null);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError(
            "Location permission denied. Allow location access or search by pincode.",
          );
        } else if (geoError.code === geoError.TIMEOUT) {
          setError("Location request timed out. Try again or search by pincode.");
        } else {
          setError("Could not get your location. Try again or search by pincode.");
        }
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60_000 },
    );
  }

  const busy = locating || isPending;
  const rankedCount =
    results?.filter((d) => d.distanceKm !== null).length ?? 0;

  return (
    <section className="w-full" aria-labelledby="finder-heading">
      <h2 id="finder-heading" className="sr-only">
        Search dealers
      </h2>

      <form
        onSubmit={onPincodeSearch}
        className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
      >
        <div className="min-w-0 flex-1">
          <label htmlFor={inputId} className="sr-only">
            Pincode
          </label>
          <input
            id={inputId}
            name="pincode"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            autoComplete="postal-code"
            placeholder="Enter 6-digit pincode"
            value={pincode}
            onChange={(e) =>
              setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="min-h-12 w-full rounded-xl border border-[var(--border)] bg-white/90 px-4 text-base text-[var(--ink)] shadow-sm outline-none ring-[var(--leaf)] placeholder:text-[var(--muted)] focus:ring-2"
            aria-describedby={statusId}
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="action-btn min-h-12 shrink-0 rounded-xl bg-[var(--leaf)] px-5 text-base font-semibold text-white disabled:opacity-60 sm:min-w-[8.5rem]"
        >
          Find dealers
        </button>
      </form>

      <button
        type="button"
        onClick={onUseLocation}
        disabled={busy}
        className="action-btn mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--leaf)] bg-white/60 px-4 text-sm font-semibold text-[var(--leaf)] disabled:opacity-60"
      >
        <LocateIcon spinning={locating} />
        {locating ? "Getting your location…" : "Use my location"}
      </button>

      <div
        id={statusId}
        className="mt-4 min-h-[1.25rem]"
        aria-live="polite"
        role="status"
      >
        {error && (
          <p className="text-sm font-medium text-[var(--alert)]">{error}</p>
        )}
        {!error && message && (
          <p className="text-sm text-[var(--muted)]">
            {message}
            {results && mode !== "idle" ? (
              <>
                {" "}
                · {rankedCount} with distance
              </>
            ) : null}
          </p>
        )}
        {!error && !message && mode === "idle" && (
          <p className="text-sm text-[var(--muted)]">
            Search by pincode or share your location to see nearby dealers.
          </p>
        )}
      </div>

      {results && results.length > 0 && (
        <div className="mt-2 divide-y-0 rounded-2xl border border-[var(--border)] bg-white/75 px-4 shadow-sm backdrop-blur-sm">
          {results.map((dealer, index) => (
            <DealerResult
              key={dealer.dealer_id}
              dealer={dealer}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function LocateIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={spinning ? "animate-spin" : undefined}
    >
      <path
        d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0-6a1 1 0 0 1 1 1v1.06A8.001 8.001 0 0 1 19.94 11H21a1 1 0 1 1 0 2h-1.06A8.001 8.001 0 0 1 13 19.94V21a1 1 0 1 1-2 0v-1.06A8.001 8.001 0 0 1 4.06 13H3a1 1 0 1 1 0-2h1.06A8.001 8.001 0 0 1 11 4.06V3a1 1 0 0 1 1-1z"
        fill="currentColor"
      />
    </svg>
  );
}
