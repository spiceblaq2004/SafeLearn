export const APP_NAME = "SafeLearn";
export const APP_TAGLINE =
  "Tutorials for Fire Safety and Disaster Management — published as they are ready.";

export const TOPICS = [
  "Fire Safety",
  "Disaster Management",
  "GIS & Mapping",
  "Emergency Response",
] as const;

export type Topic = (typeof TOPICS)[number];

export const PAYMENT = {
  priceGhs: 50,
  network: "Telecel Cash",
  number: "0509457095",
  numberDisplay: "050 945 7095",
  accountName: "Latif Bright",
} as const;

export const SUPPORT = {
  whatsappE164: "233246912468",
  whatsappDisplay: "024 691 2468",
  whatsappUrl: "https://wa.me/233246912468",
} as const;

export function formatGhs(amount: number) {
  return `GHS ${amount}`;
}

export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "tutorial";
}

export function youtubeId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) {
      return u.searchParams.get("v") ?? u.pathname.split("/").filter(Boolean).pop();
    }
  } catch {
    return null;
  }
  return null;
}
