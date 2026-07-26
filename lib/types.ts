export type Dealer = {
  dealer_id: string;
  dealer_name: string;
  town: string;
  district: string;
  state: string;
  pincode: string;
  phone: string;
  latitude: number | null;
  longitude: number | null;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type RankedDealer = Dealer & {
  distanceKm: number | null;
};

export type PincodeOriginResult =
  | { ok: true; origin: Coordinates; match: "exact" | "prefix" }
  | { ok: false; reason: "invalid" | "not_found" };
