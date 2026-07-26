import type {
  Coordinates,
  Dealer,
  PincodeOriginResult,
  RankedDealer,
} from "./types";

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function haversineKm(a: Coordinates, b: Coordinates): number {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function formatDistanceKm(km: number | null): string {
  if (km === null || Number.isNaN(km)) return "Distance unavailable";
  if (km < 1) return "< 1 km";
  return `${km.toFixed(1)} km`;
}

export function hasCoordinates(
  dealer: Dealer,
): dealer is Dealer & { latitude: number; longitude: number } {
  return (
    typeof dealer.latitude === "number" &&
    typeof dealer.longitude === "number" &&
    Number.isFinite(dealer.latitude) &&
    Number.isFinite(dealer.longitude)
  );
}

function averageOrigin(dealers: Dealer[]): Coordinates | null {
  const withCoords = dealers.filter(hasCoordinates);
  if (withCoords.length === 0) return null;

  const sum = withCoords.reduce(
    (acc, d) => ({
      latitude: acc.latitude + d.latitude,
      longitude: acc.longitude + d.longitude,
    }),
    { latitude: 0, longitude: 0 },
  );

  return {
    latitude: sum.latitude / withCoords.length,
    longitude: sum.longitude / withCoords.length,
  };
}

export function resolvePincodeOrigin(
  pincode: string,
  dealers: Dealer[],
): PincodeOriginResult {
  const pin = pincode.trim();
  if (!/^\d{6}$/.test(pin)) {
    return { ok: false, reason: "invalid" };
  }

  const exact = dealers.filter((d) => d.pincode === pin);
  if (exact.length > 0) {
    const origin = averageOrigin(exact);
    if (origin) {
      return { ok: true, origin, match: "exact" };
    }
  }

  const prefix = pin.slice(0, 3);
  const byPrefix = dealers.filter((d) => d.pincode.startsWith(prefix));
  const origin = averageOrigin(byPrefix);
  if (origin) {
    return { ok: true, origin, match: "prefix" };
  }

  return { ok: false, reason: "not_found" };
}

export function rankDealersByDistance(
  dealers: Dealer[],
  origin: Coordinates,
): RankedDealer[] {
  const ranked: RankedDealer[] = dealers.map((dealer) => {
    if (!hasCoordinates(dealer)) {
      return { ...dealer, distanceKm: null };
    }
    return {
      ...dealer,
      distanceKm: haversineKm(origin, {
        latitude: dealer.latitude,
        longitude: dealer.longitude,
      }),
    };
  });

  return ranked.sort((a, b) => {
    if (a.distanceKm === null && b.distanceKm === null) return 0;
    if (a.distanceKm === null) return 1;
    if (b.distanceKm === null) return -1;
    return a.distanceKm - b.distanceKm;
  });
}

export function directionsUrl(dealer: Dealer): string | null {
  if (!hasCoordinates(dealer)) return null;
  const dest = `${dealer.latitude},${dealer.longitude}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
}
